import cors from 'cors';
import express from 'express';
// router 
import adminRouter from './routers/admins.js';
import driverRouter from './routers/drivers.js';
import authRouter from './routers/auth.js';
import otherRouter from './routers/others.js';
import geterRouter from './routers/getters.js';

const app = express();

app.use(cors());

// routers
app.use('/admin', adminRouter);
app.use('/drivers', driverRouter);
app.use('/auth', authRouter);
app.use('/others', otherRouter);
app.use('/get', geterRouter);

app.get('/', (req, res) => {
  res.json('Hello World Users!');
});

app.listen(5100, () =>
  console.log(`User app listening on port 5100!`),
);