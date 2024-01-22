import express from 'express';
import mainProcsObj from '../code/auth/processes/mainProcess.js';
import UserApiObj from '../code/req/user_api.js';

const router = express.Router();

router.use(express.json());

router.post('/get/init/data', async (req, res) => {
    // check on the admin if exits
    if (typeof (req.headers.logkey) !== 'string' || typeof (req.headers.logsess) !== 'string') {
        return res.json({ state: 'error', data: 'You need to login to access this service', adv: 'logout' });
    }

    const ansCheck = await mainProcsObj.verifyingLoginsProcess(req.headers.logkey, req.headers.logsess);
    if (ansCheck.state !== 'success') {
        return res.json({ state: 'error', data: 'You need to login to access this services', adv: 'logout' });
    }
    const data = await UserApiObj.getAdminUserRelatedInfo('/admin/getInitData', {}, { logsess: req.headers.logsess, logkey: req.headers.logkey });
    
    if (typeof (data.state) === 'string' && data.state === 'success') {
        data.data.admin = ansCheck.user;
    }
    res.json(data);

})
// check normal use actions {check here for more security reasons for latter}

router.use(async(req, res, next) => {
    // check if the two cookies are set 
    if (typeof (req.headers.logkey) !== 'string' || typeof (req.headers.logsess) !== 'string') {
        return res.json({ state: 'error', data: 'You need to login to access this service', adv: 'logout' });
    }

    const ansCheck = await mainProcsObj.verifyingLoginsProcess(req.headers.logkey, req.headers.logsess);
    if (ansCheck.state !== 'success') {
        return res.json({ state: 'error', data: 'You need to login to access this services', adv: 'logout' });
    }
    next();
});

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
});

// dev time only
router.post('/get/park/members', async (req, res) => {
    const data = await UserApiObj.getAdminUserRelatedInfo('/admin/get/park/members', { park_id: req.body.park_id }, { logsess: req.headers.logsess, logkey: req.headers.logkey });
    res.json(data);
});

router.post('/vote/park/leader', async (req, res) => {
    const data = await UserApiObj.getAdminUserRelatedInfo('/admin/vote/leaders', { ...req.body }, { logsess: req.headers.logsess, logkey: req.headers.logkey });
    res.json(data);
});

router.post('/register/parkarea', async (req, res) => {
    const data = await UserApiObj.getAdminUserRelatedInfo('/admin/register/parkarea', { ...req.body }, { logsess: req.headers.logsess, logkey: req.headers.logkey });
    res.json(data);
});

router.post('/search/drivers', async (req, res) => {
    const drv = await UserApiObj.getAdminUserRelatedInfo('/admin/search/drivers', { ...req.body  }, { logsess: req.headers.logsess, logkey: req.headers.logkey });
    res.json(drv);
})



const actsRouter = router;
export default actsRouter;