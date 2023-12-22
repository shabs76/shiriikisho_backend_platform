import express from 'express';
import GettorObj from '../code/auth/processes/getInfoProcess.js';


const router = express.Router();

router.use(express.json());

router.get('/reqistration/info', async (req, res) => {
    // get kituo details
    const parks = await GettorObj.getParkAreaList();
    if (parks.state !== 'success') {
        return res.json(parks);
    }
    const vehilces = await GettorObj.getVehiclTypesList();
    if (vehilces.state !== 'success') {
        return res.json(vehilces);
    }

    // compile data
    const com = {
        state: 'success',
        data: {
            vehilces: vehilces.data,
            parks: parks.data
        }
    }
    res.json(com);
})

const geterRouter = router;
export default geterRouter;