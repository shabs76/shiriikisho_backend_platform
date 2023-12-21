import { updateDBClass } from "./update.js";

export class selectDBClass extends updateDBClass{
    constructor(){
        super();
    }

    selectMainImageDetails = async (whereArr = [''], subquery = " `image_id` = ?") => {
        const ql = "SELECT `image_id`, `image_path_og`, `purpose`, `status`, `upload_date` FROM `main_images` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectLowImageDetails = async (whereArr = [''], subquery = " `image_id` = ?") => {
        const ql = "SELECT `image_id_ql`, `image_id`, `image_path_ql`, `upload_date_ql` FROM `images_ql` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectMediumImageDetails = async(whereArr = [''], subquery = " `image_id` = ?") => {
        const ql = "SELECT `image_id_qm`, `image_id`, `image_path_qm`, `upload_date_qm` FROM `images_qm` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectMediumImageDetails = async(whereArr = [''], subquery = " `image_id` = ?") => {
        const ql = "SELECT `image_id_qm`, `image_id`, `image_path_qm`, `upload_date_qm` FROM `images_qm` WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    // relation querries
    selectAllQualitiesDetails = async (whereArr = [''], subquery = " main_images.image_id = ?") => {
        const ql = "SELECT main_images.image_id AS image_id, `image_path_og`, `purpose`, `status`, `image_path_qh`, `image_path_ql`, `image_path_qm` FROM main_images INNER JOIN images_ql ON images_ql.image_id = main_images.image_id INNER JOIN images_qm ON images_qm.image_id = main_images.image_id INNER JOIN images_qh ON images_qh.image_id = main_images.image_id WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectMainNMediumImagesQuailties = async (whereArr = [''], subquery = " main_images.image_id = ?") => {
        const ql = "SELECT main_images.image_id AS image_id, `image_path_og`, `purpose`, `status`, `image_path_qm` FROM main_images  INNER JOIN images_qm ON images_qm.image_id = main_images.image_id WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectMainNLowImagesQuailties = async (whereArr = [''], subquery = " main_images.image_id = ?") => {
        const ql = "SELECT main_images.image_id AS image_id, `image_path_og`, `purpose`, `status`, `image_path_ql` FROM main_images  INNER JOIN images_ql ON images_ql.image_id = main_images.image_id WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    selectMainNHighImagesQuailties = async (whereArr = [''], subquery = " main_images.image_id = ?") => {
        const ql = "SELECT main_images.image_id AS image_id, `image_path_og`, `purpose`, `status`, `image_path_qh` FROM main_images INNER JOIN images_qh ON images_qh.image_id = main_images.image_id WHERE "+subquery;
        const ans = await this.runQuery(whereArr, ql);
        return ans;
    }

    runQuery = async (searchArr, Query) => {
        try {
            const results = await this.dbConn.query(Query, searchArr);
            const rows = results[0];
            return rows;
        } catch(error) {
            const erro = {
                status: 'error',
                data: 'Unable to fetch data',
            }
            this.Mlogger.error(error);
            return erro;
        }
    }
}