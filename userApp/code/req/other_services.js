import axios from 'axios';
import dotenv from 'dotenv';
// internal modules
import logger from '../logger/index.js'
dotenv.config();

export class otherServiceApiRequest {
    constructor(){

    }

    checkAdminPermissions = async(data) => {
        const admAns = await this.sendApiToAdmins('/others/check/permission', data);
        if (typeof (admAns.state) !== 'string') {
            logger.error(admAns);
        } else if (typeof (admAns.state) === 'string' && admAns.state !== 'success') {
            logger.error(admAns);
        }
        return admAns;
    }

    sendNormalTexts = async (data) => {
        const sendAns = await this.sendApiToAdmins('/others/send/normal/text', data);
        if (typeof (sendAns.state) !== 'string' || sendAns.state !== 'success') {
            logger.error(sendAns);
        }
        return sendAns;
    }

    checkValidServiceRequest = async(data) => {
        const sendAns = await this.sendApiToAdmins('/others/validate/service/onbehalf', data);
        if (typeof (sendAns.state) !== 'string' || sendAns.state !== 'success') {
            logger.error(sendAns);
        }
        return sendAns;
    }

    sendApiToAdmins = async(subLink, data) => {
        let ansBck = {
            state: 'error',
            data: 'An error has occurred while trying to check admins'
        }
        ansBck = await axios.post('http://192.168.1.118:5700'+subLink, data, {
            headers: {
                'Content-Type': 'application/json',
                'servicename': 'userService',
                'servicesecret': process.env.SERVICE_SESCRETE
            },
            withCredentials: true
        }).catch((e) => {
            logger.error(e);
            ansBck = {
                state: 'error',
                data: 'Network error on fetching admins info'
            }
        })
        if (typeof (ansBck) !== 'object') {
            const xansBck = {
                state: 'error',
                data: 'Unknown error has occurred while trying check on admin'
            }
            return xansBck;
        } if (typeof (ansBck) === 'object' && typeof (ansBck.data) === 'object') {
            return ansBck.data;
        } 
        return ansBck;
        
    }
}