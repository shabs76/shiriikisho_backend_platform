import { insertDBClass } from "./insert.js";

export class selectDBClass extends insertDBClass{
    constructor() {
        super();
    }

    selectAdminDetails = async (whereArr = [''], subquery = " `admin_id` = ?") => {
        const ql = "SELECT `admin_id`, `fname`, `lname`, `dp`, `phone`, `email`, `type`, `status`, `password`, `admin_date` FROM `admin_details` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectAdminPermissions = async (whereArr = [''], subquery = " `admin_id` = ?") => {
        const ql = "SELECT `admin_perm_id`, `admin_id`, `permission_id`, `rel_date` FROM `admin_permissions` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectStatusChangeHist = async (whereArr = [''], subquery = " `admin_id` = ?") => {
        const ql = "SELECT `change_id`, `admin_id`, `to_type`, `from_type`, `to_status`, `from_status`, `change_date` FROM `admin_status_type_changes` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectBlockedIp = async (whereArr = [''], subquery = " `ip_address` = ?") => {
        const ql = "SELECT `block_id`, `ip_address`, `reason`, `block_expires`, `block_date` FROM `blocked_ip` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectloginAdmins = async (whereArr = [''], subquery = " `admin_id` = ?") => {
        const ql = "SELECT `login_id`, `admin_id`, `login_key`, `login_session`, `exipire_date`, `status`, `login_date` FROM `logins_admin` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectPermissions = async (whereArr = [''], subquery = " `permission_id` = ?") => {
        const ql = "SELECT `permission_id`, `permission_name`, `permission_number`, `perm_date` FROM `permissions_list` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectSignOtps = async (whereArr = [''], subquery = " `admin_id` = ?") => {
        const ql = "SELECT `otp_id`, `admin_id`, `otp`, `expire_date`, `status`, `otp_date` FROM `sign_otp` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectWhiteIP = async (whereArr = [''], subquery = " `ip_address` = ?") => {
        const ql = "SELECT `white_id`, `ip_address`, `reason`, `white_date` FROM `white_ip` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectWrongOTPTimer = async (whereArr = [''], subquery = " `instance_id` = ?") => {
        const ql = "SELECT `wrong_id`, `admin_id`, `instance_id`, `countz`, `ip_address`, `wrong_date` FROM `wrong_otp_login` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectOtpConf = async (whereArr = [''], subquery = " `admin_id` = ?") => {
        const ql = "SELECT `conf_id`, `admin_id`, `key_text`, `status`, `conf_date` FROM `otp_config` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectAdminTypes = async (whereArr = [''], subquery = " `admin_type` = ?") => {
        const ql = "SELECT `type_id`, `admin_type`, `type_number`, `type_date` FROM `admin_types` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectServiceAuth = async (whereArr = [''], subquery = " `service_name` = ? AND `service_status` = 'active' ") => {
        const ql = "SELECT `service_id`, `service_name`, `service_secret`, `service_status`, `service_date` FROM `service_auth` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    // relections select
    selectAdminPermissionsDetail = async (whereArr = [''], subquery = " `admin_id` = ?") => {
        const ql = "SELECT `admin_perm_id`, `admin_id`, admin_permissions.permission_id AS permission_id, `rel_date`, `permission_name`, `permission_number`, `perm_date` FROM `admin_permissions` INNER JOIN `permissions_list` ON permissions_list.permission_id = admin_permissions.permission_id WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }


    selectAdminWithLogins = async (whereArr = [''], subquery = " `admin_id` = ?") => {
        const ql = "SELECT `login_id`, admin_details.admin_id AS admin_id, `login_key`, `login_session`, `exipire_date`, logins_admin.status AS ld_status, `login_date`, `fname`, `lname`, `dp`, `phone`, `email`, `type`, admin_details.status AS ad_status, `admin_date` FROM `logins_admin` INNER JOIN admin_details ON admin_details.admin_id = logins_admin.admin_id WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }


    runQuery = async (searchArr, Query) => {
        try {
            const results = await this.dbConn.query(Query, searchArr);
            const rows = results[0];
            return rows;
        } catch(error) {
            const erro = {
                status: 'error',
                data: 'Unable to fetch data',
            }
            this.Mlogger.error(error);
            return erro;
        }
    }
}

const selectDBObj = new selectDBClass();

export default selectDBObj;