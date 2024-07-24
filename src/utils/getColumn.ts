import { handleSessionExpiration } from "./handleSessionexpiration";
import { axiosInstance } from "./instance";

export const getColumn = async (boardId:string,columnId:string) =>{
    try{

        const response = await axiosInstance.get(`/api/columns/${columnId}`);
        if(response){
            return response.data
            
        }else{
            handleSessionExpiration()
            console.error('Error fetching column')
        }
    }catch(error){
        handleSessionExpiration()
        console.error(error)
    }
};