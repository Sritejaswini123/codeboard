import { PROJECT_DELETED, PROJECT_ID_REQUIRED, PROJECT_NOT_FOUND } from "../constants/appMessages";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from "../constants/httpStatusCodes";
import { projects } from "../database/schemas/projects";
import NotFoundException from "../exceptions/notFoundException";
import factory from "../factory";
import { deleteRecordById } from "../service/baseDbServices";
import { deletedProjectById } from "../service/projectServices";
import { sendResponse } from "../utils/sendResponse";



export const delteProjectByIdHandler=factory.createHandlers(async(c)=>{
    const projectId=Number(c.req.param('user_id'));
    try {
        console.log("hello 0 project id",projectId);
        
        if(!projectId){
            return sendResponse(c,BAD_REQUEST,PROJECT_ID_REQUIRED);
        }
        console.log("hello1");
        
        const projectExist=await deletedProjectById(projectId);
        console.log("hello2");
        console.log("project exist",projectExist);
        
        if(!projectExist){
            throw new NotFoundException(PROJECT_NOT_FOUND);
        }
        console.log("hello3");
        
        const deletedProject=await deleteRecordById(projects,projectId);
        console.log("hello4");
     return   sendResponse(c,OK,PROJECT_DELETED,deletedProject)
    } catch (error) {    
        return sendResponse(c,   INTERNAL_SERVER_ERROR,PROJECT_NOT_FOUND);
    }

})





