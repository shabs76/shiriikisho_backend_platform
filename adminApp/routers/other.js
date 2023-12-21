import express from 'express';
import mainProcsObj from '../code/auth/processes/mainProcess.js';
import GenApis from '../code/api/gen.js';
const router = express.Router();

router.use(express.json());

router.use(async (req, res, next) => {
    const valInfo = {
        serviceName: req.headers.servicename,
        serviceSecret: req.headers.servicesecret
    }
    const valAns = await mainProcsObj.validateServiceAuth(valInfo);
    if (valAns.state !== 'success') {
        return res.json(valAns);
    }
    next();
});

router.get('/validate/service', (req, res) => {
    const ans = {
        state: 'success',
        data: 'Service is valid'
    }
    res.json(ans);
});

router.post('/validate/service/onbehalf', async (req, res) => {
    const infoz = req.body;
    if (typeof (infoz.serviceName) !== 'string' || typeof (infoz.serviceSecret) !== 'string') {
        const er = {
            state: 'error',
            data: 'Permission denined for the service missing information'
        }
        return res.json(er);
    }
    const valAns = await mainProcsObj.validateServiceAuth(infoz);
    res.json(valAns);
})

router.post('/check/permission', async (req, res) => {
    // check if all data are available
    const datz = req.body;
    if (typeof (datz.logKey) !== 'string' || typeof (datz.logSess) !== 'string' || typeof (datz.req_perm) !== 'number' || typeof (datz.req_type) !== 'number') {
        const er = {
            state: 'error',
            data: 'Missing data were submitted'
        }
        return res.json(er);
    }
    const permAns = await mainProcsObj.checkUserPermissions(datz.logKey, datz.logSess, datz.req_perm, datz.req_type);
    res.json(permAns);
});

router.post('/check/login/status', async (req, res) => {
    const datz = req.body;
    if (typeof (datz.logKey) !== 'string' || typeof (datz.logSess) !== 'string') {
        const er = {
            state: 'error',
            data: 'Missing data were submitted'
        }
        return res.json(er);
    }
    const permAns = await mainProcsObj.verifyingLoginsProcess(datz.logKey, datz.logSess);
    res.json(permAns);
})

router.post('/send/normal/text', async (req, res) => {
    const sendData = req.body;
    if (typeof (sendData.phone) !== 'string' || typeof (sendData.sms) !== 'string') {
        const er = {
            state: 'error',
            data: 'Missing data on the submit. Please check data sent and try again'
        }
        return res.json(er);
    }
    const ansSend = await GenApis.sendTextApI(sendData.sms, sendData.phone);
    res.json(ansSend);
})

const outherRouter = router;
export default outherRouter;