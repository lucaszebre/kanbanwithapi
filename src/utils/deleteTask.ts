import axios from "axios";

export const deleteTask = async (userId:string,boardId:string,columnId:string,taskId:string) =>{
    try{
        const response = await axios.delete(`https://kanbantask.onrender.com/user/${userId}/boards/${boardId}/columns/${columnId}/tasks/${taskId}`);
        if(response){
            return response
        }else{
            console.error('Error deleting task')
        }
    }catch(error){

    }
}