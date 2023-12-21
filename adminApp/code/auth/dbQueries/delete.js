import { updateDBClass } from "./update.js";


export class deleteDBClass extends updateDBClass{
    constructor(){
        super();
    }

    deleteAdminDetails = async (admin_id) => {
        try{
            if (typeof (admin_id) !== 'string') {
                const er ={
                    state: 'error',
                    data: 'Admin details are missing'
                }
                return er;
            }
            const delQl = "DELETE FROM `admin_details` WHERE `admin_id` = ? AND state = ? AND type != ?";
            const [ansqry] = await this.dbConn.query(delQl, [admin_id, 'created', 'root']);
            if (ansqry.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Admin was successfully deleted'
                }
                return suc;
            } else {
                const sc = {
                    state: 'success',
                    data: 'No information about admin were found or You have permission to perform this action'
                }
                return sc;
            }
        } catch(error) {
            this.Mlogger.error(error);
            const err = {
                state: 'error',
                data: 'Unable to perform this action server error occured'
            }
            return err;
        }
    }

    deleteAdminPermissions = async (admin_id) => {
        try{
            if (typeof (admin_id) !== 'string') {
                const er ={
                    state: 'error',
                    data: 'Admin details are missing'
                }
                return er;
            }
            const delQl = "DELETE FROM `admin_permissions` WHERE `admin_id` = ? ";
            const [ansqry] = await this.dbConn.query(delQl, [admin_id]);
            if (ansqry.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Admin permissions wer successfully deleted'
                }
                return suc;
            } else {
                const sc = {
                    state: 'success',
                    data: 'No information about admin permissions were found or You have permission to perform this action'
                }
                return sc;
            }
        } catch(error) {
            this.Mlogger.error(error);
            const err = {
                state: 'error',
                data: 'Unable to perform this action server error occured'
            }
            return err;
        }
    }

    deleteBlockedIP = async (ip_address) => {
        try {
            if (typeof (ip_address) !== 'string') {
                const er ={
                    state: 'error',
                    data: 'Ip address details are missing'
                }
                return er;
            }
            const delQl = "DELETE FROM `blocked_ip` WHERE `ip_address` = ?";
            const [ansqry] = await this.dbConn.query(delQl, [ip_address]);
            if (ansqry.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Blocked IP was successfully deleted'
                }
                return suc;
            } else {
                const sc = {
                    state: 'success',
                    data: 'No information about the IP address was found'
                }
                return sc;
            }
        } catch (error) {
            this.Mlogger.error(error);
            const err = {
                state: 'error',
                data: 'Unable to perform this action server error occured'
            }
            return err;
        }
    }


    deleteWhiteListIP = async (ip_address) => {
        try {
            if (typeof (ip_address) !== 'string') {
                const er ={
                    state: 'error',
                    data: 'IP address details are missing'
                }
                return er;
            }
            const delQl = "DELETE FROM `white_ip` WHERE `ip_address` = ?";
            const [ansqry] = await this.dbConn.query(delQl, [ip_address]);
            if (ansqry.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Whitelist IP was successfully deleted'
                }
                return suc;
            } else {
                const sc = {
                    state: 'success',
                    data: 'No information about the IP address was found'
                }
                return sc;
            }
        } catch (error) {
            this.Mlogger.error(error);
            const err = {
                state: 'error',
                data: 'Unable to perform this action server error occured'
            }
            return err;
        }
    }

    deleteOtpConfAdmin = async (admin_id) => {
        try {
            if (typeof (admin_id) !== 'string') {
                const er ={
                    state: 'error',
                    data: 'delete details are missing'
                }
                return er;
            }
            const delQl = "DELETE FROM `otp_config` WHERE `admin_id` = ?";
            const [ansqry] = await this.dbConn.query(delQl, [admin_id]);
            if (ansqry.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Otp configuration was successfully deleted'
                }
                return suc;
            } else {
                const sc = {
                    state: 'success',
                    data: 'No information about the otp configuration was found'
                }
                return sc;
            }
        } catch (error) {
            this.Mlogger.error(error);
            const err = {
                state: 'error',
                data: 'Unable to perform this action server error occured'
            }
            return err;
        }
    }

    deleteWrongOTPConts = async (instance_id) => {
        try {
            if (typeof (instance_id) !== 'string') {
                const er ={
                    state: 'error',
                    data: 'delete details are missing'
                }
                return er;
            }
            const delQl = "DELETE FROM `wrong_otp_login` WHERE `instance_id` = ?";
            const [ansqry] = await this.dbConn.query(delQl, [instance_id]);
            if (ansqry.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Wrong otp counts were successfully deleted'
                }
                return suc;
            } else {
                const sc = {
                    state: 'success',
                    data: 'No information about the wrong otp count was found'
                }
                return sc;
            }
        } catch (error) {
            this.Mlogger.error(error);
            const err = {
                state: 'error',
                data: 'Unable to perform this action server error occured'
            }
            return err;
        }
    }
}

const deleteDBObj = new deleteDBClass();
export default deleteDBObj;