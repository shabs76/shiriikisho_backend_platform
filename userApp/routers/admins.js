import express from 'express';
// internal module
import authProcessObj from '../code/auth/processes/authProcess.js';

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
})

const adminRouter = router;
export default adminRouter;

