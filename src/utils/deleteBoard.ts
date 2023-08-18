import axios from "axios";

export const deleteBoard = async (userId:string,boardId:string) =>{
    try{
        const response = await axios.delete(`https://kanbantask.onrender.com/user/${userId}/boards/${boardId}`);
        if(response){
            return response
        }else{
            console.error('Error deleting Board')
        }
    }catch(error){

    }
}