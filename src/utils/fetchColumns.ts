import { axiosInstance } from "./instance";


export const fetchColumns = async (columnId:string) =>{
    try{
        const response = await axiosInstance.get(`hhttp://localhost:4000/columns/${columnId}`);
        if(response){
            return response
        }else{
            console.error('Error fetching column')
        }
    }catch(error){
        console.error(error)
    }
};