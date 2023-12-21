import { mainActsClass } from "../../req/main.js";

export class insertDBClass extends mainActsClass{
    dbConn;
    transConn;
    constructor() {
        super();
        const database = this.dbNames('gene');
        this.dbConn = this.connv(database);
    }


    addingMainImage = async (info) => {
        try {
            const requireVals = ['o_path', 'purpose'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const image_id = this.createRandChars(32, 'IMGMAIN');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO main_images(image_id, image_path_og, purpose, upload_date) VALUES (?,?,?, CURRENT_TIMESTAMP)
            `,[image_id, info.o_path, info.purpose]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Image details were successfully save',
                        image_id
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not save image details. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not save image details. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingLowQualityImages = async (info) => {
        try {
            const requireVals = ['l_path', 'image_id'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const image_id_ql = this.createRandChars(32, 'IMGLOW');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO images_ql(image_id_ql, image_id, image_path_ql, upload_date_ql) VALUES (?,?,?, CURRENT_TIMESTAMP)
            `,[image_id_ql, info.image_id , info.l_path]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Low image details were successfully save',
                        image_id_ql
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not save low image details. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not save low image details. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingMediumQualityImages = async (info) => {
        try {
            const requireVals = ['m_path', 'image_id'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const image_id_qm = this.createRandChars(32, 'IMGMED');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO images_qm(image_id_qm, image_id, image_path_qm, upload_date_qm) VALUES (?,?,?, CURRENT_TIMESTAMP)
            `,[image_id_qm, info.image_id , info.m_path]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'Medium image details were successfully save',
                        image_id_qm
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not save medium image details. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not save medium image details. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

    addingHighQualityImages = async (info) => {
        try {
            const requireVals = ['h_path', 'image_id'];
            const reState = this.checkRequireValues(requireVals, info);
            if (typeof (reState.state) !== 'undefined' && reState.state === 'error') {
                return reState;
            }
            const image_id_qh = this.createRandChars(32, 'IMGHIGH');
            const [createAns] = await this.dbConn.query(`
                INSERT INTO images_qh(image_id_qh, image_id, image_path_qh, upload_date_qh) VALUES (?,?,?, CURRENT_TIMESTAMP)
            `,[image_id_qh, info.image_id , info.h_path]
            );
            this.Mlogger.debug(createAns);
            if (typeof (createAns.affectedRows) === 'number' && createAns.affectedRows > 0) {
                const suc = {
                    state: 'success',
                    data: {
                        info:'High image details were successfully save',
                        image_id_qh
                    },
                }
                return suc;
            }
    
            const Erro = {
                state: "error",
                data: 'Could not save high image details. #unkown',
            }
            return Erro;
        } catch (error) {
            const Erro = {
                state: "error",
                data: 'Could not save high image details. #data error',
            }
            this.Mlogger.error(error);
            return Erro;
        }
    }

}