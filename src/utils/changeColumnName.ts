import { handleSessionExpiration } from "./handleSessionexpiration";
import { axiosInstance } from "./instance";
export const changeColumnName = async (columnId:string,name:string) =>{
    try{
        const response = await axiosInstance.put(`/column/${columnId}`,{
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