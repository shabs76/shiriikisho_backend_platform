import { selectDBClass } from "./select.js";

export class deleteDbClass extends selectDBClass {
    constructor(){
        super();
    }

    deleteImageDetails = async (image_id) => {
        try{
            if (typeof (image_id) !== 'string') {
                const er ={
                    state: 'error',
                    data: 'Image details are missing'
                }
                return er;
            }
            const delQl = "DELETE FROM `main_images` WHERE `image_id` = ?";
            const [ansqry] = await this.dbConn.query(delQl, [image_id]);
            if (ansqry.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: 'Image details were successfully deleted'
                }
                return suc;
            } else {
                const sc = {
                    state: 'success',
                    data: 'No information about the image were found or You have permission to perform this action'
                }
                return sc;
            }
        } catch(error) {
            this.Mlogger.error(error);
            const err = {
                state: 'error',
                data: 'Unable to perform this action server error occured'
            }
            return err;
        }
    }
}