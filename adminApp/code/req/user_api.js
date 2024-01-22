import axios from "axios";
import dotenv from 'dotenv';
import { mainActsClass } from "./main.js";
dotenv.config();

class UserApiClass extends mainActsClass {
    constructor () {
        super();
    }

    // 
    getAdminUserRelatedInfo = async (link, data, hedz = { logsess: '', logkey: '' }) => {
        const inf = await this.sendApiToUsers(link, data, hedz);
        return inf;
    }

    sendApiToUsers = async(subLink, data, hedz = { logsess: '', logkey: '' }) => {
        let ansBck = {
            state: 'error',
            data: 'An error has occurred while trying to check admins'
        }
        ansBck = await axios.post(process.env.USER_SERVICE_HOST+subLink, data, {
            headers: {
                'Content-Type': 'application/json',
                'servicename': 'userService',
                'servicesecret': process.env.SERVICE_SESCRETE,
                'logsess': hedz.logsess,
                'logkey': hedz.logkey
            },
            withCredentials: true
        }).catch((e) => {
            this.Mlogger.error(e);
            ansBck = {
                state: 'error',
                data: 'Network error on fetching admins info'
            }
        })
        if (typeof (ansBck) !== 'object') {
            const xansBck = {
                state: 'error',
                data: 'Unknown error has occurred while trying check on user app'
            }
            return xansBck;
        } if (typeof (ansBck) === 'object' && typeof (ansBck.data) === 'object') {
            return ansBck.data;
        } 
        return ansBck;
        
    }
}

const UserApiObj = new UserApiClass();
export default UserApiObj;