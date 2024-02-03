import { mainActsClass } from "../../req/main.js";
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
dotenv.config();

export class insertDbClass extends mainActsClass {
    dbConn;
    transConn;
    constructor() {
        super();
        const database = this.dbNames('gene');
        this.dbConn = this.connv(database);
    }

    addingParkAreas = async (info) => {
        try {
            const requireVals = ['park_name', 'park_number', 'park_size', 'vehicle_type', 'ward_id', 'owner'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const park_id = this.createRandChars(12, 'PARK');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO park_areas(park_id, park_name, park_number, last_driver_number, park_size, vehicle_type, ward, owner, status, park_date) VALUES (?,?,?,?,?,?,?,?,?, CURRENT_TIMESTAMP)
            `,[park_id, info.park_name, info.park_number, 0, info.park_size, info.vehicle_type, info.ward_id, info.owner, 'active' ]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Park area was successfully created',
                        park_id
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not save park area details. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not save park area details. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingVehiclesTypes = async (info) => {
        try {
            const requireVals = ['type_name', 'weight', 'people_capacity', 'start_cc', 'end_cc'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const type_id = this.createRandChars(12, 'VTYPE');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO vehicle_types(v_type_id, v_type_name, weight_kg, people_capacity, start_cc, end_cc, v_type_date) VALUES (?,?,?,?,?,?, CURRENT_TIMESTAMP)
            `,[type_id, info.type_name, info.weight, info.people_capacity, info.start_cc, info.end_cc ]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Vehicle type was successfully created',
                        type_id
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not save vehicle type details. #unkown',
            }
            return Erro;
        } catch (error) {
            console.log(error);
            const Erro = {
                state: "error",
                data: 'Could not save vehicle type details. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingdriversDetails = async (info) => {
        try {
            const requireVals = ['fname', 'mname', 'lname', 'email', 'phone', 'password', 'dob', 'gender', 'relation', 'residence', 'park_area', 'vehicle_number', 'licence_number', 'tin_number', 'id_type', 'id_number', 'id_picture', 'passport', 'insurance', 'chama', 'kin_name', 'kin_phone'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const driver_id = this.createRandChars(12, 'DRVER');
            const password = bcrypt.hashSync(info.password, 10);
            const [createAns] = await this.dbConn.query(`
                INSERT INTO drivers(driver_id, fname, mname, lname, email, phone, password, dob, gender, relationship, residence, park_area, vehicle_number, licence_number, tin_number, id_type, id_number, id_picture, passport, insurance, chama, kin_name, kin_phone, status, driver_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, CURRENT_TIMESTAMP)
            `,[driver_id, info.fname, info.mname, info.lname, info.email, info.phone, password, info.dob, info.gender, info.relation, info.residence, info.park_area, info.vehicle_number, info.licence_number, info.tin_number, info.id_type, info.id_number, info.id_picture, info.passport, info.insurance, info.chama, info.kin_name, info.kin_phone, 'created']
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Driver was successfully created',
                        driver_id
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not save driver details. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not save driver details. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingDriverLeadersTypes = async (info) => {
        try {
            const requireVals = ['type_name', 'type_number' ];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const type_id = this.createRandChars(12, 'LTYPE');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO leadership_types(type_id, type_name, type_number, type_date) VALUES (?,?,?, CURRENT_TIMESTAMP)
            `,[type_id, info.type_name, info.type_number]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'A new leader type was successfully created',
                        type_id
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not save leader type details. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not save leader type details. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingPermissionDetails = async (info) => {
        try {
            const requireVals = ['permission_name', 'permission_number' ];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const perm_id = this.createRandChars(12, 'LTYPE');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO leaders_permissions(permission_id, permission_name, permission_number, perm_date) VALUES (?,?,?, CURRENT_TIMESTAMP)
            `,[perm_id, info.permission_name, info.permission_number]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'A new permission was successfully created',
                        perm_id
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not save permission details. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not save permission details. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }


    addingPermissionLeaderTypesRels = async (info) => {
        try {
            const requireVals = ['type_id', 'permission_id' ];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const rels_id = this.createRandChars(12, 'LPTYPE');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO leaders_types_permissions(rels_id, type_id, permission_id) VALUES (?,?,?)
            `,[rels_id, info.type_id, info.permission_id]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'A permission was successfully added to driver type',
                        rels_id
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add permission to driver type. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add permission to driver type. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingParkLeadersDetails = async (info) => {
        try {
            const requireVals = ['leader_type', 'driver_id', 'park_id' ];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const leader_id = this.createRandChars(12, 'LEAD');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO park_leaders(leader_id, leader_type, driver_id, park_id, status, leader_date) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP)
            `,[leader_id, info.leader_type, info.driver_id, info.park_id, 'active']
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'A Leader was successfully added to parking area',
                        leader_id
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add leader to parking area. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add leader to parking area. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingUniformNumberofDriver = async (info) => {
        try {
            const requireVals = ['driver_id', 'validator_id', 'uniformNum' ];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const uniform_id = this.createRandChars(12, 'UNI');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO driver_uniforms(uniform_id, uniform_num, driver_id, validator_id, status, uniform_date) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP)
            `,[uniform_id, info.uniformNum, info.driver_id, info.validator_id, 'active']
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'A uniform number was successfully added to a driver',
                        uniform_id
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add uniform number to a driver. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add uniform number to a driver. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }


    addingSignOtp = async (info) => {
        try {
            const requireVals = ['user_id','phone', 'otp'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const otp_id = this.createRandChars(12, 'PVER');
            const otp = bcrypt.hashSync(info.otp, 10);
            const [createAns] = await this.dbConn.query(`
                INSERT INTO sign_otp(otp_id, user_id, phone, otp, status, expire_date, otp_date) VALUES (?,?,?,?,?,DATE_ADD(NOW(), INTERVAL 11 MINUTE),CURRENT_TIMESTAMP)
            `,[otp_id, info.user_id, info.phone, otp, 'active']
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Sign otp was successfully created',
                        otp_id
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not create sign otp. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not create sign otp. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingVerifiedPhone = async (info) => {
        try {
            const requireVals = ['phone'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const pverid = this.createRandChars(12, 'PVER');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO verified_phones(pverid, phone, status, verification_date) VALUES (?,?,?,CURRENT_TIMESTAMP)
            `,[pverid, info.phone, 'active']
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Phone number was successfully verified',
                        pverid
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add verified phone number. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add verified phone number. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingDriverLogins = async (info) => {
        try {
            const requireVals = ['driver_id', 'expire_mins'];
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
            const login_id = this.createRandChars(12, 'LOGIN');
            const logKey = this.createRandChars(12, 'LOGKEY');
            const logSess = this.createRandChars(12, 'LOGSES');
            const sess = bcrypt.hashSync(logSess, 10);
            const [createAns] = await this.dbConn.query(`
                INSERT INTO driver_logins(login_id, driver_id, login_key, login_session, exipire_date, login_date) VALUES (?,?,?,?,DATE_ADD(NOW(), INTERVAL ${info.expire_mins} HOUR), CURRENT_TIMESTAMP)
            `,[login_id, info.driver_id, logKey, sess]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Phone number was successfully verified',
                        logSess,
                        logKey
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add verified phone number. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add verified phone number. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingCountriesDetails = async (info) => {
        try {
            const requireVals = ['country', 'code'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const country_id = this.createRandChars(12, 'CONTRY');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO countries(country_id, country_name, country_code, country_date) VALUES (?,?,?, CURRENT_TIMESTAMP)
            `,[country_id, info.country, info.code]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'A country was successfully created',
                        country_id
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add country. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add country. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingRegionsDetails = async (info) => {
        try {
            const requireVals = ['region','country_id', 'code'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const reg_id = this.createRandChars(12, 'REGIN');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO regions(region_id, region_name, region_code, country_id, region_date) VALUES (?,?,?,?, CURRENT_TIMESTAMP)
            `,[reg_id,info.region,info.code, info.country_id]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'A region was successfully created',
                        reg_id
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add region. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add region. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingDistrictDetails = async (info) => {
        try {
            const requireVals = ['district','region_id', 'code'];
            const reState = this.checkRequireValues(requireVals, info);
            console.log(reState);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const dist_id = this.createRandChars(12, 'DIST');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO districts(district_id, district_name, district_code, region_id, district_date) VALUES (?,?,?,?, CURRENT_TIMESTAMP)
            `,[dist_id,info.district,info.code, info.region_id]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'A district was successfully created',
                        dist_id
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add district. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add district. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingWardDetails = async (info) => {
        try {
            const requireVals = ['ward','district_id', 'code'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const ward_id = this.createRandChars(12, 'WARD');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO wards(ward_id, ward_name, ward_code, district_id, ward_date) VALUES (?,?,?,?, CURRENT_TIMESTAMP)
            `,[ward_id,info.ward,info.code, info.district_id]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'A ward was successfully created',
                        ward_id
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not add ward. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not add ward. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

}