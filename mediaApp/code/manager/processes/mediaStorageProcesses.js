import mediaDbObj from "../dbQueries/index.js";
import _ from "lodash";
import { mainActsClass } from "../../req/main.js";

class mediaStorageProcessesClass extends mainActsClass{
    constructor(){
        super();
    }

    saveUploadedImageDetails = async (info) => {
        // check if all paths are set
        if (typeof (info.purpose) !== 'string' || typeof (info.o_path) !== 'string' || typeof (info.l_path) !== 'string' || typeof (info.m_path) !== 'string' || typeof (info.h_path) !== 'string') {
            const er = {
                state: 'error',
                data: 'Missing paths. Please try again'
            }
            return er;
        }

        const mainAns = await mediaDbObj.addingMainImage(info);
        if (mainAns.state !== 'success') {
            return mainAns;
        }

        // adding low quality info
        info.image_id = mainAns.data.image_id;
        const lowAns = await mediaDbObj.addingLowQualityImages(info);
        if (lowAns.state !== 'success') {
            this.Mlogger.error(lowAns);
            // issue delete on main
            const delAns = await mediaDbObj.deleteImageDetails(mainAns.data.image_id);
            if (delAns.state !== 'success') {
                this.Mlogger.error(delAns);
            }
            return lowAns;
        }
        // adding medium ql info
        const medAns = await mediaDbObj.addingMediumQualityImages(info);
        if (medAns.state !== 'success') {
            this.Mlogger.error(medAns);
            // issue delete on main
            const delAns = await mediaDbObj.deleteImageDetails(mainAns.data.image_id);
            if (delAns.state !== 'success') {
                this.Mlogger.error(delAns);
            }
            return medAns;
        }
        // adding high quality images
        const highAns = await mediaDbObj.addingHighQualityImages(info);
        if (highAns.state !== 'success') {
            this.Mlogger.error(highAns);
            // issue delete on main
            const delAns = await mediaDbObj.deleteImageDetails(mainAns.data.image_id);
            if (delAns.state !== 'success') {
                this.Mlogger.error(delAns);
            }
            return highAns;
        }

        // returns
        return mainAns;
    }

    getAllImagesPathsNormal = async (image_id) =>{
        if (typeof (image_id) !== 'string') {
            const er = {
                state: 'error',
                data: 'Invalid image id format'
            }
            return er;
        }

        const imagData = await mediaDbObj.selectAllQualitiesDetails([image_id, 'active'], " main_images.image_id = ? AND main_images.status = ?");
        if (!_.isArray(imagData)) {
            this.Mlogger.error(imagData);
            const er = {
                state: 'error',
                data: 'Error in obtaing image paths'
            }
            return er;
        } else if (_.isArray(imagData) && _.isEmpty(imagData)) {
            const er = {
                state: 'error',
                data: 'Image does not exist'
            }
            return er;
        }

        const sc = {
            state: 'success',
            data: imagData[0]
        };
        return sc;
    }
}

const mediaStorageObj = new mediaStorageProcessesClass();
export default mediaStorageObj;
