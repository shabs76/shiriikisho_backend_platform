import axios from "axios";
import { mainActsClass } from "../req/main.js";

class mediaAccessAuthCheckClass extends mainActsClass {
    constructor(){
        super();
    }

    uploadImageAuthChecker = async (logKey, logSess, keyType) => {
        this.Mlogger.debug('Session is like'+logSess);
        if (keyType === 'registration') {
            const regPerm = await this.sendApiToUserApp('/others/driver/reg/numb', { verid: logKey });
            return regPerm;
        } else if (keyType === 'drivers') {
            this.Mlogger.debug('here');
            const permDr = await this.sendApiToUserApp('/others/driver/login/status', { logKey, logSess });
            this.Mlogger.debug(permDr);
            return permDr;
        } else if (keyType === 'we') {
            const permAns = await this.sendApiToAdmins('/others/check/login/status', { logKey, logSess });
            return permAns;
        } else {
            const er = {
                state: 'error',
                data: 'Permission denied on basis'
            }
            return er;
        }
    }

    getImageFilesAuthChecker = async (logKey, logSess, keyType) => {
        if (keyType === 'drivers') {
            this.Mlogger.debug('here');
            const permDr = await this.sendApiToUserApp('/others/driver/login/status', { logKey, logSess });
            this.Mlogger.debug(permDr);
            return permDr;
        } else if (keyType === 'we') {
            const permAns = await this.sendApiToAdmins('/others/check/login/status', { logKey, logSess });
            return permAns;
        } else {
            const er = {
                state: 'error',
                data: 'Permission denied on basis'
            }
            return er;
        }
    }

    sendApiToAdmins = async(subLink, data) => {
        let ansBck = {
            state: 'error',
            data: 'An error has occurred while trying to check admins'
        }
        ansBck = await axios.post('https://admins.shirikisho.co.tz'+subLink, data, {
            headers: {
                'Content-Type': 'application/json',
                'servicename': 'mediaService',
                'servicesecret': process.env.SERVICE_SESCRETE
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
                data: 'Unknown error has occurred while trying check on admin'
            }
            return xansBck;
        } if (typeof (ansBck) === 'object' && typeof (ansBck.data) === 'object') {
            return ansBck.data;
        } 
        return ansBck;
        
    }

    sendApiToUserApp = async (subLink, data) => {
        let ansBck = {
            state: 'error',
            data: 'An error has occurred while trying to check admins'
        }
        ansBck = await axios.post('https://users.shirikisho.co.tz'+subLink, data, {
            headers: {
                'Content-Type': 'application/json',
                'servicename': 'mediaService',
                'servicesecret': process.env.SERVICE_SESCRETE
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
                data: 'Unknown error has occurred while trying check on admin'
            }
            return xansBck;
        } if (typeof (ansBck) === 'object' && typeof (ansBck.data) === 'object') {
            return ansBck.data;
        } 
        return ansBck;
    }
}

const mediaAccessObj = new mediaAccessAuthCheckClass();
export default mediaAccessObj;