import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import _ from 'lodash';
import crypto from 'crypto';
// internal modules
import logger from '../logger/index.js'
import { otherServiceApiRequest } from './other_services.js';

dotenv.config();
export class mainActsClass extends otherServiceApiRequest {
    Mlogger; 
    constructor (){
        super();
        this.Mlogger = logger;
    }

    dbNames (dbname) {
        let bd = '';
        switch (dbname) {
            case 'gene':
                bd = process.env.MYSQL_DATABASE_MEDIA;
                return bd;
            default:
                return bd;
        }
    }

    connv (databse) {
        const pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER_MEDIA,
            password: process.env.MYSQL_PASSWORD_MEDIA,
            database: databse
        }).promise();
        return pool;
    }

    paginationFun = async (numqry, dbcon, page, whereArr, numperpage, countColumn) => {
        try {
            const results = await dbcon.query(numqry, whereArr);
            const rows = results[0];
            if (!_.isArray (rows) || _.isEmpty(rows)) {
                const err = {
                    state: 'error',
                    data: 'Empty results'
                }
                return err;
            }
            const Limitz = {
                numbe: 0*3
            }
            Limitz.numbe = parseInt(rows[0][countColumn]);
            let pg = 1;
            let xstatus = 'cont';
            if(Limitz.numbe < numperpage){
                pg = 1;
            }else{
                pg = Math.ceil(Limitz.numbe/numperpage);
            }
            if(page<1){
                page = 1;
            }else if (page > pg) {
                page = pg;
                xstatus = 'end';
            } else{
                xstatus = 'cont';
            }
            Limitz.querylimit = `LIMIT ${(page -1)*numperpage} , ${numperpage}`;
            Limitz.status = xstatus;
            const suc = {
                state: 'success',
                data: Limitz,
                pages: pg
            }
            return suc;
        } catch(error) {
            const erro = {
                state: 'error',
                data: 'Unable to fetch data',
            }
            this.Mlogger.error({message:error, label: 'Pagination function'});
            return erro;
        }
    }

    createRandChars (length, sub = 'SUB') {
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result+'_'+sub;
    }

    createRandCharsRef (length, sub = '') {
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result+sub;
    }

    createRandNubs (length) {
        const characters = '01234567890987654321';
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    checkRequireValues = (reqVals = [], Vals, mode= 'required') => {
        const vals = {};
        reqVals.map((reqVal) => {
            if (typeof (Vals[reqVal]) === 'undefined' && mode === 'required') {
                const erro = {
                    state: 'error',
                    data: reqVal+' is missing',
                };
                return erro;
            } else if (typeof (Vals[reqVal]) === 'undefined' && mode !== 'required') {
                vals[reqVal] = 'notset';
            } else {
                vals[reqVal] = Vals[reqVal];
            }
        });
        return vals;
    }
    isURL = (str) => {
        // Regular expression to match URLs (starting with http://, https://, or www.)
        var urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d{1,5})?(\/[\w.-]*)*(\?[^\s]*)?$/i;
        return urlPattern.test(str);
    }

    isValidPhone = (inputString) => {
        // Check if the input is a string
        if (typeof inputString !== 'string') {
          return false;
        }
      
        // Check if the string is 12 characters long and starts with "255"
        if (inputString.length === 12 && inputString.startsWith('255')) {
          // Check if all characters in the string are numbers
          const regex = /^[0-9]+$/;
          return regex.test(inputString);
        }
      
        return false;
    }

    runMainQuery = async (searchArr, Query) => {
        try {
            const database = this.dbNames('gene');
            const dbConn = this.connv(database);
            const results = await dbConn.query(Query, searchArr);
            const rows = results[0];
            return rows;
        } catch(error) {
            const erro = {
                status: 'error',
                data: 'Unable to fetch data',
            }
            this.Mlogger.error(error);
            return erro;
        }
    }

    isXMLString = (str) => {
        const regex = /^<\?xml\s+version\s*=\s*(['"])[0-9]+\.[0-9]+\1\s*\?>|<([a-zA-Z][\w-]*)(\s+[^>]+)?>(.*?)<\/\2>|<([a-zA-Z][\w-]*)\s*\/>$/;
        return regex.test(str);
    }


    addOneDay = (dateString) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
      
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
      
        return `${year}-${month}-${day}`;
    }

    encrypt(text, key) {
        const iv = crypto.randomBytes(16); // Initialization Vector
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return {
            iv: iv.toString('hex'),
            encryptedData: encrypted,
        };
    }
    
    decrypt(encryptedText, key) {
        const decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            Buffer.from(key),
            Buffer.from(encryptedText.iv, 'hex')
        );
        let decrypted = decipher.update(encryptedText.encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    generateStrongPassword(length = 10) {
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numericChars = '0123456789';
        const specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
        let password = '';
    
        // Ensure at least one of each character type
        const randomLowercase = lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
        const randomUppercase = uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
        const randomNumeric = numericChars[Math.floor(Math.random() * numericChars.length)];
        const randomSpecial = specialChars[Math.floor(Math.random() * specialChars.length)];
    
        // Populate the rest of the password with random characters
        const remainingLength = length - 4;
        const allChars = lowercaseChars + uppercaseChars + numericChars + specialChars;
    
        for (let i = 0; i < remainingLength; i++) {
            const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
            password += randomChar;
        }
    
        // Shuffle the password to mix the characters
        password = randomLowercase + randomUppercase + randomNumeric + randomSpecial + password;
        password = password.split('').sort(() => 0.5 - Math.random()).join('');
        return password;
    }

    padNumber(number, paddN = 3) {
        return String(number).padStart(paddN, '0');
    }
}

const mainActs = new mainActsClass();
export default mainActs;
