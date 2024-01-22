import express from 'express';
// internal module
import authProcessObj from '../code/auth/processes/authProcess.js';
import authDbObj from '../code/auth/dbQueries/index.js';
import AdminGetterObj from '../code/auth/processes/adminGetInfoProcess.js';
import _ from 'lodash';

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
    if (!_.isArray(req.body.wards)) {
        const er = {
            state: 'error',
            data: 'Wrongo data format was submitted'
        }
        return res.json(er);
    }
    for (let inx = 0; inx < req.body.wards.length; inx++) {
        const sendData = req.body.wards[inx];
        sendData.logKey = req.headers.logkey;
        sendData.logSess = req.headers.logsess;
        const aMsc = await authProcessObj.registerNewWardProcess(sendData);
        if (aMsc.state !== 'success') {
            return res.json(aMsc);
        }
    }
});

// dev Only 
router.post('/getInitData', async (req, res) => {
    const initInfo = await AdminGetterObj.getInitSystemAdimInfo();
    res.json(initInfo);
});

router.post('/get/park/members', async (req, res) => {
    const membes = await AdminGetterObj.getDriverWithSearch(req.body.park_id);
    res.json(membes);
});

router.post('/search/drivers', async (req, res) => {
    const drvs = await AdminGetterObj.getDriverWithSearch(req.body.query, " LIMIT 0, 80");
    res.json(drvs);
})

const adminRouter = router;
export default adminRouter;

