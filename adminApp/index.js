import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import qrcode from 'qrcode';
import _ from 'lodash';
import express from 'express';
// routers
import actsRouter from './routers/acts.js';
import authRouter from './routers/auth.js';
import outherRouter from './routers/other.js';
// internal objects
import mainActs from './code/req/main.js';
import authDbObj from './code/auth/dbQueries/index.js';



dotenv.config();


const app = express();

app.use(cookieParser());
app.use(cors());

app.get('/tes', (req, res) => {
  const er = {
    state: 'error',
    data: 'This is a test error just to begin with'
  }
  mainActs.Mlogger.error({ message: er, label: 'index files' });
  res.json('Hello World Admins!');
});

// routers
app.use('/acts', actsRouter);
app.use('/auth', authRouter);
app.use('/others', outherRouter);

app.get('/qrcode', async (req, res) => {
    if (typeof (req.cookies['otpInit']) !== 'string') {
        return res.status(401).end();
    }

    const otpConfInf = await authDbObj.selectOtpConf([req.cookies['otpInit']], " `conf_id` = ? ");
    if (!_.isArray(otpConfInf)) {
        mainActs.Mlogger.error(otpConfInf);
        return res.status(404).end();
    } else if (_.isArray(otpConfInf) && _.isEmpty(otpConfInf)) {
        mainActs.Mlogger.error('Unable to find data of the otp configuration, cof_id ='+req.cookies['otpInit']);
        return res.status(404).end();
    } 

    let secret = mainActs.decrypt(otpConfInf[0].key_text);
    const issuer = 'Shirikisho';
    const algorithm = 'SHA1';
    const digits = '6';
    const period = '30';
    const otpType = 'totp';
    const configUri = `otpauth://${otpType}/${issuer}:ADMiNS?algorithm=${algorithm}&digits=${digits}&period=${period}&issuer=${issuer}&secret=${secret}`;
    res.setHeader('Content-Type', 'image/png');
    otpauth: qrcode.toFileStream(res, configUri);
})


app.listen(5700, () =>
  console.log(`Admin app listening on port 5200!`),
);