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
})

const authRouter = router;
export default authRouter;