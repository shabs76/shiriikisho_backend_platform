import { selectDBClass } from "./select.js";
import bcrypt from "bcrypt";

export class updateDbClass extends selectDBClass {
    constructor(){
        super();
    }

    updateDriverStatus = async (info) => {
        try{
            const requireVals = ['driver_id', 'status'];
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

            const qlup = "UPDATE `drivers` SET `status`= ? WHERE `driver_id`= ? ";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.status, info.driver_id]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Driver status was successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update driver status data. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update driver status data. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    updateDriverPassword = async (info) => {
        try{
            const requireVals = ['driver_id', 'password'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const password = bcrypt.hashSync(info.password, 10);
            const qlup = "UPDATE `drivers` SET `password`= ? WHERE `driver_id`= ? ";
            const [ansUpdt] = await this.dbConn.query(qlup, [password, info.driver_id]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Driver password was successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update driver password data. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update driver password data. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    updateDriverMajorDetails = async (info) => {
        try{
            const requireVals = ['driver_id', 'fname', 'mname', 'lname', 'email', 'phone', 'dob', 'gender', 'relation', 'residence', 'park_area', 'vehicle_number', 'licence_number', 'tin_number', 'id_type', 'id_number'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const qlup = "UPDATE `drivers` SET `fname`=?,`mname`=?,`lname`=?,`email`=?,`phone`=?, `dob`=?,`gender`=?,`relationship`=?,`residence`=?,`park_area`=?,`vehicle_number`=?,`licence_number`=?,`tin_number`=?, `id_type`=?,`id_number`=? WHERE `driver_id`= ? ";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.fname, info.mname, info.lname, info.email, info.phone, info.dob, info.gender, info.relation, info.residence, info.park_area, info.vehicle_number, info.licence_number, info.tin_number, info.id_type, info.id_number, info.driver_id]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Driver details were successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update driver details . #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update driver details . #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    updateDriverMinorDetails = async (info) => {
        try{
            const requireVals = ['driver_id', 'email', 'phone', 'relation', 'residence', 'vehicle_number'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const qlup = "UPDATE `drivers` SET `email`=?,`phone`=?, `relationship`=?,`residence`=?,`vehicle_number`=? WHERE `driver_id`= ? ";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.email, info.phone, info.relation, info.residence, info.vehicle_number, info.driver_id]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Driver details were successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update  driver details. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update driver details. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    updateDriverParkArea = async (info) => {
        try{
            const requireVals = ['driver_id', 'parking_area'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const qlup = "UPDATE `drivers` SET `park_area`= ? WHERE `driver_id`= ? ";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.parking_area, info.driver_id]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Driver\'s paking area information were successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update paking area information. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update paking area information. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    updateParkLeaderStatus = async (info) => {
        try{
            const requireVals = ['leader_id', 'status'];
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
            const qlup = "UPDATE `park_leaders` SET `status`=? WHERE `leader_id`= ?";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.status, info.leader_id]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Driver\'s paking area information were successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update paking area information. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update paking area information. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    updateParkAreaStatus = async (info) => {
        try{
            const requireVals = ['park_id', 'status'];
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
            const qlup = "UPDATE `park_areas` SET `status` = ? WHERE `park_id` = ?";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.status, info.park_id]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Park status was successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update park status. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update paking status. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    updateParkDetails = async (info) => {
        try{
            const requireVals = ['park_id', 'park_name','park_size', 'vehicle_type', 'region', 'district', 'ward'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }

            const qlup = "UPDATE `park_areas` SET `park_name`=?,`park_size`=?,`vehicle_type`=?,`region`=?,`district`=?,`ward`=? WHERE `park_id` = ?";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.park_name, info.park_size, info.vehicle_type, info.region, info.district, info.ward, info.park_id]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Park details were successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update park details. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update park details. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    updateParkAreaLastDriverNumber = async (info) => {
        try{
            const requireVals = ['park_id', 'new_lastNumb' ];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }

            const qlup = "UPDATE `park_areas` SET `last_driver_number`= ?  WHERE `park_id` = ?";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.new_lastNumb, info.park_id]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Park details were successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update park details. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update park details. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    updateVehicleTypesDetails = async (info) => {
        try{
            const requireVals = ['type_name', 'weight','people_capacity', 'start_cc', 'end_cc', 'type_id'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }

            const qlup = "UPDATE `vehicle_types` SET `v_type_name`=?,`weight_kg`=?,`people_capacity`=?,`start_cc`=?,`end_cc`=? WHERE `v_type_id`= ?";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.type_name, info.weight, info.people_capacity, info.start_cc, info.end_cc, info.type_id]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Vehicle type details were successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update vehicle type details. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update vehicle type details. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    updateStatusOfVerifiedPhone = async (info) => {
        try{
            const requireVals = ['pverid', 'status'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            if (info.status !== 'blocked' && info.status !== 'used') {
                const er = {
                    state: 'error',
                    data: 'Invalid verified status'
                }
                return er;
            }
            const qlup = "UPDATE `verified_phones` SET `status`= ? WHERE `pverid`= ?";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.status, info.pverid]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Verified phone status was successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update verified phone status. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update verified phone status. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    updateStatusOfSignOtp = async (info) => {
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
            const qlup = "UPDATE `sign_otp` SET `otp`= ?, `status`=?,`expire_date`= DATE_ADD(NOW(), INTERVAL 11 MINUTE) WHERE `otp_id`= ?";
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

    updateStatusLoginInfo = async (info) => {
        try{
            const requireVals = ['login_key', 'status'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            if (info.status !== 'active' && info.status !== 'logout') {
                const er = {
                    state: 'error',
                    data: 'Invalid login status'
                }
                return er;
            }
            const qlup = "UPDATE `driver_logins` SET `status`= ? WHERE `login_key`= ?";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.status, info.login_key]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Login info status was successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update login status. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update login status. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

}