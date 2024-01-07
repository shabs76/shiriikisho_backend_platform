import express from 'express';
// internal module
import authProcessObj from '../code/auth/processes/authProcess.js';
import authDbObj from '../code/auth/dbQueries/index.js';
import _ from 'lodash';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import sharp from 'sharp';
import imageType from 'image-type';

const router = express.Router();

router.use(express.json());

router.post('/register/vehiclestypes', async (req, res) => {
    const sendData = req.body;
    sendData.logKey = req.headers.logkey;
    sendData.logSess = req.headers.logsess;
    const Vans = await authProcessObj.registerVehicleTypes(req.body);
    res.json(Vans);
});

router.post('/register/parkarea', async (req, res) => {
    const sendData = req.body;
    sendData.logKey = req.headers.logkey;
    sendData.logSess = req.headers.logsess;
    const paAns = await authProcessObj.registerParkAreaProcess(sendData);
    res.json(paAns);
});

router.post('/register/permissions', async (req, res) => {
    const sendData = {};
    sendData.logKey = req.headers.logkey;
    sendData.logSess = req.headers.logsess;
    sendData.Permissions = req.body;
    const ansPerm = await authProcessObj.registerPermissionListProcess(sendData);
    res.json(ansPerm);
});

router.post('/register/leadertypes', async (req, res) => {
    const sendData = {};
    sendData.logKey = req.headers.logkey;
    sendData.logSess = req.headers.logsess;
    sendData.typeData = req.body;
    const lAns = await authProcessObj.registerDriverLeadersTypesAndPermissions(sendData);
    res.json(lAns);
});

router.post('/vote/leaders', async (req, res) => {
    const sendData = {};
    sendData.logKey = req.headers.logkey;
    sendData.logSess = req.headers.logsess;
    sendData.leaderData = req.body;
    const vAns = await authProcessObj.voteDriverToLeadership(sendData);
    res.json(vAns);
});

router.post('/register/country', async (req, res) => {
    const sendData = req.body;
    sendData.logKey = req.headers.logkey;
    sendData.logSess = req.headers.logsess;
    const cAnsx = await authProcessObj.registerNewCountryProcess(sendData);
    res.json(cAnsx);
});

router.post('/register/region', async (req, res) => {
    const sendData = req.body;
    sendData.logKey = req.headers.logkey;
    sendData.logSess = req.headers.logsess;
    const cAnsx = await authProcessObj.registerNewRegionProcess(sendData);
    res.json(cAnsx);
});

router.post('/register/district', async (req, res) => {
    const sendData = req.body;
    sendData.logKey = req.headers.logkey;
    sendData.logSess = req.headers.logsess;
    const aNsc = await authProcessObj.registerNewDistrictProcess(sendData);
    res.json(aNsc);
});

router.post('/register/ward', async (req, res) => {
    // if (!_.isArray(req.body.wards)) {
    //     const er = {
    //         state: 'error',
    //         data: 'Wrongo data format was submitted'
    //     }
    //     return res.json(er);
    // }
    // for (let inx = 0; inx < req.body.wards.length; inx++) {
    //     const sendData = req.body.wards[inx];
    //     sendData.logKey = req.headers.logkey;
    //     sendData.logSess = req.headers.logsess;
    //     const aMsc = await authProcessObj.registerNewWardProcess(sendData);
    //     if (aMsc.state !== 'success') {
    //         return res.json(aMsc);
    //     }
    // }
    if (typeof (req.body.district) !== 'string') {
        const er = {
            state: 'error',
            data: 'District name is missing from input'
        }
        return er;
    }
    const disL = await authDbObj.OldgetDistWards([req.body.district]);
    if (!_.isArray(disL)) {
        return res.json(disL);
    } else if (_.isArray(disL) && _.isEmpty(disL)) {
        return res.send('Distict does not exits');
    }
    
    for (let enj = 0; enj < disL.length; enj++) {
        const element = disL[enj].name;
        const sendData = {
            ward: element,
            district_id: req.body.district_id,
            code: authDbObj.padNumber(enj+1, 2)
        };
        // console.log(sendData);
        sendData.logKey = req.headers.logkey;
        sendData.logSess = req.headers.logsess;
        const aMsc = await authProcessObj.registerNewWardProcess(sendData);
        if (aMsc.state !== 'success') {
            return res.json(aMsc);
        }
    }
    const ef = {
        state: 'success',
        data: 'wards were successfully created'
    }
    res.json(ef);
});


router.post('/vituo/transfer', async (req, res) => {
    // get old parking areas
    const parkDt = await authDbObj.OldgetVituo();
    if (!_.isArray(parkDt)) {
        return res.json(parkDt);
    } else if (_.isArray(parkDt) && _.isEmpty(parkDt)) {
        res.send('Could not get parks');
    }
    const prks = [];
    for (let lvL = 0; lvL < parkDt.length; lvL++) {
        const element = parkDt[lvL];
        //'park_name', 'park_number', 'park_size', 'vehicle_type', 'ward_id'
        const WardIDs = await authDbObj.selectWardsDetails([element.ward_name], " `ward_name` = ? ");
        const igno = ['UWANJA WA TAIFA'];
        if ((!_.isArray(WardIDs) || _.isEmpty(WardIDs)) && !igno.includes(element.ward_name)) {
            console.log(WardIDs);
            return res.send(`Ward of name ${element.ward_name} does not exit`);
        } else if (_.isArray(WardIDs) && !_.isEmpty(WardIDs)) {
            const prkAr = {
                park_name: element.name,
                park_size: 200,
                vehicle_type: 'Enix74BcbwHr_VTYPE',
                ward_id: WardIDs[0].ward_id,
                owner: element.kituo_kipo_chini_ya === null ? 'notset' : element.kituo_kipo_chini_ya
            }
            prks.push(prkAr);
        }   
    }

    for (let tr = 0; tr < prks.length; tr++) {
        const sendData = prks[tr];
        sendData.logKey = req.headers.logkey;
        sendData.logSess = req.headers.logsess;
        const paAns = await authProcessObj.registerParkAreaProcess(sendData);
        if (paAns.state !== 'success') {
            return res.json(paAns);
        }
    }

    const sc = {
        state: 'success',
        data: 'Parks were successfully transfered'
    }

    res.json(sc);
})

router.post('/driver/transfer', async (req, res) => {
    // select old drivers data 
    /* 
    `jina`, `boda_namba`, `kituo` `dob`, `current_kata`, `simu`, `namba_kitambulisho`, `leseni`, `picha`

    'fname*', 'mname*', 'lname*', 'email*', 'phone*', 'password*', 'dob*', 'gender*', 
    'relation', 'residence*', 'park_area*', 'vehicle_number*', 'licence_number*', 
    'tin_number*', 'id_type*', 'id_number*', 'id_picture*', 'passport*', 'insurance*'
    */
    const oldDriver = await authDbObj.OldgetDrivers();
    if (!_.isArray(oldDriver)) {
        return res.json(oldDriver);
    } else if (_.isArray(oldDriver) && _.isEmpty(oldDriver)) {
        const er = {
            state: 'error',
            data: 'No driver info existing'
        }
        return res.json(er);
    }
    let nn = 0;
    for (let drv = 0; drv < oldDriver.length; drv++) {
        const element = oldDriver[drv];
        const namx = parseName(element.jina);
        if (namx === 'error') {
            continue;
        }

        // phone number check
        const phonx = checkPhoneNumber(element.simu);
        if (phonx === 'error') {
            continue;
        }

        const residence = checkResidence(element.current_kata);
        if (residence === 'error') {
            continue;
        }
        //  select parks
        const prks = await authDbObj.selectParkAreasDetails([element.kituo], " `park_name` = ? ");
        if (!_.isArray(prks)) {
            return res.json(prks);
        } else if (_.isArray(prks) && _.isEmpty(prks)) {
            continue;
        }

        const platN = checkNumberPlateFormat(authDbObj.removeSpaces(element.boda_namba.toUpperCase()));
        if (platN === 'error') {
            continue;
        }

        const lice = validateLicenseNumber(element.leseni);

        const b = isImageDataValid(element.picha);
        if (!b) {
            continue;
        }

        const anc = await uploadImagesToSystem(element.picha);
        if (anc.state !== 'success') {
            return res.json(anc);
        }
        const drvrx = {
            fname: namx.fname,
            mname: namx.mname,
            lname: namx.lname,
            email: 'no@example.com',
            phone: phonx,
            password: authDbObj.generateStrongPassword(8),
            dob: '2022-10-05',
            gender: 'mwanamume',
            relation: 'Sijaoa/Sijaolewa',
            residence,
            park_area: prks[0].park_id,
            vehicle_number: platN,
            licence_number: lice,
            tin_number: 0,
            id_type: 'notset',
            id_number: 'notset',
            id_picture: 'notset',
            passport: anc.data.image_id,
            insurance: 'notset'
        }
        nn++;
        console.log(drvrx);        
    }

    res.send(nn);

});

function parseName(name) {
    const trimmedName = name.trim().replace(/\s+/g, ' ');
    const words = trimmedName.split(' ');

    if (words.length === 2) {
        return {
            fname: words[0],
            mname: words[1],
            lname: words[1]
        };
    } else if (words.length === 3) {
        return {
            fname: words[0],
            mname: words[1],
            lname: words[2]
        };
    } else if (words.length === 4) {
        return {
            fname: words[0],
            mname: words[1],
            lname: words[2] + ' ' + words[3]
        };
    } else {
        return "error";
    }
}

function checkPhoneNumber(phoneNumber) {
    if (phoneNumber.length !== 12 || !(phoneNumber.startsWith('2556') || phoneNumber.startsWith('2557'))) {
        return "error";
    } else {
        return phoneNumber;
    }
}

function checkResidence(residence) {
    if (residence === null || /^\d+$/.test(residence) || residence.length <= 3) {
        return "error";
    } else {
        return residence;
    }
}

function checkNumberPlateFormat(numberPlate) {
    const regex = /^(T|M?C)\d{3}[A-Z]{3}$/;
  
    if (regex.test(numberPlate)) {
      return numberPlate;
    } else {
      return "error";
    }
}

function validateLicenseNumber(licenseNumber) {
    if (!/^\d+$/.test(licenseNumber) || licenseNumber.length < 6) {
        return 0;
    } else {
        return licenseNumber;
    }
}


function isImageDataValid(imageData) {
    // Assuming imageData is a Buffer or binary data
    const minimumImageSize = 10; // Set a minimum size for image data
    if (imageData instanceof Buffer && imageData.length >= minimumImageSize) {
      return true;
    }

    return false;
}

function detectImageFormat(buffer) {
    const detected = imageType(buffer);
    if (detected) {
      console.log('Detected image type:', detected.ext); // This will give you the extension (e.g., 'jpg', 'png', etc.)
      return detected.ext;
    } else {
      console.log('Image format not recognized');
      return null;
    }
}

async function uploadImagesToSystem(imageData) {
    const formData = new FormData();
    const fileName = 'temp_image.jpg'; // Temporary file name for each image
    console.log(formData);
    try {
        console.log(imageData);
        const typv = detectImageFormat(imageData);
        const { data: buffer } = await sharp(imageData, { failOnError: false }).toFormat('jpeg').toBuffer({ resolveWithObject: true });
        formData.append('image', buffer, { filename: 'recovered_image.jpg' });
        formData.append('purpose', 'passport');

        const response = await axios.post('http://192.168.1.93:5600/upload/images', formData, {
            headers: {
                ... formData.getHeaders()
            }
        });
    
        if (response.status === 200) {
            console.log('Images uploaded successfully!');
            const inc = response.data;
            if (typeof (inc.state) !== 'string') {
                const er = {
                    state: 'error',
                    data: 'An error has occurred'
                }
                return er;
            } else if (typeof (inc.state) === 'string' && inc.state !== 'success') {
                console.log(inc);
                const er = {
                    state: 'error',
                    data: 'Error has occuredd check logs'
                }
                return er;
            }
            return inc;
        } else {
            const er = {
                state: 'error',
                data: response.statusText
            }
            console.error('Failed to upload images:', response.statusText);
            return er;
        }
    } catch (error) {
      console.error('Error uploading images:', error);
      const er = {
        state: 'error',
        data: error
    }
    return er;
    }
}

const adminRouter = router;
export default adminRouter;

