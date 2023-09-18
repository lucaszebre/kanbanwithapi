import { handleSessionExpiration } from "./handleSessionexpiration";
import { axiosInstance } from "./instance";


export const fetchColumns = async (columnId:string) =>{
    try{
        const response = await axiosInstance.get(`/columns/${columnId}`);
        if(response){
            return response
        }else{
            handleSessionExpiration()
            console.error('Error fetching column')
        }
    }catch(error){
        console.error(error)
    }
};