import { selectDBClass } from "./select.js";
import bcrypt from "bcrypt";

export class updateDBClass extends selectDBClass {
    constructor(){
        super();
    }

    updateAdminStatus = async (info) => {
        try{
            const requireVals = ['admin_id', 'status'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            if (info.status !== 'active' && info.status !== 'blocked' && info.status !== 'deleted') {
                const er = {
                    state: 'error',
                    data: 'Invalid admin status'
                }
                return er;
            }

            const qlup = "UPDATE `admin_details` SET `status`= ? WHERE `admin_id`= ? AND `type` != ?";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.status, info.admin_id, 'root']);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Admin status was successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update admin status data. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update admin status data. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    upddateAdminType = async (info) => {
        try{
            const requireVals = ['admin_id', 'type'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            if (info.type === 'root') {
                const er = {
                    state: 'error',
                    data: 'Invalid admin type'
                }
                return er;
            }

            const qlup = "UPDATE `admin_details` SET `type`= ? WHERE `admin_id`= ? AND `type` != ?";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.type, info.admin_id, 'root']);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Admin type was successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update admin type data. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update admin type data. #data error',
            }
            console.log(error);
            return Erro;
        }
    }

    updateAdminPass = async (info) => {
        try{
            const requireVals = ['admin_id', 'pass', 'status'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }

            if (info.status !== 'active' && info.status !== 'updating') {
                const er = {
                    state: 'error',
                    data: 'Invalid admin status'
                }
                return er;
            }

            const pass = bcrypt.hashSync(info.pass, 10);
            const qlup = "UPDATE `admin_details` SET `password`= ?, `status`= ? WHERE `admin_id`= ? ";
            const [ansUpdt] = await this.dbConn.query(qlup, [pass, info.status, info.admin_id]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Admin password was successfully updated'
                }
                return suc;
            }
            const Erro = {
                state: "error",
                data: 'Could not update admin password data. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update admin password data. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    updateAdminDetails = async (info) => {
        try{
            const requireVals = ['admin_id', 'fname', 'lname', 'dp', 'email'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }

            const qlup = "UPDATE `admin_details` SET `fname`= ?,`lname`= ?`dp`= ?,`email`= ? WHERE `admin_id`= ? AND `type` != ?";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.fname, info.lname, info.dp, info.email, info.admin_id, 'root']);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Admin infomation were successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update admin infomation. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update admin information. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    updateAdminPhone = async (info) => {
        try{
            const requireVals = ['admin_id', 'phone'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }

            const pass = bcrypt.hashSync(info.pass, 10);
            const qlup = "UPDATE `admin_details` SET `phone`= ? WHERE `admin_id`= ? ";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.phone, info.admin_id]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Admin phonenumber was successfully updated'
                }
                return suc;
            }
            const Erro = {
                state: "error",
                data: 'Could not update admin phone number data. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update admin phone number data. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    updateAdminLogins = async (info) => {
        try{
            const requireVals = ['login_key', 'status'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            if (info.status !== 'logout' && info.status !== 'login') {
                const er = {
                    state: 'error',
                    data: 'Invalid login status'
                }
                return er;
            }

            const qlup = "UPDATE `logins_admin` SET `status`= ?  WHERE `login_key`= ?";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.status, info.login_key]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Login status was successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update login status data. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update login status data. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    updateSignOtpStatusNCode = async (info) => {
        try{
            const requireVals = ['otp_id', 'status', 'otp'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            if (info.status !== 'active' && info.status !== 'blocked' && info.status !== 'used') {
                const er = {
                    state: 'error',
                    data: 'Invalid otp status'
                }
                return er;
            }
            const otp = bcrypt.hashSync(info.otp, 10);
            const qlup = "UPDATE `sign_otp` SET `otp`= ?,`expire_date`= DATE_ADD(NOW(), INTERVAL 15 MINUTE), `status`= ? WHERE `otp_id`= ?";
            const [ansUpdt] = await this.dbConn.query(qlup, [otp, info.status, info.otp_id]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Sign otp was successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update sign otp. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update sign otp. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    updateWrongOTpNumber = async (info) => {
        try{
            const requireVals = ['counts', 'wrong_id'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const qlup = "UPDATE `wrong_otp_login` SET  `countz`= ? WHERE `wrong_id`= ?";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.counts, info.wrong_id]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Wrong counts were successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update wrong counts. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update wrong counts. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    updateOtpConfStatus = async (info) => {
        try{
            const requireVals = ['conf_id', 'status'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            if (info.status !== 'active' && info.status !== 'blocked') {
                const er = {
                    state: 'error',
                    data: 'Invalid otp status'
                }
                return er;
            }
            const qlup = "UPDATE `otp_config` SET `status`= ? WHERE `conf_id`= ?";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.status, info.conf_id]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Otp conf status was successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update Otp conf status. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update Otp conf status. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

}

const updateDBObj = new updateDBClass();
export default updateDBObj;