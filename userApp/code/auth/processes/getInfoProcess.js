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
}

const GettorObj = new getInfoProcessClass();
export default GettorObj;