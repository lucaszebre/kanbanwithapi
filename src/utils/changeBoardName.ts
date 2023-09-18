import { handleSessionExpiration } from "./handleSessionexpiration";
import { axiosInstance } from "./instance";
export const changeBoardName = async (boardId:string,name:string) =>{
    try{
        const response = await axiosInstance.put(`/boards/${boardId}`,{
            name:name
        });
        if(response){
            return response
        }else{
            handleSessionExpiration()
            console.error('Error changing column name')
        }
    }catch(error){
        handleSessionExpiration()
        console.error("message",'Internal server error')
    }
}