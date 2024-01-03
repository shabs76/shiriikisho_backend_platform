import authDbObj from "../dbQueries/index.js";
import _ from "lodash";
import { mainActsClass } from "../../req/main.js";

class getInfoProcessClass extends mainActsClass{
    constructor(){
        super();
    }

    getParkAreaList = async () => {
        const parks = await authDbObj.selectParkAreasDetails(['active'], " `status` = ?");
        if (!_.isArray(parks)) {
            this.Mlogger.error(parks);
            const er = {
                state: 'error',
                data: 'An error occurred while fetching parking areas'
            }
            return er;
        } else if (_.isArray(parks) && _.isEmpty(parks)) {
            const er = {
                state: 'error',
                data: 'Hakuna kituo kilicho hai kwa sasa. Tafadhali jaribu tena baadae'
            }
            return er;
        }

        const sc = {
            state: 'success',
            data: parks
        }
        return sc;
    }

    getVehiclTypesList = async () => {
        const vehicles = await authDbObj.selectVehiclesTypesDetails([''], " `v_type_id` != ?");
        if (!_.isArray(vehicles)) {
            this.Mlogger.error(vehicles);
            const er = {
                state: 'error',
                data: 'An error occurred while fetching vehicles types'
            }
            return er;
        } else if (_.isArray(vehicles) && _.isEmpty(vehicles)) {
            const er = {
                state: 'error',
                data: 'Hakuna ina ya chombo kwenye mtandao kwa sasa. Tafadhali jaribu tena baadae'
            }
            return er;
        }

        const sc = {
            state: 'success',
            data: vehicles
        }
        return sc;
    }

    getAllDriverInformation = async (driver_id) => {
        const driverInf = await authDbObj.selectDriverDetails([driver_id, 'active', 'created'], " `driver_id` = ? AND (`status` = ? OR `status` = ?)");
        if (!_.isArray(driverInf)) {
            this.Mlogger.error(driverInf);
            const er = {
                state: 'error',
                data: 'An error occurred while fetching driver details',
            }
            return er;
        } else if (_.isArray(driverInf) && _.isEmpty(driverInf)) {
            const er = {
                state: 'error',
                data: 'Taarifa za akaunti yako zinakosekana. Tafadhali jaribu tena baadae',
            }
            return er;
        }
        
        const driverOb = driverInf[0];
        // delete password data 
        if (typeof (driverOb.password) === 'string') {
            delete driverOb.password;
        }
        // get park information park_area
        const parkInf = await authDbObj.selectParkAreasDetails([driverOb.park_area]);
        if (!_.isArray(parkInf)) {
            this.Mlogger.error(parkInf);
            const er = {
                state: 'error',
                data: 'An error has occurred while fetching parking information'
            }
            return er;
        } else if (_.isArray(parkInf) && _.isEmpty(parkInf)) {
            const er = {
                state: 'error',
                data: 'Taarifa juu ya kituo chako hazipatikani kwasasa. Tafadhali rudia tena'
            }
            return er;
        }

        // get driver uniform details
        const uniformDet = await authDbObj.selectUniformDetails([driver_id, 'active'], " `driver_id` = ? AND `status` = ? ");
        if (!_.isArray(uniformDet)) {
            this.Mlogger.error(uniformDet);
            driverOb.uniform = 'an error ecountered';
        } else if(_.isArray(uniformDet) && _.isEmpty(uniformDet)) {
            driverOb.uniform = 'Haijathibitishwa';
        } else {
            driverOb.uniform = uniformDet[0].uniform_num;
        }

        

        // now get leadership information if exits
        const ledInf = await authDbObj.selectParkLeaders([driver_id, 'active'], " `driver_id` = ? AND `status` = ? ");
        if (!_.isArray(ledInf)) {
            this.Mlogger.error(ledInf);
            const er = {
                state: 'error',
                data: 'An error has occurred while fetching leadership information'
            }
            return er;
        } else if(_.isArray(ledInf) && _.isEmpty(ledInf)) {
            driverOb.parkName = parkInf[0].park_name;
            driverOb.leadership = 'Mwanachama';
            driverOb.leaderState = 'no';
            const sc = {
                state: 'success',
                data:  driverOb
            }
            return sc;
        }

        // now fetch leadership type
        const letyNames = await authDbObj.selectLeaderTypes([ledInf[0].leader_type]);
        if (!_.isArray(letyNames)) {
            this.Mlogger.error(letyNames);
            driverOb.parkName = parkInf[0].park_name;
            driverOb.leadership = 'Kiongozi';
            driverOb.leaderState = 'yes';
            const sc = {
                state: 'success',
                data:  driverOb
            }
            return sc;
        } else if (_.isArray(letyNames) && _.isEmpty(letyNames)) {
            this.Mlogger.error(`Driver of id ${driver_id} has unknown leadership type`);
            driverOb.parkName = parkInf[0].park_name;
            driverOb.leadership = 'Kiongozi';
            driverOb.leaderState = 'yes';
            const sc = {
                state: 'success',
                data:  driverOb
            }
            return sc;
        }

        driverOb.parkName = parkInf[0].park_name;
        driverOb.leadership = letyNames[0].type_name;
        driverOb.leaderState = 'yes';
        const sc = {
            state: 'success',
            data:  driverOb
        }
        return sc;
        
    }

    getUnverifiedDriversInformation = async (leader_driver_id = '') => {
        // get park_id where leader is the leader `leader_type`, `driver_id`, `park_id`, `status`,
        const paLeader = await authDbObj.selectParkLeaders([leader_driver_id, 'active'], " `driver_id` = ? AND `status` = ? ");
        if (!_.isArray(paLeader)) {
            this.Mlogger.error(paLeader);
            const er = {
                state: 'error',
                data: 'An error has occurred while fetching park information',
            };
            return er;
        } else if (_.isArray(paLeader) && _.isEmpty(paLeader)) {
            const er = {
                state: 'error',
                data: 'Hauna uongozi kwenye kituo chochote, kwa sasa.'
            }
            return er;
        }
        // check for unverified drivers
        const unVerDriver = await authDbObj.selectDriverNoPassDetails([paLeader[0].park_id, 'created', leader_driver_id], " `park_area` = ? AND `status` = ? AND `driver_id` != ? ");
        if (!_.isArray(unVerDriver)) {
            this.Mlogger.error(unVerDriver);
            const er = {
                state: 'error',
                data: 'An error has occurred while fetching driver information',
            };
            return er;
        }
        const sc = {
            state: 'success',
            data: unVerDriver
        }
        return sc;
    }

    getOtherDriversMember = async (driver_id = '') => {
        const driveInf = await authDbObj.selectDriverNoPassDetails([driver_id, 'active'], " `driver_id` = ? AND `status` = ?");
        if (!_.isArray(driveInf)) {
            this.Mlogger.error(driveInf);
            const er = {
                state: 'error',
                data: 'An error has occurred while fetching parking area details'
            }
            return er;
        } else if (_.isArray(driveInf) && _.isEmpty(driveInf)) {
            const er = {
                state: 'error',
                data: 'Ruhusa ya kuona taarifa za kituo imekataliwa.',
                adv: 'logout'
            }
            return er;
        }
        // check for other drivers
        const verDrivers = await authDbObj.selectDriverNoPassDetails([driveInf[0].park_area, 'deleted', driver_id], " `park_area` = ? AND `status` != ? AND `driver_id` != ? ");
        if (!_.isArray(verDrivers)) {
            this.Mlogger.error(verDrivers);
            const er = {
                state: 'error',
                data: 'An error has occurred while fetching other drivers information',
            };
            return er;
        }
        const sc = {
            state: 'success',
            data: verDrivers,
        }
        return sc;
    }
}

const GettorObj = new getInfoProcessClass();
export default GettorObj;