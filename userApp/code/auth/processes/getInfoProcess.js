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
        const driverInf = await authDbObj.selectDriverDetails([driver_id, 'active'], " `driver_id` = ? AND `status` = ?");
        if (!_.isArray(driverInf)) {
            this.Mlogger.error(driverInf);
            const er = {
                state: 'error',
                data: 'An error occurred while fetching driver details',
                adv: 'logout'
            }
            return er;
        } else if (_.isArray(driverInf) && _.isEmpty(driverInf)) {
            const er = {
                state: 'error',
                data: 'Taarifa za akaunti yako zinakosekana. Tafadhali jaribu tena baadae',
                adv: 'logout'
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
            driverOb.uniform = 'Haijahalalishwa';
        }

        driverOb.uniform = uniformDet[0].uniform_num;

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
        if (_.isArray(letyNames)) {
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
            driverOb.leaderState = 'no';
            const sc = {
                state: 'success',
                data:  driverOb
            }
            return sc;
        }

        driverOb.parkName = parkInf[0].park_name;
        driverOb.leadership = letyNames[0].type_name;
        const sc = {
            state: 'success',
            data:  driverOb
        }
        return sc;
        
    }
}

const GettorObj = new getInfoProcessClass();
export default GettorObj;