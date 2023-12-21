import express from 'express';
import mainProcsObj from '../code/auth/processes/mainProcess.js';

const router = express.Router();

router.use(express.json());

// check normal use actions {check here for more security reasons for latter}

// router.use(async(req, res, next) => {
//     // check if the two cookies are set
//     if (typeof (req.cookies['loginKey']) !== 'string' || typeof (req.cookies['loginSess']) !== 'string') {
//         return res.status(401).end();
//     }

//     const ansCheck = await mainProcsObj.verifyingLoginsProcess(req.cookies['loginKey'], req.cookies['loginSess']);
//     if (ansCheck.state !== 'success') {
//         return res.status(401).json(ansCheck).end();
//     }
//     next();
// });

router.post('/register/service', async (req, res) => {
    const sevAdd = await mainProcsObj.registerServiceAuthProcess(req.body);
    res.json(sevAdd);
});

router.post('/register/user', async (req, res) => {
    const regAns = await mainProcsObj.adminProcessRegistration(req.body);
    res.json(regAns);
});

router.post('/register/permissions', async (req, res) => {
    const perAns = await mainProcsObj.addingPermissionListProcess(req.body);
    res.json(perAns);
});

router.post('/register/types', async (req, res) => {
    const typAns = await mainProcsObj.addingTypesListProcess(req.body);
    res.json(typAns);
})


const actsRouter = router;
export default actsRouter;