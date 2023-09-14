import { axiosInstance } from "./instance";

export const getColumn = async (boardId:string,columnId:string) =>{
    try{

        const response = await axiosInstance.get(`hhttp://localhost:4000/columns/${columnId}`);
        if(response){
            return response.data
            
        }else{
            console.error('Error fetching column')
        }
    }catch(error){
        console.error(error)
    }
};