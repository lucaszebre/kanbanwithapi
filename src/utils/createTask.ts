import axios from "axios";

export const createTask = async (userId:string,boardId:string,columnId:string) =>{
    try{
        const response = await axios.post(`https://kanbantask.onrender.com/user/${userId}/boards/${boardId}/columns/${columnId}`);
        if(response){
            return response
        }else{
            console.error('Error adding task')
        }
    }catch(error){

    }
}
