import { mainActsClass } from "../../req/main.js";
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import crypto from 'crypto';
dotenv.config();

export class insertDBClass extends mainActsClass {
    dbConn;
    transConn;
    constructor() {
        super();
        const database = this.dbNames('gene');
        this.dbConn = this.connv(database);
    }


    addAdminDetails = async (info) => {
        try {
            const requireVals = ['fname', 'lname', 'dp', 'phone', 'email', 'type', 'password'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const admin_id = this.createRandChars(12, 'ADM');
            const password = bcrypt.hashSync(info.password, 10);
            const [createAns] = await this.dbConn.query(`
            INSERT INTO admin_details(admin_id, fname, lname, dp, phone, email, type, status, password, admin_date) VALUES (?,?,?,?,?,?,?,?,?, CURRENT_TIMESTAMP)
            `,[admin_id, info.fname, info.lname, info.dp, info.phone, info.email, info.type, 'created', password]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Admin was successfully created',
                        admin_id
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not save admin details. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not save admin details. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addPermissionToList = async (info) => {
        try {
            const requireVals = ['permission_name', 'permission_number'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const perm_id = this.createRandChars(12, 'PERM');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO permissions_list(permission_id, permission_name, permission_number, perm_date) VALUES (?,?,?, CURRENT_TIMESTAMP)
            `,[perm_id, info.permission_name, info.permission_number ]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'permission was successfully created',
                        perm_id
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not save permission to the list. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not save permission to the list. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addAdminPermissions = async (info) => {
        try {
            const requireVals = ['permission_id', 'admin_id'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const perm_id = this.createRandChars(12, 'PERM_ADM');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO admin_permissions(admin_perm_id, admin_id, permission_id, rel_date) VALUES (?,?,?, CURRENT_TIMESTAMP)
            `,[perm_id, info.admin_id, info.permission_id ]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'permission was successfully added to admin',
                        perm_id
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add permission to admin. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add permission to admin. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addAdminStatusChange = async (info) => {
        try {
            const requireVals = ['admin_id', 'to_type', 'from_type', 'to_status', 'from_status'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const stch_id = this.createRandChars(12, 'ADM_ST_TY');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO admin_status_type_changes(change_id, admin_id, to_type, from_type, to_status, from_status, change_date) VALUES (?,?,?,?,?,?, CURRENT_TIMESTAMP)
            `,[stch_id, info.admin_id, info.to_type, info.from_type, info.to_status, info.from_status ]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Admin status and type change were successfully added to admin',
                        change_id: stch_id,
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add status and type change to admin. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add status and type change to admin. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }


    addingBlockIp = async (info) => {
        try {
            const requireVals = ['ip_address', 'reason', 'expire_hrs'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            if (typeof (info.expire_hrs) !== 'number') {
                const er = {
                    state: 'error',
                    data: 'Invalid expires hours. Should be in number'
                }
                return er;
            }
            const block_id = this.createRandChars(12, 'IP_BLCK');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO blocked_ip(block_id, ip_address, reason, block_expires, block_date) VALUES (?,?,?, DATE_ADD(NOW(), INTERVAL ${info.expire_hrs} HOUR), CURRENT_TIMESTAMP)
            `,[block_id, info.ip_address, info.reason ]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Ip was successfully added into block list',
                        block_id,
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add ip into block list. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add ip into block list. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingLoginInfo = async (info) => {
        try {
            const requireVals = ['admin_id', 'login_key', 'login_session', 'expire_mins'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            if (typeof (info.expire_mins) !== 'number') {
                const er = {
                    state: 'error',
                    data: 'Invalid expires minutes. Should be in number'
                }
                return er;
            }
            const login_id = this.createRandChars(12, 'ADM_LOG');
            const logSess = bcrypt.hashSync(info.login_session, 10);
            const [createAns] = await this.dbConn.query(`
                INSERT INTO logins_admin(login_id, admin_id, login_key, login_session, exipire_date, login_date) VALUES (?,?,?,?, DATE_ADD(NOW(), INTERVAL ${info.expire_mins} MINUTE), CURRENT_TIMESTAMP)
            `,[login_id, info.admin_id, info.login_key, logSess ]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Login information was successful saved',
                        login_id,
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add login information. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add login information. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingSignOtp = async (info) => {
        try {
            const requireVals = ['admin_id', 'otp', 'expire_mins'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            if (typeof (info.expire_mins) !== 'number') {
                const er = {
                    state: 'error',
                    data: 'Invalid expires hours. Should be in number'
                }
                return er;
            }
            const otp_id = this.createRandChars(12, 'OTP');
            const otp = bcrypt.hashSync(info.otp, 10);
            const [createAns] = await this.dbConn.query(`
                INSERT INTO sign_otp(otp_id, admin_id, otp, expire_date, otp_date) VALUES (?,?,?, DATE_ADD(NOW(), INTERVAL ${info.expire_mins} MINUTE), CURRENT_TIMESTAMP)
            `,[otp_id, info.admin_id, otp ]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Otp information was successful saved',
                        otp_id,
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add otp information. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add otp information. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingWhiteIp = async (info) => {
        try {
            const requireVals = ['ip_address', 'reason'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const white_id = this.createRandChars(12, 'IP_WHT');
            const [createAns] = await this.dbConn.query(`
            INSERT INTO white_ip(white_id, ip_address, reason, white_date) VALUES (?,?, CURRENT_TIMESTAMP)
            `,[white_id, info.ip_address, info.reason ]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Ip was successfully added into white list',
                        white_id,
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add ip into white list. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add ip into white list. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingInitWrongOTP = async (info) => {
        try {
            const requireVals = ['admin_id', 'instance_id', 'ip_address'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const wrong_id = this.createRandChars(12, 'WRNG');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO wrong_otp_login(wrong_id, admin_id, instance_id, countz, ip_address, wrong_date) VALUES (?,?,?,?,?, CURRENT_TIMESTAMP)
            `,[wrong_id, info.admin_id, info.instance_id, 1, info.ip_address]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Initial wrong otp validatation was set',
                        wrong_id,
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add wrong otp validatation. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add wrong otp validatation. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingOtpConfForAdmin = async (info) => {
        try {
            const requireVals = ['admin_id', 'key'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const conf_id = this.createRandChars(14, 'CONF');
            const encKey = this.encrypt(info.key);
            const [createAns] = await this.dbConn.query(`
                INSERT INTO otp_config(conf_id, admin_id, key_text, init_key, conf_date) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            `,[conf_id, info.admin_id, encKey, 'helovf']
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Otp configuration info was successfully set',
                        conf_id,
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add otp configuration info. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add otp configuration info. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingAdminTypes = async (info) => {
        try {
            const requireVals = ['type_name', 'type_number'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const type_id = this.createRandChars(14, 'TYPE');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO admin_types(type_id, admin_type, type_number, type_date) VALUES (?,?,?, CURRENT_TIMESTAMP)
            `,[type_id, info.type_name, info.type_number]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Admin type information were successfully set',
                        type_id,
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add admin type. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add admin type. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingServiceAuthInfo = async (info) => {
        try {
            const requireVals = ['service_name', 'service_secret'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const service_id = this.createRandChars(14, 'SERVC');
            const secret = bcrypt.hashSync(info.service_secret, 10);
            const [createAns] = await this.dbConn.query(`
                INSERT INTO service_auth(service_id, service_name, service_secret, service_status, service_date) VALUES (?,?,?,?, CURRENT_TIMESTAMP)
            `,[service_id, info.service_name, secret, 'active']
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Service auth was successfull saved',
                        service_id,
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add Service auth. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add Service auth. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

}

const insertDBObj = new insertDBClass();

export default insertDBObj;
