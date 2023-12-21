import { updateDbClass } from "./update.js";

export class deleteDbClass extends updateDbClass {
    constructor(){
        super();
    }

    deleteLeaderType = async (type_id) => {
        try{
            if (typeof (type_id) !== 'string') {
                const er ={
                    state: 'error',
                    data: 'type details are missing'
                }
                return er;
            }
            const delQl = "DELETE FROM `leadership_types` WHERE `type_id` = ? ";
            const [ansqry] = await this.dbConn.query(delQl, [type_id]);
            if (ansqry.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Leader type was successfully deleted'
                }
                return suc;
            } else {
                const sc = {
                    state: 'success',
                    data: 'No information about Leader type was not found or You have permission to perform this action'
                }
                return sc;
            }
        } catch(error) {
            this.Mlogger.error(error);
            const err = {
                state: 'error',
                data: 'Unable to perform this action server error has occured'
            }
            return err;
        }
    }

    deleteDriverUniform = async (uniform_id) => {
        try{
            if (typeof (uniform_id) !== 'string') {
                const er ={
                    state: 'error',
                    data: 'Uniform details are missing'
                }
                return er;
            }
            const delQl = "DELETE FROM `driver_uniforms` WHERE  `uniform_id` = ? ";
            const [ansqry] = await this.dbConn.query(delQl, [type_id]);
            if (ansqry.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Uniform number was successfully deleted'
                }
                return suc;
            } else {
                const sc = {
                    state: 'success',
                    data: 'No information about uniform was not found or You have permission to perform this action'
                }
                return sc;
            }
        } catch(error) {
            this.Mlogger.error(error);
            const err = {
                state: 'error',
                data: 'Unable to perform this action server error has occured'
            }
            return err;
        }
    }
}