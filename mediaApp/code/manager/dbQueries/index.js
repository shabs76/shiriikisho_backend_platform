import { deleteDbClass } from "./delete.js";

class mediaDbClass extends deleteDbClass{
    constructor(){
        super();
    }
}

const mediaDbObj = new mediaDbClass();
export default mediaDbObj;
