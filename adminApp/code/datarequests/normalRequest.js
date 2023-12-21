import _ from "lodash";
import authDbObj from "../auth/dbQueries/index.js";
import { mainActsClass } from "../req/main.js";

export class nRequests extends mainActsClass {
    constructor(){
        super();
    }

    getAdminDetails = async (admin_id) => {
        if (typeof (admin_id) !== 'string') {
            const er = {
                state: 'error',
                data: 'searching details are missing'
            }
            return er;
        }

        const adminDetails = await authDbObj.selectAdminDetails([admin_id]);

        if (!_.isArray(adminDetails) || _.isEmpty(adminDetails)) {
            const er = {
                state: 'error',
                data: 'No admin details were found'
            }
            return er;
        }

        const adminPermission = await authDbObj.selectAdminPermissions([admin_id]);

        const userData = { state: 'success', data: { admin: adminDetails[0], permissions: adminPermission  } };
        return userData;
    }

    getAdminPermissions = async () => {
        const adminPermission = await authDbObj.selectPermissions([''], " `permission_id` != ?");
        return adminPermission;
    }

    getAdminTypes = async () => {
        const adminTypes = await authDbObj.selectAdminTypes([''], " `type_id` != ?");
        return adminTypes;
    }
}

const nRequestsObj = new nRequests();
export default nRequestsObj;