import { insertDBClass } from "./insert.js";

export class updateDBClass extends insertDBClass{
    constructor(){
        super();
    }

    updatingImageState = async (info) => {
        try{
            const requireVals = ['image_id', 'status'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            if (info.status !== 'active' && info.status !== 'blocked' && info.status !== 'deleted') {
                const er = {
                    state: 'error',
                    data: 'Invalid image status'
                }
                return er;
            }

            const qlup = "UPDATE `main_images` SET `status`= ? WHERE `image_id`= ? ";
            const [ansUpdt] = await this.dbConn.query(qlup, [info.status, info.image_id]);
            if (typeof (ansUpdt.affectedRows) === 'number' && ansUpdt.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Image status was successfully updated'
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not update image status data. #unkown',
            }
            return Erro;
        } catch(error) {
            const Erro = {
                state: "error",
                data: 'Could not update image status data. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }
}