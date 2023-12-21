import { deleteDBClass } from "./delete.js";

class authDbClass extends deleteDBClass{
    constructor(){
        super();
    }

}

const authDbObj = new authDbClass();
export default authDbObj;