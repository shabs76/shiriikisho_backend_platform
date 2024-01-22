import express from 'express';
import mainProcsObj from '../code/auth/processes/mainProcess.js';

const router = express.Router();
router.use(express.json());

router.post('/login', async (req, res) => {
    const ansLog = await mainProcsObj.initSignProcesses(req.body);
    if (ansLog.state === 'success') {
        // check for status of otp and set cookie for it.
        if (ansLog.code_st === 'created') {
            res.cookie("otpInit", ansLog.code_id, {
                maxAge: 1000*60*30
            });
        } else {
            res.cookie("otpVer", ansLog.code_id, {
                maxAge: 1000*60*30
            });
        }
    }
    const sendInf = {
        state: ansLog.state,
        data: ansLog.data,
        code_st: ansLog.code_st,
    }
    res.json(sendInf);
});

router.post('/login/verification', async (req, res) => {
    const dataz = req.body;
    dataz.ip = req.socket.remoteAddress;
    if (typeof (req.cookies['otpInit']) === 'string') {
        dataz.code_id = req.cookies['otpInit'];
    } else if (typeof (req.cookies['otpVer']) === 'string') {
        dataz.code_id = req.cookies['otpVer'];
    } else {
        const er = {
            state: 'error',
            data: 'Unable to identify your account, Please refresh the page and try again.'
        }
        return res.json(er);
    }
    const verAns = await mainProcsObj.codeVerificationProcess(dataz);
    if (verAns.state === 'success') {
        res.cookie("loginSess", verAns.logSess, {
            maxAge: 1000*60*60, 
            sameSite: 'none',
            httpOnly: true,
            domain: 'localhost:3000'
        });
        res.cookie("loginKey", verAns.logKey, {
            maxAge: 1000*60*60, 
            sameSite: 'none',
            httpOnly: true,
            domain: 'localhost:3000'
        });
    }
    res.json(verAns);
});

router.post('/logout', async (req, res) => {
    if (typeof (req.headers.logkey) !== 'string' || typeof (req.headers.logsess) !== 'string') {
        return res.json({ state: 'error', data: 'You need to login to access this service', adv: 'logout' });
    }
    const logAns = await mainProcsObj.logoutAdminAuthProcess(req.headers.logkey, req.headers.logsess);
    res.json(logAns);
})

const authRouter = router;
export default authRouter;