import _ from "lodash";
import authDbObj from "../dbQueries/index.js";
import { mainActsClass } from "../../req/main.js";
import bcrypt from "bcrypt";


class authProcess extends mainActsClass {
    constructor(){
        super();
    }

    registerVehicleTypes = async (data) => {
        const permInf = {
            logKey: data.logKey,
            logSess: data.logSess,
            req_perm: 110,
            req_type: 310
        }
        const permCheck = await this.checkAdminPermissions(permInf);
        if (permCheck.state !== 'success') {
            return permCheck;
        }
        // now insert vehicles types
        const vhAns = await authDbObj.addingVehiclesTypes(data);
        return vhAns;   
    }

    registerParkAreaProcess = async (data) => {
        const permInf = {
            logKey: data.logKey,
            logSess: data.logSess,
            req_perm: 110,
            req_type: 310
        }
        const permCheck = await this.checkAdminPermissions(permInf);
        if (permCheck.state !== 'success') {
            return permCheck;
        }
        if (typeof (data.ward_id) !== 'string') {
            const er = {
                state: 'error',
                data: 'Ward information does not exits'
            }
            return er;
        }
        // pull location details to get number and ward -id
        const seleWard = await authDbObj.selectAllLocationDetailsUsingWard([data.ward_id]);
        if (!_.isArray(seleWard)) {
            this.Mlogger.error(seleWard);
            const er = {
                state: 'error',
                data: 'An error has occured while trying to access location details of the parking area.'
            }
            return er;
        } else if (_.isArray(seleWard) && _.isEmpty(seleWard)) {
            const er = {
                state: 'error',
                data: 'The ward does not exist. Please check and try again'
            }
            return er;
        }

        // select number of parks in that in the ward area
        const nng = await authDbObj.selectParkAreasDetails([data.ward_id], " `ward` = ?");
        if (!_.isArray(nng)) {
            this.Mlogger.error(nng);
            const er = {
                state: 'error',
                data: 'Unable to get park number due to an error.'
            }
            return er;
        }

        // set number 
        const pakNm = seleWard[0].region_code+seleWard[0].district_code+seleWard[0].ward_code+'-'+this.padNumber(nng.length+1,3);
        data.park_number = pakNm;
        // now add park area
        const parkAns = await authDbObj.addingParkAreas(data);
        return parkAns;
    }

    registerPermissionListProcess = async (data) => {
        const permInf = {
            logKey: data.logKey,
            logSess: data.logSess,
            req_perm: 110,
            req_type: 110
        }
        const permCheck = await this.checkAdminPermissions(permInf);
        if (permCheck.state !== 'success') {
            return permCheck;
        }
        // now add permission one by one
        
        let sucNo = 0;
        for (let ind = 0; ind < data.Permissions.length; ind++) {
            const element = data.Permissions[ind];
            if (typeof (element) !== 'object') {
                const er = {
                    state: 'error',
                    data: 'Invalid permission format was submitted'
                }
                return er;
            }
            const permAns = await authDbObj.addingPermissionDetails(element);
            if (permAns.state === 'success') {
                sucNo++;
            } else {
                this.Mlogger.error(permAns);
            }
        }

        if (sucNo === 0) {
            const er = {
                state: 'error',
                data: 'Could not add any permission'
            }
            return er;
        }

        const sc = {
            state: 'success',
            data: sucNo+' permissions out of '+data.Permissions.length+' were successfully saved'
        }
        return sc;
    }

    registerDriverLeadersTypesAndPermissions = async (data) => {
        const permInf = {
            logKey: data.logKey,
            logSess: data.logSess,
            req_perm: 110,
            req_type: 110
        }
        const permCheck = await this.checkAdminPermissions(permInf);
        if (permCheck.state !== 'success') {
            return permCheck;
        }

        // now add type and permission
        let sucNo = 0;
        for (let ind = 0; ind < data.typeData.length; ind++) {
            const element = data.typeData[ind];
            if (typeof (element) !== 'object' || !_.isArray(element.perms)) {
                const er = {
                    state: 'error',
                    data: 'Invalid data format was submited'
                }
                return er;
            }
            const typAnc = await authDbObj.addingDriverLeadersTypes(element);
            if (typAnc.state === 'success') {
                // now add permissions to the type
                let subSuc = true;
                for (let JS = 0; JS < element.perms.length; JS++) {
                    const pelement = element.perms[JS];
                    if (typeof (pelement) !== 'string') {
                        subSuc = false;
                        // issue delete to leader type
                        const ansDel = await authDbObj.deleteLeaderType(typAnc.data.type_id);
                        if (ansDel.state !== 'success') {
                            this.Mlogger.error(ansDel);
                        }
                    }
                    const permIns = {
                        permission_id: pelement,
                        type_id: typAnc.data.type_id
                    }
                    const perTypeAns = await authDbObj.addingPermissionLeaderTypesRels(permIns);
                    if (perTypeAns.state !== 'success') {
                        subSuc = false;
                        this.Mlogger.error(perTypeAns);
                        const ansDel = await authDbObj.deleteLeaderType(typAnc.data.type_id);
                        if (ansDel.state !== 'success') {
                            this.Mlogger.error(ansDel);
                        }
                    }
                }
                if (subSuc) {
                    sucNo++;
                }
            }
        }

        if (sucNo === 0) {
            const er = {
                state: 'error',
                data: 'Unable to add leader type please try again'
            }
            return er;
        }

        const sc = {
            state: 'success',
            data: sucNo+' types of leaders out of '+data.typeData.length+' were successfully added.'
        }
        return sc;
    }

    verifyDriverPhoneInitProcess = async (phone, user_id, stating = 'norepeat') => {
        // check if the phone number is valid phone number
        if (!authProcessObj.isValidPhone(phone) || typeof (user_id) !== 'string') {
            const er = {
                state: 'error',
                data: 'Invalid phone number or user.'
            }
            return er;
        }
        // set sign otp 
        const otp = authProcessObj.createRandNubs(6);
        // save otp 
        const saveInfo = {
            user_id,
            phone,
            otp,
        }

        const savOtp = await authDbObj.addingSignOtp(saveInfo);
        if (savOtp.state !== 'success') {
            this.Mlogger.error(savOtp);
            const er ={
                state: 'error',
                data: 'Mfumo umeshindwa kutengeneza namba ya uhakiki. Tafadhali jaribu tena'
            }
            return er;
        }

        // check if the phone number exists
        const drDets = await authDbObj.selectDriverDetails([phone], " `phone` = ?");
        if (!_.isArray(drDets)) {
            const er = {
                state: 'error',
                data: 'Hitilasfu imetokea wakati wakukagua namba ya simu'
            }
            return er;
        } else if (_.isArray(drDets) && !_.isEmpty(drDets) && stating === 'norepeat') {
            const er = {
                state: 'error',
                data: 'Namba ya simu imeshatumika kusajili dereva mwingine'
            }
            return er;
        }

        // send otp to user 
        const textInfo = {
            phone,
            sms: otp+' Itakuwa namba ya udhibitisho kwenye mfumo wa shirikisho.'
        }
        const sendTextAns = await this.sendNormalTexts(textInfo);
        if (sendTextAns.state !== 'success') {
            const er = {
                state: 'error',
                data: 'Mfumo umeshindwa kutuma ujumbe uwa udhibitisho. Tafadhali jaribu tena'
            }
            return er;
        }

        // return success with code to track verification
        const sc = {
            state: 'success',
            data: 'Namba ya uthibitisho imetumwa kwenye number ya simu +'+phone,
            otp_id: savOtp.data.otp_id
        }
        return sc;
    }

    resendCodeProcess = async (otp_id) => {
        if (typeof (otp_id) !== 'string') {
            const er = {
                state: 'error',
                data: 'Missing information'
            }
            return er;
        }
        // get otp info
        const otAns = await authDbObj.selectSignOtpInfo([otp_id, 'active'], " `otp_id` = ? AND `expire_date` > CURRENT_TIMESTAMP AND `status` = ?");
        if (!_.isArray(otAns)) {
            const er = {
                state: 'error',
                data: 'Tatizo limejitokeza kwenye mfumo. Tafadali jaribu tena'
            }
            return er;
        } else if (_.isArray(otAns) && _.isEmpty(otAns)) {
            const er = {
                state: 'error',
                data: 'Taarifa za uthibitisho huu hazipo au zimekwisha muda wake. Tafadhali rudi nyuma uweke numba ya simu tena.'
            }
            return er;
        }

        // update status of the otp to used.
        const infCo = {
            otp_id,
            status: 'active',
            otp: authProcessObj.createRandNubs(6),
        }
        const upAns = await authDbObj.updateStatusOfSignOtp(infCo);
        if (upAns.state !== 'success') {
            this.Mlogger.error(upAns);
            const er = {
                state: 'error',
                data: 'Mfumo umeshindwa badilisha number ya uthibitisho. Tafadhali jaribu tena'
            }
            return er;
        }

        // send new otp
        const textInfo = {
            phone: otAns[0].phone,
            sms: infCo.otp+' Itakuwa namba ya uthibitisho kwenye mfumo wa shirikisho.'
        }
        const sendTextAns = await this.sendNormalTexts(textInfo);
        if (sendTextAns.state !== 'success') {
            const er = {
                state: 'error',
                data: 'Mfumo umeshindwa kutuma ujumbe uwa uthibitisho. Tafadhali jaribu tena'
            }
            return er;
        }

        const sc = {
            state: 'success',
            data: 'Ujumbe wa number ya umetumwa kwenye simu +'+otAns[0].phone
        }

        return sc;

    }

    verifyDriverPhoneCodeProcess = async (code, otp_id, usex = 'out') => {
        if (typeof (code) !== 'number' || typeof (otp_id) !== 'string') {
            const er = {
                state: 'error',
                data: 'Missing information please try again'
            }
            return er;
        }

        // get otp info
        const otAns = await authDbObj.selectSignOtpInfo([otp_id, 'active'], " `otp_id` = ? AND `expire_date` > CURRENT_TIMESTAMP AND `status` = ?");
        if (!_.isArray(otAns)) {
            const er = {
                state: 'error',
                data: 'Tatizo limejitokeza kwenye mfumo. Tafadali jaribu tena'
            }
            return er;
        } else if (_.isArray(otAns) && _.isEmpty(otAns)) {
            const er = {
                state: 'error',
                data: 'Taarifa za uthibitisho huu hazipo au zimekwisha muda wake. Tafadhali rudi nyuma uweke numba ya simu tena.'
            }
            return er;
        }
        // compare codes
        if (!bcrypt.compareSync(`${code}`, otAns[0].otp)) {
            const er = {
                state: 'error',
                data: 'Number ya uthibitisho sio sahihi. Tafadhali nakili kwa makini.'
            }
            return er;
        }

        // save verified phone number
        const savAns = await authDbObj.addingVerifiedPhone({ phone: otAns[0].phone });
        if (savAns.state !== 'success') {
            this.Mlogger.error(savAns);
            const er = {
                state: 'error',
                data: 'Zoezi limefeli kwa sababu za kimfumo. Tafadhali jaribu tena'
            }
            return er;
        }
        // update status of the otp to used.
        const infCo = {
            otp_id,
            status: 'used',
            otp: this.createRandNubs(6),
        }
        const upAns = await authDbObj.updateStatusOfSignOtp(infCo);
        if (upAns.state !== 'success') {
            this.Mlogger.error(upAns);
        }

        if (usex === 'internal') {
            const sc = {
                state: 'success',
                data: 'Uthibitisho wa number ya simu umefanikiwa.',
                verid: savAns.data.pverid,
                user_id: otAns[0].user_id
            }
            return sc;
        }

        // return success user_id
        const sc = {
            state: 'success',
            data: 'Uthibitisho wa number ya simu umefanikiwa.',
            verid: savAns.data.pverid
        }
        return sc;
    }

    registerDriversProcess = async (data) => {
        if (typeof (data.park_area) !== 'string') {
            const er = {
                state: 'error',
                data: 'Taarifa za kituo hazipo. Jaribu kuangalia taarifa zako vizuri.'
            }
            return er;
        }
        // check if parking area has space for this new driver
        const parkAns = await this.numberCalculatorForDriverInParkArea(data.park_area);
        if (parkAns.state !== 'success') {
            return parkAns;
        } else if (parkAns.numremaing <= 0) {
            const er = {
                state: 'error',
                data: 'Kituo ulichochagua kimejaa wanachama. Tafadhali chagua kituo kingine'
            }
            return er;
        }

        // check if phone number verification exists and get phone number
        // const veriPhone = await this.checkForValidVerifiedPhoneIdProcess(data.verid); 
        // if (veriPhone.state !== 'success') {
        //     return veriPhone;
        // }
        data.phone = veriPhone.phone;
        const regAns = await authDbObj.addingdriversDetails(data);
        return regAns;
    }

    checkForValidVerifiedPhoneIdProcess = async (verid) => {
        const pvAns = await authDbObj.selectVerifiedPhone([verid, 'active'], " `pverid` = ? AND `status` = ? ");
        if (!_.isArray(pvAns)) {
            const er = {
                state: 'error',
                data: 'Tatizo la kimfumo mimejitokeza. Tafadhali jaribu tena'
            }
            return er;
        } else if (_.isArray(pvAns) && _.isEmpty(pvAns)) {
            const er = {
                state: 'error',
                data: 'Taarifa ya uthibisho wa number ya simu unakosekana. Tafadhali rudi sehemu ya kwanza.'
            }
            return er;
        }
        const sc = {
            state: 'success',
            data: 'Phone number was verified',
            phone: pvAns[0].phone,
        }
        return sc;
    }

    validateDriverProcess = async (data) => {
        // check if driver and validator are on the same park area
        const driverDets = await authDbObj.selectDriverDetails([data.driver_id], "`driver_id` = ?");
        if (!_.isArray(driverDets)) {
            this.Mlogger.error(driverDets);
            const er = {
                state: 'error',
                data: 'Tatizo limejitokeza kwenye mfumo. Tafadhali jaribu tena'
            }
            return er;
        } else if (_.isArray(driverDets) && _.isEmpty(driverDets)) {
            const er = {
                state: 'error',
                data: 'Taarifa za dereva sio sahihi. Au number yake haipo sahihi.'
            }
            return er;
        }

        const valiDets = await authDbObj.selectDriverDetails([data.validator_id], "`driver_id` = ? AND `status` = 'active'");
        if (!_.isArray(valiDets)) {
            this.Mlogger.error(valiDets);
            const er = {
                state: 'error',
                data: 'Tatizo limejitokeza kwenye mfumo. Tafadhali jaribu tena'
            }
            return er;
        } else if (_.isArray(valiDets) && _.isEmpty(valiDets)) {
            const er = {
                state: 'error',
                data: 'Taarifa za kiongozi sio sahihi. Au number yake haipo sahihi.'
            }
            return er;
        }

        if (driverDets[0].park_area !== valiDets[0].park_area) {
            const er = {
                state: 'error',
                data: 'Kiongozi wa kituo cha dereva husika ndio anaweza kuhakiki taarifa za dereva wa kituo husika.'
            }
            return er;
        }
        
        // get park number and last driver number.
        const prkInf = await authDbObj.selectParkAreasDetails([driverDets[0].park_area]);
        if (!_.isArray(prkInf)) {
            const er = {
                state: 'error',
                data: 'Mfumo umeshindwa kupata taarifa za kituo kwa sasa #1. Tafadhali jaribu tena.'
            }
            return er;
        } else if (_.isArray(prkInf) && _.isEmpty(prkInf)) {
            const er = {
                state: 'error',
                data: 'Mfumo umeshindwa kupata taarifa za kituo kwa sasa #2. Tafadhali jaribu tena.'
            }
            return er;
        }
        
        data.uniformNum = this.padNumber(parseInt(prkInf[0].last_driver_number)+1);
        data.uniformNum = prkInf[0].park_number+data.uniformNum;
        const insAns = await authDbObj.addingUniformNumberofDriver(data);
        if (insAns.state !== 'success') {
            this.Mlogger.error(insAns);
            const er = {
                state: 'error',
                data: 'Mfumo umeshindwa kutengeneza number ya sare kwa sasa. Tafadhali jaribu tena'
            }
            return er;
        }

        // change last driver number in a given park area
        const lstInf = {
            park_id: driverDets[0].park_area,
            new_lastNumb: parseInt(prkInf[0].last_driver_number)+1
        }
        const lsyAns = await authDbObj.updateParkAreaLastDriverNumber(lstInf);
        if (lsyAns.state !== 'success') {
            this.Mlogger.error(lsyAns);
            // issue a delete to the uniform
            const delAns = await authDbObj.deleteDriverUniform(insAns.data.uniform_id);
            if (delAns.state !== 'success') {
                this.Mlogger.error(delAns);
            }
            const er = {
                state: 'error',
                data: 'Zoezi la kutengeneza namba ya sare limeshindikana'
            }
            return er;
        }
        // update status to active 
        const stAns = await authDbObj.updateDriverStatus({ driver_id: data.driver_id, status: 'active'});
        if (stAns.state !== 'success') {
            this.Mlogger.error(stAns);
            // delete uniform
            const delAns = await authDbObj.deleteDriverUniform(insAns.data.uniform_id);
            if (delAns.state !== 'success') {
                this.Mlogger.error(delAns);
            }
            const er = {
                state: 'error',
                data: 'Zoezi la kutengeneza namba ya sare ya kiongozi limeshindikana. #2'
            }
            return er;
        }

        const sc = {
            state: 'success',
            data: 'Unimefanikiwa kuhakiki taarifa za dereva '+driverDets[0].fname
        }
        return sc;

    }

    invalidateDriverProcess = async (data) => {
        // check if driver and validator are on the same park area
        const driverDets = await authDbObj.selectDriverDetails([data.driver_id], "`driver_id` = ?");
        if (!_.isArray(driverDets)) {
            this.Mlogger.error(driverDets);
            const er = {
                state: 'error',
                data: 'Tatizo limejitokeza kwenye mfumo. Tafadhali jaribu tena'
            }
            return er;
        } else if (_.isArray(driverDets) && _.isEmpty(driverDets)) {
            const er = {
                state: 'error',
                data: 'Taarifa za dereva sio sahihi. Au number yake haipo sahihi.'
            }
            return er;
        }

        const valiDets = await authDbObj.selectDriverDetails([data.validator_id], "`driver_id` = ? AND `status` = 'active'");
        if (!_.isArray(valiDets)) {
            this.Mlogger.error(valiDets);
            const er = {
                state: 'error',
                data: 'Tatizo limejitokeza kwenye mfumo. Tafadhali jaribu tena'
            }
            return er;
        } else if (_.isArray(valiDets) && _.isEmpty(valiDets)) {
            const er = {
                state: 'error',
                data: 'Taarifa za kiongozi sio sahihi. Au number yake haipo sahihi.'
            }
            return er;
        }

        if (driverDets[0].park_area !== valiDets[0].park_area) {
            const er = {
                state: 'error',
                data: 'Kiongozi wa kituo cha dereva husika ndio anaweza kuhakiki taarifa za dereva wa kituo husika.'
            }
            return er;
        }

        // update status to blocked
        const stAns = await authDbObj.updateDriverStatus({ driver_id: data.driver_id, status: 'blocked'});
        if (stAns.state !== 'success') {
            this.Mlogger.error(stAns);
            const er = {
                state: 'error',
                data: 'Zoezi la kutengeneza namba ya sare ya kiongozi limeshindikana. #2'
            }
            return er;
        }

        const sc = {
            state: 'success',
            data: 'Unimefanikiwa kukataa dereva '+driverDets[0].fname+' kwenye kituo chako'
        }
        return sc;

    }

    voteDriverToLeadership = async (data) => {
        const permInf = {
            logKey: data.logKey,
            logSess: data.logSess,
            req_perm: 910,
            req_type: 310
        }
        const permCheck = await this.checkAdminPermissions(permInf);
        if (permCheck.state !== 'success') {
            return permCheck;
        }

        // checking if this park has that type of leader
        const psAns = await authDbObj.selectParkLeadersData([data.leaderData.leader_type, data.leaderData.park_id, 'active'], " `leader_type` = ? AND `park_id` =? AND park_leaders.status = ? ");
        if (!_.isArray(psAns)) {
            const er = {
                state: 'error',
                data: 'An error has occurred while checking for existing leaders'
            }
            return er;
        } else if (_.isArray(psAns) && !_.isEmpty(psAns)) {
            const er = {
                state: 'error',
                data: 'This park has '+psAns[0].type_name+' already'
            }
            return er;
        }
        // check if leader is not active and request for uniform number
        const drAns = await authDbObj.selectDriverDetails([data.leaderData.driver_id], " `driver_id` = ? ");
        if (_.isArray(drAns) && _.isEmpty(drAns)) {
            const er = {
                state: 'error',
                data: 'Driver does not exist.'
            }
            return er;
        } else if (!_.isArray(drAns)) {
            const er = {
                state: 'error',
                data: 'An error has occurred while fetching driver details.'
            }
            return er;
        }
        if (drAns[0].status !== 'active') {
            // get park number and last driver number.
            const prkInf = await authDbObj.selectParkAreasDetails([data.leaderData.park_id]);
            if (!_.isArray(prkInf)) {
                const er = {
                    state: 'error',
                    data: 'Mfumo umeshindwa kupata taarifa za kituo kwa sasa #1. Tafadhali jaribu tena.'
                }
                return er;
            } else if (_.isArray(prkInf) && _.isEmpty(prkInf)) {
                const er = {
                    state: 'error',
                    data: 'Mfumo umeshindwa kupata taarifa za kituo kwa sasa #2. Tafadhali jaribu tena.'
                }
                return er;
            }
            const unData = {
                driver_id: data.leaderData.driver_id,
                validator_id: data.logKey,
            }
            unData.uniformNum = this.padNumber(parseInt(prkInf[0].last_driver_number)+1);
            unData.uniformNum = prkInf[0].park_number+unData.uniformNum;
            const insAns = await authDbObj.addingUniformNumberofDriver(unData);
            if (insAns.state !== 'success') {
                this.Mlogger.error(insAns);
                const er = {
                    state: 'error',
                    data: 'Mfumo umeshindwa kutengeneza number ya sare kwa sasa. Tafadhali jaribu tena'
                }
                return er;
            }

            // change last driver number in a given park area
            const lstInf = {
                park_id: data.leaderData.park_id,
                new_lastNumb: parseInt(prkInf[0].last_driver_number)+1
            }
            const lsyAns = await authDbObj.updateParkAreaLastDriverNumber(lstInf);
            if (lsyAns.state !== 'success') {
                this.Mlogger.error(lsyAns);
                // issue a delete to the uniform
                const delAns = await authDbObj.deleteDriverUniform(insAns.data.uniform_id);
                if (delAns.state !== 'success') {
                    this.Mlogger.error(delAns);
                }
                const er = {
                    state: 'error',
                    data: 'Zoezi la kutengeneza namba ya sare ya kiongozi limeshindikana'
                }
                return er;
            }
            // update status to active 
            const stAns = await authDbObj.updateDriverStatus({ driver_id: data.leaderData.driver_id, status: 'active'});
            if (stAns.state !== 'success') {
                this.Mlogger.error(stAns);
                // delete uniform
                const delAns = await authDbObj.deleteDriverUniform(insAns.data.uniform_id);
                if (delAns.state !== 'success') {
                    this.Mlogger.error(delAns);
                }
                const er = {
                    state: 'error',
                    data: 'Zoezi la kutengeneza namba ya sare ya kiongozi limeshindikana. #2'
                }
                return er;
            }
        }
        // adding vote to leadership
        const vsAns = await authDbObj.addingParkLeadersDetails(data.leaderData);
        if (vsAns.state === 'success') {
            // now send text
            const ansText = await this.sendNormalTexts({phone: drAns[0].phone, sms: 'Umefanikiwa kuwa kiongozi kwenye kituo chacko. Ingia kwenye application ya shirikisho kwa taarifa zaidi'});
            this.Mlogger.debug(ansText);  
        }
        return vsAns;
    }

    loginInitDriverProcess = async (phone, password) => {
        // select user with the phone number
        const dAns = await authDbObj.selectDriverDetails([phone], " `phone` = ? ");
        if (!_.isArray(dAns)) {
            this.Mlogger.error(dAns);
            const er = {
                state: 'error',
                data: 'Tatizo limejitokeza wakati wakupata taarifa zako. Tafadhali jaribu tena.'
            }
            return er;
        } else if (_.isArray(dAns) && _.isEmpty(dAns)) {
            const er = {
                state: 'error',
                data: 'Namba ya simu haipo tafadhali jisajili.'
            }
            return er;
        }
        // check if driver details has been verified
        if (dAns[0].status !== 'created' && dAns[0].status !== 'active') {
            const er = {
                state: 'error',
                data: 'Huwezi kuingia kwenye mfumo mpaka taarifa zako zi hakikiwe. Tafadhali wasiliana na kiongozi wa kituo chako'
            }
            return er;
        }

        // check password
        if (!bcrypt.compareSync(`${password}`, dAns[0].password)) {
            const er = {
                state: 'error',
                data: 'Neno la siri au namba ya simu sio sahihi. Tafadhali hakikisha na ujaribu tena.'
            }
            return er;
        }

        // send login code.
        const ansPhCO = await this.verifyDriverPhoneInitProcess(phone, dAns[0].driver_id, 'repeat');
        return ansPhCO;
    }

    loginLastCodeDriverProcess = async (code, otp_id) => {
        // verify code
        const veAns = await this.verifyDriverPhoneCodeProcess(code, otp_id);
        if (veAns.state !== 'success') {
            return veAns;
        }
        // select driver id  using otp
        const otAns = await authDbObj.selectSignOtpInfo([otp_id], " `otp_id` = ? ");
        // save login details
        const svInfo = {
            expire_mins: 504,
            driver_id: otAns[0].user_id
        }
        const saveLogin = await authDbObj.addingDriverLogins(svInfo);
        return saveLogin;
    }

    checkDriversLoginStatus = async (info) => {
        if (typeof (info.logKey) !== 'string' || typeof (info.logSess) !== 'string') {
            const er = {
                state: 'error',
                data: 'Taarifa za kiusajili zimekosekana. Tafadhali ingia tena kwenye account yako kupata huduma hii.'
            }
            return er;
        }
        // check login status
        const stAns = await authDbObj.selectLoginInfo([info.logKey, 'active'], " `login_key` = ? AND `status` = ? ");
        if (!_.isArray(stAns)) {
            this.Mlogger.error(stAns);
            const er = {
                state: 'error',
                data: 'Tatizo kwenye mfumo limejitokeza wakati wa tafuta taarifa za kiusajili. Tafadhali jaribu tena'
            }
            return er;
        } else if (_.isArray(stAns) && _.isEmpty(stAns)) {
            const er = {
                state: 'error',
                data: 'Taarifa za kiusajili zimekwisha muda wake. Tafadhali ingia tena kwenye account yako.'
            }
            return er;
        }
        // validate loginsess
        if (!bcrypt.compareSync(`${info.logSess}`, stAns[0].login_session)) {
            const er = {
                state: 'error',
                data: 'Taarifa za kiusajili sio sahihi. Tafadhali ingia tena kwenye account yako.'
            }
            return er;
        }

        const sc = {
            state: 'success',
            data: 'Taarifa za kiusajili zipo sahihi.',
            driver_id: stAns[0].driver_id,
        }
        return sc;
    }

    logoutDriverProcess = async (info) => {
        if (typeof (info.logKey) !== 'string' || typeof (info.logSess) !== 'string') {
            const er = {
                state: 'error',
                data: 'Taarifa za kiusajili zimekosekana. Tafadhali ingia tena kwenye account yako kupata huduma hii.'
            }
            return er;
        }
        // check login status
        const stAns = await authDbObj.selectLoginInfo([info.logKey, 'active'], " `login_key` = ? AND `status` = ? ");
        if (!_.isArray(stAns)) {
            this.Mlogger.error(stAns);
            const er = {
                state: 'error',
                data: 'Tatizo kwenye mfumo limejitokeza wakati wa tafuta taarifa za kiusajili. Tafadhali jaribu tena'
            }
            return er;
        } else if (_.isArray(stAns) && _.isEmpty(stAns)) {
            const er = {
                state: 'success',
                data: 'Akaunti ilikuwa imeshatoka'
            }
            return er;
        }

        const upSt = await authDbObj.updateStatusLoginInfo({login_key: info.logKey, status: 'logout'});
        if (upSt.state != 'success') {
            this.Mlogger.error(upSt);
            const er = {
                state: 'error',
                data: 'Mfumo unashindwa kukutoa kwenye akaunti yako. Tafadhali jaribu tena'
            }
            return er;
        }

        const sc = {
            state: 'success',
            data: 'Umefanikiwa kujitoa kwenye akaunti yako'
        }
        return sc;
    }


    permissionCheckDriversProcess = async (info) => {
        if (typeof (info.perm_no) !== 'number') {
            const er = {
                state: 'error',
                data: 'Ruhusa hitajika haijawasiliswa'
            }
            return er;
        }
        const LogStat = await this.checkDriversLoginStatus(info);
        if (LogStat.state !== 'success') {
            return LogStat;
        }
        // now using driver_id check if driver is a leader
        const pemCheck = await authDbObj.selectParkLeaders([LogStat.driver_id, 'active'], " `driver_id` = ? AND `status` = ?");
        if (!_.isArray(pemCheck)) {
            const er = {
                state: 'error',
                data: 'Tatizo limetokea wakati wa kuangalia taarifa za kiogozi. Tafadhali jaribu tena'
            }
            return er;
        } else if (_.isArray(pemCheck) && _.isEmpty(pemCheck)) {
            const er = {
                state: 'error',
                data: 'Wewe sio kiongozi huna uwezo wa kufanya tendo hili'
            }
            return er;
        }

        // using leader_type check permission number if leader has it
        const ansPem = await authDbObj.selectLeaderTypesPermissions([pemCheck[0].leader_type, info.perm_no], "leaders_types_permissions.type_id = ? AND `permission_number` = ? ");
        if (!_.isArray(ansPem)) {
            const er = {
                state: 'error',
                data: 'Tatitizo limetokea wakuangalia ruhusa ya uwongozi wako.'
            }
            return er;
        } else if (_.isArray(ansPem) && _.isEmpty(ansPem)) {
            const er = {
                state: 'error',
                data: 'Huna ruhusa ya kufanya kitendo hichi. Tafadhali wasiliana na viongozi wako kwa maeelezo zaidi.'
            }
            return er;
        }

        const sc = {
            state: 'success',
            data: 'Unaruhusa wa kufanya kitendo hichi',
            driver_id: LogStat.driver_id
        }
        return sc;
    }

    numberCalculatorForDriverInParkArea = async (park_id) =>{
        if (typeof (park_id) !== 'string') {
            const er = {
                state: 'error',
                data: 'Invalid parking area id'
            }
            return er;
        }

        // check if park area exists
        const pak = await authDbObj.selectParkAreasDetails([park_id, 'active'], " `park_id` = ? AND `status` =? ");
        if (!_.isArray(pak)) {
            const er ={
                state: 'error',
                data: 'An error has occurred while fetching parking area details'
            }
            return er;
        } else if (_.isArray(pak) && _.isEmpty(pak)) {
            const er = {
                state: 'error',
                data: 'Kituo hakipo au kimeshafutiwa usajili. Tafadhali chagua kituo kingine'
            }
            return er;
        }

        const numBx = await authDbObj.selectDriverNumbers([park_id, 'deleted'], " `park_area` = ? AND `status` != ? ");
        if (!_.isArray(numBx)) {
            this.Mlogger.error(numBx);
            const er = {
                state: 'error',
                data: 'An error occurred while fetching driver numbers'
            }
            return er;
        } else if (_.isArray(numBx) && _.isEmpty(numBx)) {
            const er = {
                state: 'error',
                data: 'Unable to get driver number in a parking area'
            }
            return er;
        }

        const sc = {
            state: 'success',
            numremaing: parseInt(pak[0].park_size) - parseInt(numBx[0].drivers)
        }

        return sc;
    }

    forgetPasswordInitProcess = async (phoneNumber = '') => {
        // check if there is an account with the phone number
        const dAns = await authDbObj.selectDriverDetails([phoneNumber, 'deleted'], " `phone` = ? AND `status` != ? ");
        if (!_.isArray(dAns)) {
            this.Mlogger.error(dAns);
            const er = {
                state: 'error',
                data: 'Tatizo limejitokeza wakati wakupata taarifa zako. Tafadhali jaribu tena.'
            }
            return er;
        } else if (_.isArray(dAns) && _.isEmpty(dAns)) {
            const er = {
                state: 'error',
                data: 'Namba ya simu haipo tafadhali jisajili.'
            }
            return er;
        }
        // send login code.
        const ansPhCO = await this.verifyDriverPhoneInitProcess(phoneNumber, dAns[0].driver_id, 'repeat');
        return ansPhCO;
    }


    fogertPassLastProcess = async (info) => {
        if (typeof (info.password) !== 'string' || typeof (info.code) !== 'number' || typeof (info.otp_id) !== 'string') {
            const er = {
                state: 'error',
                data: 'Missing information. Try again'
            }
            return er;
        }
        // check if the code is correct.
        const veAns = await this.verifyDriverPhoneCodeProcess(info.code, info.otp_id, 'internal');
        if (veAns.state !== 'success') {
            return veAns;
        }
        // update password.
        const abs = await authDbObj.updateDriverPassword({ driver_id: veAns.user_id, password: info.password});
        if (abs.state !== 'success') {
            this.Mlogger.error(abs);
            const er = {
                state: 'error',
                data: 'Mfumo umeshindwa kubadili neno lako la siri'
            }
            return er;
        }
        const sc = {
            state: 'success',
            data: 'Umefanikiwa kubadili neno la siri.'
        }
        return sc;
    }

    registerNewCountryProcess = async (data) => {
        const permInf = {
            logKey: data.logKey,
            logSess: data.logSess,
            req_perm: 110,
            req_type: 310
        }
        const permCheck = await this.checkAdminPermissions(permInf);
        if (permCheck.state !== 'success') {
            return permCheck;
        }
        const ansxc = await authDbObj.addingCountriesDetails(data);
        return ansxc;
    }

    registerNewRegionProcess = async (data) => {
        const permInf = {
            logKey: data.logKey,
            logSess: data.logSess,
            req_perm: 110,
            req_type: 310
        }
        const permCheck = await this.checkAdminPermissions(permInf);
        if (permCheck.state !== 'success') {
            return permCheck;
        }
        // now add region information
        const Ansc = await authDbObj.addingRegionsDetails(data);
        return Ansc;
    }


    registerNewDistrictProcess = async (data) => {
        const permInf = {
            logKey: data.logKey,
            logSess: data.logSess,
            req_perm: 110,
            req_type: 310
        }
        const permCheck = await this.checkAdminPermissions(permInf);
        if (permCheck.state !== 'success') {
            return permCheck;
        }
        // now add new district information
        const anx = await authDbObj.addingDistrictDetails(data);
        return anx;
    }

    registerNewWardProcess = async (data) => {
        const permInf = {
            logKey: data.logKey,
            logSess: data.logSess,
            req_perm: 110,
            req_type: 310
        }
        const permCheck = await this.checkAdminPermissions(permInf);
        if (permCheck.state !== 'success') {
            return permCheck;
        }
        // now add new district information
        const ansc = await authDbObj.addingWardDetails(data);
        return ansc;
    }

}

const authProcessObj = new authProcess();
export default authProcessObj;