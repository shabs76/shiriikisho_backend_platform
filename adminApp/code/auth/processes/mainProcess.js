import authDbObj from "../dbQueries/index.js";
import _ from "lodash";
import dotenv from 'dotenv';
import util from 'util';
import base32Encode from 'base32-encode';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { mainActsClass } from "../../req/main.js";
import GenApis from "../../api/gen.js";
dotenv.config();

export class mainProssClass extends mainActsClass{
    constructor(){
        super();
    }

    adminProcessRegistration = async (regInfo) => {
        if (typeof (regInfo.adminDet) !== 'object') {
            const er = {
                state: 'error',
                data: 'Admin details are missing please try again'
            }
            return er;
        } else if (!_.isArray(regInfo.permDet) || _.isEmpty(regInfo.permDet)) {
            const er = {
                state: 'error',
                data: 'Any admin is required to have atleast one permission'
            }
            return er;
        }

        // check if type submitted exists
        const typeAns = await authDbObj.selectAdminTypes([regInfo.adminDet.type]);
        if (!_.isArray(typeAns) || _.isEmpty(typeAns)) {
            const er ={
                state: 'error',
                data: 'Invalid user type'
            }
            return er;
        }
        regInfo.adminDet.password = this.generateStrongPassword();
        const addAns = await authDbObj.addAdminDetails(regInfo.adminDet);
        if (addAns.state !== 'success') {
            return addAns;
        }

        for (let ind = 0; ind < regInfo.permDet.length; ind++) {
            const perm_id = regInfo.permDet[ind];
            if (typeof (perm_id) === 'string') {
                const nc = {
                    permission_id: perm_id,
                    admin_id: addAns.data.admin_id
                };
                const insAns = await authDbObj.addAdminPermissions(nc);
                if (insAns.state !== 'success') {
                    this.Mlogger.error(insAns);
                    const del = await authDbObj.deleteAdminDetails(addAns.data.admin_id);
                    if (del.state !== 'success') {
                        this.Mlogger.error(del);
                    }
                    return insAns;
                }
            } else {
                // delete alread added admin
                const del = await authDbObj.deleteAdminDetails(addAns.data.admin_id);
                if (del.state !== 'success') {
                    this.Mlogger.error(del);
                }
                const err = {
                    state: 'error',
                    data: 'Invaid permission was sent'
                }
                return err;
            }
        }
        const smsAns = await GenApis.sendTextApI(`Your ${process.env.APP_NAME} login password will be ${regInfo.adminDet.password}`, regInfo.adminDet.phone);
        if (smsAns.state !== 'success') {
            // delete alread added admin
            const del = await authDbObj.deleteAdminDetails(addAns.data.admin_id);
            if (del.state !== 'success') {
                this.Mlogger.error(del);
            }
            const err = {
                state: 'error',
                data: 'Password forwarding error.'
            }
            return err;
        }
        const succ = {
            state: 'success',
            data: 'System admin was successfully created.'
        }
        return succ;
    }

    addingPermissionListProcess = async (permissions) => {
        if (!_.isArray(permissions) || _.isEmpty(permissions)) {
            const err = {
                state: 'error',
                data: 'Invalid data format was submitted'
            }
            return err;
        }

        let errNumb = 0;
        for (let peInd = 0; peInd < permissions.length; peInd++) {
            const sav = await authDbObj.addPermissionToList(permissions[peInd]);
            if (sav.state !== 'success') {
                this.Mlogger.error(sav);
                errNumb++;
            }
        }

        if (errNumb === permissions.length) {
            const er = {
                state: 'error',
                data: 'All permissions could not be uploaded, check logs for more info'
            }
            return er;
        } else if (errNumb !== 0) {
            const sce = {
                state: 'success',
                data: errNumb+' permissions could not be uploaded. Check logs for more info'
            }
            return sce;
        } else {
            const sc = {
                state: 'success',
                data: 'Permissions were successfully uploaded'
            }
            return sc;
        }

    }

    addingTypesListProcess = async (types) => {
        if (!_.isArray(types) || _.isEmpty(types)) {
            const err = {
                state: 'error',
                data: 'Invalid data format was submitted'
            }
            return err;
        }

        let errNumb = 0;
        for (let peInd = 0; peInd < types.length; peInd++) {
            const sav = await authDbObj.addingAdminTypes(types[peInd]);
            if (sav.state !== 'success') {
                this.Mlogger.error(sav);
                errNumb++;
            }
        }

        if (errNumb === types.length) {
            const er = {
                state: 'error',
                data: 'All Types could not be uploaded, check logs for more info'
            }
            return er;
        } else if (errNumb !== 0) {
            const sce = {
                state: 'success',
                data: errNumb+' type(s) could not be uploaded. Check logs for more info'
            }
            return sce;
        } else {
            const sc = {
                state: 'success',
                data: 'Types were successfully uploaded'
            }
            return sc;
        }
    }

    initSignProcesses = async (signInfo) => {
        if (typeof (signInfo.phone) !== 'string' || typeof (signInfo.password) !== 'string') {
            const err = {
                state: 'error',
                data: 'Missing information. Please submit both password and phone number'
            }
            return err;
        }

        // select user with the phone number
        const adminD = await authDbObj.selectAdminDetails([signInfo.phone], "  `phone` = ? ");
        if (!_.isArray(adminD)) {
            this.Mlogger.error(adminD);
            const er = {
                state: 'error',
                data: 'An error has occurred while fetching your data'
            }
            return er;
        } else if (_.isArray(adminD) && _.isEmpty(adminD)) {
            const er = {
                state: 'error',
                data: 'Wrong phone number or password. Please check your credentials and try again-'
            }
            return er;
        }

        const admin = adminD[0];
        // now check password for match
        const pasAns = await bcrypt.compare(signInfo.password, admin.password);
        if (!pasAns) {
            const err = {
                state: 'error',
                data: 'Wrong phone number or password. Please check your credentials and try again'
            }
            return err;
        }

        // now check if user has otp setup 
        const otpC = await authDbObj.selectOtpConf([admin.admin_id]);
        if (!_.isArray(otpC)) {
            this.Mlogger.error(otpC);
            const er = {
                state: 'error',
                data: 'An expected error has occurred while verifying your information'
            }
            return er;
        } else if (_.isArray(otpC) && _.isEmpty(otpC)) {
            // set up otp oconfig
            const buffer = await util.promisify(crypto.randomBytes)(14);
            const secret = base32Encode(buffer, 'RFC4648', { padding: false });
            const savDat = {
                admin_id: admin.admin_id,
                key: secret
            }
            const savAns = await authDbObj.addingOtpConfForAdmin(savDat);
            if (savAns.state !== 'success') {
                this.Mlogger.error(savAns);
                const er = {
                    state: 'error',
                    data: 'An error has occurred during setting up process. Please try again'
                }
                return er;
            }
            const succ = {
                state: 'success',
                data: 'password was successfully',
                code_id: savAns.data.conf_id,
                code_st: 'created'
            }
            return succ;
        }

        const otpD = otpC[0];
        const succ = {
            state: 'success',
            data: 'password was successfully',
            code_id: otpD.conf_id,
            code_st: otpD.status
        }
        return succ;
    }

    codeVerificationProcess = async (info) => {
        if (typeof (info.code_id) !== 'string' || typeof (info.code) !== 'string' || typeof (info.ip) !== 'string') {
            const er = {
                state: 'error',
                data: 'Missing data verification'
            }
            return er;
        }

        // check for configaration status and secret
        const confAn = await authDbObj.selectOtpConf([info.code_id], "  `conf_id` = ?");
        if (!_.isArray(confAn)) {
            const er = {
                state: 'error',
                data: 'An error has occurred while fecting details. Please try again'
            }
            return er;
        } else if (_.isArray(confAn) && _.isEmpty(confAn)) {
            const er = {
                state: 'error',
                data: 'Invalid request was submitted please refresh the page and try again'
            }
            return er;
        }

        const confD = confAn[0];
        // decrypt data
        const secKey = this.decrypt(confD.key_text);
        // check status
        if (confD.status !== 'active') {
            const upC = {
                status: 'active',
                conf_id: info.code_id
            }
            const upDat = await authDbObj.updateOtpConfStatus(upC);
            if (upDat.state !== 'success') {
                return upDat;
            }
        }
        // verify code
        if (!this.verifyTOTP(info.code, secKey)) {
            const wrongContz = await authDbObj.selectWrongOTPTimer([info.code_id], " `instance_id` = ? ");
            if (!_.isArray(wrongContz) || (_.isArray(wrongContz) && _.isEmpty(wrongContz))) {
                const wrongOTpinf = {
                    admin_id: confD.admin_id,
                    instance_id: info.code_id,
                    ip_address: info.ip,
                }
                const addAns = await authDbObj.addingInitWrongOTP(wrongOTpinf);
                if (addAns.state !== 'success') {
                    this.Mlogger.error(addAns);
                }
            } else {
                // issue an update to number
                const updAns = await authDbObj.updateWrongOTpNumber({ wrong_id: wrongContz[0].wrong_id, counts: parseInt(wrongContz[0].countz) + 1 });
                if (updAns.state !== 'success') {
                    this.Mlogger.error(updAns);
                }
                // test if it is more than 5 times wrong and issue an IP block
                const whiteIPs = await authDbObj.selectWhiteIP([info.ip]);
                if (!_.isArray(whiteIPs) || (_.isArray(whiteIPs) && _.isEmpty(whiteIPs))) {
                    // start block issuing process
                    if (parseInt(wrongContz[0].countz) + 1 >= parseInt(process.env.MAX_OTP_WRONG_NUMBER)) {
                        const blcoData = {
                            ip_address: info.ip,
                            reason: process.env.MAX_OTP_WRONG_NUMBER+' wrong otp verifications in a row',
                            expire_hrs: 12,
                        }
                        const blockAns = await authDbObj.addingBlockIp(blcoData);
                        if (blockAns.state !== 'success') {
                            this.Mlogger.error(blockAns);
                        }
                    }
                }
            }
            const er = {
                state: 'error',
                data: 'Wrong verification code'
            }
            return er;
        }
        // delete any block counts of the user
        await authDbObj.deleteWrongOTPConts(info.code_id);
        // setting up login information
        const logKey = this.createRandCharsRef(12);
        const logSess = this.createRandCharsRef(14);
        const logInfo = {
            admin_id: confD.admin_id,
            login_key: logKey,
            login_session: logSess,
            expire_mins: 60
        }
        const logAns = await authDbObj.addingLoginInfo(logInfo);
        if (logAns.state !== 'success') {
            this.Mlogger.error(logAns);
            const er = {
                state: 'error',
                data: 'Unable to log you into your account. Please try again'
            }
            return er;
        }
        const sc = {
            state: 'success',
            data: 'You have login to your account successfully',
            logKey,
            logSess
        }
        return sc;
    }

    verifyingLoginsProcess = async (logKey, logSess) => {
        const logUserDat = await authDbObj.selectAdminWithLogins([logKey], " `login_key` = ? AND `exipire_date` > CURRENT_TIMESTAMP");
        console.log(logKey);
        if (!_.isArray(logUserDat)) {
            this.Mlogger.error(logUserDat);
            const er = {
                state: 'error',
                data: 'Unable to verify your details. Please try again'
            }
            return er;
        } else if (_.isArray(logUserDat) && _.isEmpty(logUserDat)) {
            const er = {
                state: 'error',
                data: 'Invalid user details, you have to login',
                ky: 'logout'
            }
            return er;
        }

        // verify logsess
        if (!bcrypt.compareSync(logSess, logUserDat[0].login_session)) {
            const er = {
                state: 'error',
                data: 'Invalid session',
                ky: 'logout'
            }
            return er;
        }

        const sc = {
            state: 'success',
            data: 'Verification was successful',
            user: logUserDat[0]
        }
        return sc;
    }

    checkUserPermissions = async (logKey, logSess, req_perm, req_type) => {
        const logDet = await this.verifyingLoginsProcess(logKey, logSess);
        if (logDet.state !== 'success') {
            return logDet;
        }

        const admin_id = logDet.user.admin_id;
        const admin_type = logDet.user.type;

        const typeInfo = await authDbObj.selectAdminTypes([admin_type], " `admin_type` = ? ");
        if (!_.isArray(typeInfo)) {
            this.Mlogger.error(typeInfo);
            const er = {
                state: 'error',
                data: 'Permission on types checks has failed'
            }
            return er;
        } else if (_.isArray(typeInfo) && _.isEmpty(typeInfo)) {
            const er = {
                state: 'error',
                data: 'Invalid permission type.'
            }
            return er;
        }
        if (typeInfo[0].type_number > req_type) {
            const er = {
                state: 'error',
                data: 'You have no hard permission to perform this task'
            }
            return er;
        }
        const permissionInfo = await authDbObj.selectAdminPermissionsDetail([admin_id, req_perm], " `admin_id` = ? AND  `permission_number` >= ? ");
        if (!_.isArray(permissionInfo)) {
            this.Mlogger.error(permissionInfo);
            const er = {
                state: 'error',
                data: 'Permission check has failed'
            }
            return er;
        } else if (_.isArray(permissionInfo) && _.isEmpty(permissionInfo)) {
            const er = {
                state: 'error',
                data: 'You have no permission to this activity'
            }
            return er;
        }

        const sc = {
            state: 'success',
            data: 'user has permission to the activity',
            user_id: admin_id
        }

        return sc;
    }

    logoutAdminAuthProcess = async (logKey, logSess) => {
        const logDet = await this.verifyingLoginsProcess(logKey, logSess);
        if (logDet.state !== 'success' && typeof (logDet.ky) !== 'string') {
            return logDet;
        } else if (logDet.state !== 'success' && typeof (logDet.ky) === 'string') {
            const er = {
                state: 'success',
                data: 'Logout was completed'
            }
            return er;
        }
        // use normal update methods
        const logUpd = await authDbObj.updateAdminLogins({login_key: logKey, status: 'logout'});
        if (logUpd.state !== 'success') {
            const er = {
                state: 'error',
                data: 'Could not logout your account. Please try again'
            }
            return er;
        }
        const sc = {
            state: 'success',
            data: 'You have successfully logout your account'
        }
        return sc;
    }

    registerServiceAuthProcess = async (info) => {
        if (!_.isArray(info)) {
            return {
                state: 'error',
                data: 'Invalid data type was submited'
            }
        }
        let sucN = 0;
        for (let ind = 0; ind < info.length; ind++) {
            const element = info[ind];
            if (typeof (element) !== 'object') {
                return {
                    state: 'error',
                    data: 'Invalid service auth. Please check your data and try again'
                }
            }
            const saveAns = await authDbObj.addingServiceAuthInfo(element);
            if (typeof (saveAns.state) !== 'string') {
                this.Mlogger.error(saveAns);
                return {
                    state: 'error',
                    data: 'Critical error has occurred while saving service auth'
                }
            } else if (typeof (saveAns.state) === 'string' && saveAns.state === 'success') {
                sucN++;
            }
        }

        if (sucN === 0) {
            return {
                state: 'error',
                data: 'Could not add any service auth'
            }
        } else {
            return {
                state: 'success',
                data: sucN+' services out of '+info.length+' were successfully added'
            }
        }  
    }

    validateServiceAuth = async (info) => {
        if (typeof (info.serviceName) !== 'string' || typeof (info.serviceSecret) !== 'string') {
            const er = {
                state: 'error',
                data: 'Missing validation info'
            }
            return er;
        }
        const servInfo = await authDbObj.selectServiceAuth([info.serviceName]);
        if (!_.isArray(servInfo)) {
            this.Mlogger.error(servInfo);
            const er = {
                state: 'error',
                data: 'Unkwon error has occurred while validating your request'
            }
            return er;
        } else if (_.isArray(servInfo) && _.isEmpty(servInfo)) {
            const er = {
                state: 'error',
                data: 'Validation failed. User missing'
            }
            return er;
        }

        // now check password/secret
        if (!bcrypt.compareSync(info.serviceSecret, servInfo[0].service_secret)) {
            const er = {
                state: 'error',
                data: 'Validation has failed.'
            }
            return er;
        }
        const sc = {
            state: 'success',
            data: 'Validation was successful'
        }
        return sc;
    }
}

const mainProcsObj = new mainProssClass();
export default mainProcsObj;