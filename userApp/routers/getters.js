import express from 'express';
import GettorObj from '../code/auth/processes/getInfoProcess.js';
import authProcessObj from '../code/auth/processes/authProcess.js';

const router = express.Router();

router.use(express.json());

router.get('/reqistration/info', async (req, res) => {
    // get kituo details
    const parks = await GettorObj.getParkAreaList();
    if (parks.state !== 'success') {
        return res.json(parks);
    }
    const vehilces = await GettorObj.getVehiclTypesList();
    if (vehilces.state !== 'success') {
        return res.json(vehilces);
    }

    // compile data
    const com = {
        state: 'success',
        data: {
            vehilces: vehilces.data,
            parks: parks.data
        }
    }
    res.json(com);
});




router.get('/driver/details', async (req, res) => {
    const hedz = req.headers;
    if (typeof (hedz.drlogkey) !== 'string' || typeof (hedz.drlogsess) !== 'string') {
        const er = {
            state: 'error',
            data: 'Missing login details information',
            adv: 'logout'
        }
        return res.json(er);
    }
    // check if the login info are valid still (info.logKey) !== 'string' || typeof (info.logSess)
    const info = {
        logKey: hedz.drlogkey,
        logSess: hedz.drlogsess
    };
   const ansLog = await authProcessObj.checkDriversLoginStatus(info);
   if (ansLog.state !== 'success') {
     ansLog.adv = 'logout';
     return res.json(ansLog);
   }

   const ansInf = await GettorObj.getAllDriverInformation(ansLog.driver_id);
   res.json(ansInf);

});


// from here information requires login

router.use(async (req, res, next) => {
    // check for headers
    const hedz = req.headers;
    if (typeof (hedz.drlogkey) !== 'string' || typeof (hedz.drlogsess) !== 'string') {
        const er = {
            state: 'error',
            data: 'Missing login details information',
            adv: 'logout'
        }
        return res.json(er);
    }
    // check if the login info are valid still (info.logKey) !== 'string' || typeof (info.logSess)
    const info = {
        logKey: hedz.drlogkey,
        logSess: hedz.drlogsess
    };
   const ansLog = await authProcessObj.checkDriversLoginStatus(info);
   if (ansLog.state !== 'success') {
     ansLog.adv = 'logout';
     return res.json(ansLog);
   }
   next();
});
const geterRouter = router;
export default geterRouter;