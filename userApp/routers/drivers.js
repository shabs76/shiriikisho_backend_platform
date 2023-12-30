import express from "express";
// internal module
import authProcessObj from '../code/auth/processes/authProcess.js';

const router = express.Router();
router.use(express.json());

router.post('/registration', async (req, res) => {
    const regAns = await authProcessObj.registerDriversProcess(req.body);
    res.json(regAns);
});

router.post('/phone/verification', async (req, res) => {
    const dData = req.body;
    if (typeof (dData.phone) !== 'string') {
        const er = {
            state: 'error',
            data: 'Number ya simu haikutumwa'
        }
        return res.json(er);
    }
    const ansIVe = await authProcessObj.verifyDriverPhoneInitProcess(dData.phone, 'newRegistrationUser');
    res.json(ansIVe);
});

router.post('/phone/verification/code', async (req, res) => {
    const sData = req.body;
    const ansCVe = await authProcessObj.verifyDriverPhoneCodeProcess(sData.code, sData.otp_id);
    res.json(ansCVe);
});

router.post('/validation', async (req, res) => {
    const sendData = {};
    sendData.logKey = req.headers.drlogkey;
    sendData.logSess = req.headers.drlogsess;
    sendData.perm_no = 510;
    const ansPerm = await authProcessObj.permissionCheckDriversProcess(sendData);
    if (ansPerm.state !== 'success') {
        return res.json(ansPerm);
    }
    const vaLdata = req.body;
    vaLdata.validator_id = ansPerm.driver_id
    // now validate driver
    const vAns = await authProcessObj.validateDriverProcess(vaLdata);
    res.json(vAns);
});

router.post('/invalidate', async (req, res) => {
    const sendData = {};
    sendData.logKey = req.headers.drlogkey;
    sendData.logSess = req.headers.drlogsess;
    sendData.perm_no = 510;
    const ansPerm = await authProcessObj.permissionCheckDriversProcess(sendData);
    if (ansPerm.state !== 'success') {
        return res.json(ansPerm);
    }
    const vaLdata = req.body;
    vaLdata.validator_id = ansPerm.driver_id;
    // now invalidate driver
    const ivAns = await authProcessObj.invalidateDriverProcess(vaLdata);
    res.json(ivAns);
});


const driverRouter = router;
export default driverRouter;
