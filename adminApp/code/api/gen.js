import axios from "axios";
import dotenv from 'dotenv';
import { Buffer } from 'buffer';
import mainActs from "../req/main.js";

dotenv.config();

class GenApisClass {
    constructor() {

    }

    sendTextApI = async (sms, phone) => {
        const sendData = {
            source_addr : process.env.BEEM_ID,
            encoding: 0,
            schedule_time: '',
            message: sms,
            recipients: [
                {
                    recipient_id: '1',
                    dest_addr: phone
                }
            ]
        }
        const ans = this.axoisPostBeem(sendData);
        return ans;
    }

    axoisPostBeem = async (data) => {
        let ansbck;
        ansbck = await axios.post('https://apisms.beem.africa/v1/send', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Basic '+ Buffer.from(process.env.BEEM_KEY+':'+process.env.BEEM_SECRET).toString('base64')
            },
            withCredentials: true,
            proxy: false,

        }).catch((e) => {
            mainActs.Mlogger.error(e);
            ansbck = {
                state: 'error',
                data: 'Network error',
            };
            return ansbck;
        });
        if (typeof (ansbck)  === 'object') {
            if (typeof (ansbck.data.successful) === 'boolean' && ansbck.data.successful) {
                const suc = {
                    state: 'success',
                    data: 'Message was successfully sent'
                }
                return suc;
            } else {
                mainActs.Mlogger.error(ansbck);
                const er = {
                    state: 'error',
                    data: 'Message was not sent'
                }
                return er;
            }
        } else {
            return ansbck;
        }
    }
}

const GenApis = new GenApisClass();
export default GenApis;