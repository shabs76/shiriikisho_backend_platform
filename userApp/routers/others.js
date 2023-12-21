import express from 'express';
import authProcessObj from '../code/auth/processes/authProcess.js';

const router = express.Router();

router.use(express.json());

router.use(async (req, res, next) => {
    const valInfo = {
        serviceName: req.headers.servicename,
        serviceSecret: req.headers.servicesecret
    }
    const valAns = await authProcessObj.checkValidServiceRequest(valInfo);
    if (valAns.state !== 'success') {
        return res.json(valAns);
    }
    console.log('log next');
    next();
});

router.post('/driver/login/status', async(req, res) => {
    const infoz = req.body;
    console.log(infoz);
    if (typeof (infoz.logKey) !== 'string' || typeof (infoz.logSess) !== 'string') {
        const er = {
            state: 'error',
            data: 'Ulizo halijakamilika. Tafadhali jaribu tena'
        }
        return res.json(er);
    }

    const logAns = await authProcessObj.checkDriversLoginStatus(infoz);
    res.json(logAns);
});

router.post('/driver/reg/numb', async (req, res) => {
    if (typeof (req.body.verid) !== 'string') {
        const er = {
            state: 'error',
            data: 'Ulizo halijakamilika. Tafadhali jaribu tena'
        }
        return res.json(er);
    }
    const regNans = await authProcessObj.checkForValidVerifiedPhoneIdProcess(req.body.verid);
    res.json(regNans);
})


const otherRouter = router;
export default otherRouter;