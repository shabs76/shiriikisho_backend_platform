import { deleteDbClass } from "./delete.js";

class authDbClass extends deleteDbClass {
    constructor(){
        super();
    }
}

const authDbObj = new authDbClass();
export default authDbObj;
