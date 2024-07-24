import { handleSessionExpiration } from "./handleSessionexpiration";
import { axiosInstance } from "./instance";
export const addColumn = async (boardId:string,Columnname:string) : Promise<any> =>{
    try{

        const response = await axiosInstance.post(`/api/boards/${boardId}/columns`,{
            name:Columnname
        });
        if(response){
            return response
        }else{
            handleSessionExpiration()
            console.error('Error add Column')
        }
    }catch(error){
        handleSessionExpiration()
        console.error("message",'Internal server error')
    }
}