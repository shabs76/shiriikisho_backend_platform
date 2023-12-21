import _ from "lodash";
import authDbObj from "../auth/dbQueries/index.js";
import GenApis from "../api/gen.js";
import { mainActsClass } from "../req/main.js";

class sRequests extends mainActsClass {
    constructor(){
        super();
    }

    sendTexts = async (sendData) => {
        if (typeof (sendData.type) !== 'string' || typeof (sendData.sendId) !== 'string' || typeof (sendData.message) !== 'string') {
            const er = {
                state: 'error',
                data: 'Make sure to send type, sendId and message'
            }
            return er;
        }
        if (sendData.type === 'phone') {
            if (sendData.sendId.length !== '12') {
                const er = {
                    state: 'error',
                    data: 'Invalid phone number'
                }
                return er;
            }
            const smsAns = await GenApis.sendTextApI(sendData.message, sendData.sendId);
            return smsAns;
        }
    }
}