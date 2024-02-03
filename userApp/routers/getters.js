import express from 'express';
import GettorObj from '../code/auth/processes/getInfoProcess.js';
import authProcessObj from '../code/auth/processes/authProcess.js';

const router = express.Router();

router.use(express.json());

router.get('/reqistration/info', async (req, res) => {
    // get regions
    const regs = await GettorObj.getRegionsList();
    if (regs.state !== 'success') {
        return res.json(regs);
    }
    const distx = await GettorObj.getDistrictList();
    if (distx.state !== 'success') {
        return res.json(distx);
    }
    const wards = await GettorObj.getWardsList();
    if (wards.state !== 'success') {
        return res.json(wards);
    }
    // get kituo details
    const parks = await GettorObj.getParkAreaList();
    if (parks.state !== 'success') {
        return res.json(parks);
    }
    const vehilces = await GettorObj.getVehiclTypesList();
    if (vehilces.state !== 'success') {
        return res.json(vehilces);
    }
    const chamas = await GettorObj.getChamasList();
    if (chamas.state !== 'success') {
        return res.json(chamas);
    }
    // compile data
    const com = {
        state: 'success',
        data: {
            vehilces: vehilces.data,
            parks: parks.data,
            regions: regs.data,
            districts: distx.data,
            wards: wards.data,
            chamas: chamas.data
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

router.get('/unverified/drivers', async (req, res) => {
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

   const ansDrvr = await GettorObj.getUnverifiedDriversInformation(ansLog.driver_id);
   res.json(ansDrvr);
});

router.get('/other/drivers', async (req, res) => {
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
   const oDrivers = await GettorObj.getOtherDriversMember(ansLog.driver_id);
   res.json(oDrivers);
});

router.get('/chama', async (req, res) => {
    const chamz = await GettorObj.getChamasList();
    res.json(chamz);
})

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