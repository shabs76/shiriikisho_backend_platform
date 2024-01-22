import { insertDbClass } from "./insert.js";

export class selectDBClass extends insertDbClass{
    constructor(){
        super();
    }

    selectDriverDetails = async (whereArr = [''], subquery = " `driver_id` != ?") => {
        const ql = "SELECT `driver_id`, `fname`, `mname`, `lname`, `email`, `phone`, `password`, `dob`, `gender`, `relationship`, `residence`, `park_area`, `vehicle_number`, `licence_number`, `tin_number`, `id_type`, `id_number`, `id_picture`, `passport`, `insurance`, `status`, `driver_date` FROM `drivers` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectDriverNoPassDetails = async (whereArr = [''], subquery = " `driver_id` != ?") => {
        const ql = "SELECT `driver_id`, `fname`, `mname`, `lname`, `email`, `phone`, `dob`, `gender`, `relationship`, `residence`, `park_area`, `vehicle_number`, `licence_number`, `tin_number`, `id_type`, `id_number`, `id_picture`, `passport`, `insurance`, `status`, `driver_date` FROM `drivers` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectDriverNumbers = async (whereArr = [''], subquery = " `park_area` = ? ") => {
        const ql = "SELECT COUNT(driver_id) AS drivers FROM `drivers` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectDriverNumberMontly = async (whereArr = ['2023-08-07'], subquery = "driver_date >= ?") => {
        const ql = "SELECT MONTH(driver_date) AS month, YEAR(driver_date) AS year, COUNT(*) AS drivers FROM drivers WHERE "+subquery+" GROUP BY YEAR(driver_date), MONTH(driver_date)";
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectLeaderTypes = async (whereArr = [''], subquery = " `type_id` = ?") => {
        const ql = "SELECT `type_id`, `type_name`, `type_number`, `type_date` FROM `leadership_types` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectPermissionsDetails = async (whereArr = [''], subquery = " `permission_id` = ?") => {
        const ql = "SELECT `permission_id`, `permission_name`, `permission_number`, `perm_date` FROM `leaders_permissions` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectParkAreasDetails = async (whereArr = [''], subquery = " `park_id` = ?") => {
        const ql = "SELECT `park_id`, `park_name`, `park_number`, `last_driver_number`,`park_size`, `vehicle_type`, `ward`,`owner`, `status`, `park_date` FROM `park_areas` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectParkNumbers = async (whereArr = [''], subquery = " `park_id` = ? ") => {
        const ql = "SELECT COUNT(park_id) AS parks FROM `park_areas` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectVehiclesTypesDetails = async (whereArr = [''], subquery = " `v_type_id` = ?") => {
        const ql = "SELECT `v_type_id`, `v_type_name`, `weight_kg`, `people_capacity`, `start_cc`, `end_cc`, `v_type_date` FROM `vehicle_types` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectUniformDetails = async (whereArr = [''], subquery = " `driver_id` = ?") => {
        const ql = "SELECT `uniform_id`, `uniform_num`, `driver_id`, `validator_id`, `status`, `uniform_date` FROM `driver_uniforms` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectVerifiedPhone = async (whereArr = [''], subquery = " `pverid` = ?") => {
        const ql = "SELECT `pverid`, `phone`, `status`, `verification_date` FROM `verified_phones` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectSignOtpInfo = async (whereArr = [''], subquery = " `otp_id` = ?") => {
        const ql = "SELECT `otp_id`, `user_id`, `phone`, `otp`, `status`, `expire_date`, `otp_date` FROM `sign_otp` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectLoginInfo = async (whereArr = [''], subquery = " `login_key` = ?") => {
        const ql = "SELECT `login_id`, `driver_id`, `login_key`, `login_session`, `status`, `exipire_date`, `login_date` FROM `driver_logins` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectParkLeaders = async (whereArr = [''], subquery = " `leader_id` = ?") => {
        const ql = "SELECT `leader_id`, `leader_type`, `driver_id`, `park_id`, `status`, `leader_date` FROM `park_leaders` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectDriverUniformDetails = async (whereArr = [''], subquery = " `driver_id` = ? ") => {
        const ql = "SELECT uniform_id, uniform_num, driver_id, validator_id, status, uniform_date FROM driver_uniforms WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectCountriesDetails = async (whereArr = [''], subquery = " `country_id` != ? ") => {
        const ql = "SELECT `country_id`, `country_name`, `country_code`, `country_date` FROM `countries` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectRegionsDetails = async (whereArr = [''], subquery = " `region_id` != ? ") => {
        const ql = "SELECT `region_id`, `region_name`, `region_code`, `country_id`, `region_date` FROM `regions` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectDistrictDetails = async (whereArr = [''], subquery = " `district_id` != ? ") => {
        const ql = "SELECT `district_id`, `district_name`, `district_code`, `region_id`, `district_date` FROM `districts` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectWardsDetails = async (whereArr = [''], subquery = " `ward_id` != ? ") => {
        const ql = "SELECT `ward_id`, `ward_name`, `ward_code`, `district_id`, `ward_date` FROM `wards` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    // relationships starts here.

    selectLeaderTypesPermissions = async (whereArr = [''], subquery = " `rels_id` = ?") => {
        const ql = "SELECT `rels_id`, leaders_types_permissions.type_id AS type_id, leaders_types_permissions.permission_id AS permission_id, `type_name`, `type_number`, `permission_name`, `permission_number` FROM `leaders_types_permissions` INNER JOIN leaders_permissions ON leaders_permissions.permission_id = leaders_types_permissions.permission_id INNER JOIN leadership_types ON leadership_types.type_id = leaders_types_permissions.type_id  WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectParkLeadersData = async (whereArr = [''], subquery = " `leader_id` = ?") => {
        const ql = "SELECT `leader_id`, `leader_type`, `park_id`, park_leaders.status AS l_status, `leader_date`, drivers.*, leadership_types.* FROM `park_leaders` INNER JOIN drivers ON drivers.driver_id = park_leaders.driver_id INNER JOIN leadership_types ON leadership_types.type_id = park_leaders.leader_type WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectAllLocationDetailsUsingWard = async (whereArr = [''], subquery = " `ward_id` = ?") => {
        const ql = "SELECT `ward_id`, `ward_name`, `ward_code`, `district_name`, `district_code`, `region_name`, `region_code`, `country_name`, `country_code` FROM `wards` INNER JOIN districts ON districts.district_id = wards.district_id INNER JOIN regions ON regions.region_id = districts.region_id INNER JOIN countries ON countries.country_id = regions.country_id  WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectDriversBasedOnMajorLocationNames = async (whereArr = [''], subquery = " `district_name` = ? ") => {
        const ql = "SELECT drivers.*, region_name, district_name, ward_name FROM `drivers` INNER JOIN park_areas ON park_areas.park_id = drivers.park_area INNER JOIN wards ON wards.ward_id = park_areas.ward INNER JOIN districts ON districts.district_id = wards.district_id INNER JOIN regions ON regions.region_id = districts.region_id  WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectDriversNumberBasedOnMajorLocationNames = async (whereArr = [''], subquery = " `district_name` = ? ") => {
        const ql = "SELECT COUNT(driver_id) AS drivers FROM `drivers` INNER JOIN park_areas ON park_areas.park_id = drivers.park_area INNER JOIN wards ON wards.ward_id = park_areas.ward INNER JOIN districts ON districts.district_id = wards.district_id INNER JOIN regions ON regions.region_id = districts.region_id  WHERE "+subquery;
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