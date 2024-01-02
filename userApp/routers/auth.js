import express from 'express';
import _ from 'lodash';
import dotenv from 'dotenv';
// internal modules
import authProcessObj from '../code/auth/processes/authProcess.js';
dotenv.config();

const router = express.Router();

router.use(express.json());

router.post('/login/init', async (req, res) => {
   const ldata = req.body;
   if (typeof (ldata.phone) !== 'string' || typeof (ldata.password) !== 'string') {
        const er = {
            state: 'error',
            data: 'Namba ya simu na neno la siri zinahitajika'
        }
        return res.json(er);
   }

   const lgoAns = await authProcessObj.loginInitDriverProcess(ldata.phone, ldata.password);
   res.json(lgoAns);
});

router.post('/login/code', async (req, res) => {
    const flData = req.body;
    if (typeof (flData.code) !== 'number' || typeof (flData.otp_id) !== 'string') {
        const er = {
            state: 'error',
            data: 'Taarifa za muhimu zimekosekana. Tafadhali hakikisha namba ya uthibitisho imetumwa.'
        }
        return res.json(er);
    }
    const flgoAns = await authProcessObj.loginLastCodeDriverProcess(flData.code, flData.otp_id);
    res.json(flgoAns);
});

router.post('/code/resend', async (req, res) => {
    if (typeof (req.body.otp_id) !== 'string') {
        const er = {
            state: 'error',
            data: 'Invalid otp was sent.'
        }
        return res.json(er);
    }

    const resAns = await authProcessObj.resendCodeProcess(req.body.otp_id);
    res.json(resAns);
});


router.post('/logout', async (req, res) => {
    const hedz = req.headers;
    if (typeof (hedz.drlogkey) !== 'string' || typeof (hedz.drlogsess) !== 'string') {
        const er = {
            state: 'error',
            data: 'Missing login details information',
            adv: 'logout'
        }
        return res.json(er);
    }
    const info = {
        logKey: hedz.drlogkey,
        logSess: hedz.drlogsess
    };
    const anSlo = await authProcessObj.logoutDriverProcess(info);
    res.json(anSlo);
});

router.post('/forget/pass/init', async (req, res) => {
    if (typeof (req.body.phone) !== 'string') {
        const er = {
            state: 'error',
            data: 'Namba ya simu inakosekana.Tafadhali weka number ya simu'
        }
        return res.json(er);
    }
    const anx = await authProcessObj.forgetPasswordInitProcess(req.body.phone);
    res.json(anx);
});

router.post('/forget/pass/last', async (req, res) => {
    const ansl = await authProcessObj.fogertPassLastProcess(req.body);
    res.json(ansl);
});

const authRouter = router;
export default authRouter;