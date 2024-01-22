import express from 'express';

import AdminGetterObj from '../code/auth/processes/adminGetInfoProcess.js';


const router = express.Router();

router.use(express.json());

router.use( async (req, res, next) => {
    const permInf = {
        logKey: req.headers.logkey,
        logSess: req.headers.logsess,
        req_perm: 710,
        req_type: 510
    }
    const permCheck = await AdminGetterObj.checkAdminPermissions(permInf);
    if (permCheck.state !== 'success') {
        return res.json(permCheck);
    }
    next();
})

router.get('/initial/info', async (req, res) => {
    const initInfo = await AdminGetterObj.getInitSystemAdimInfo();
    res.json(initInfo);
})




const AdGetRouter = router;
export default AdGetRouter;