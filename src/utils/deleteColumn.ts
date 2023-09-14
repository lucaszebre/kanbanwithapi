import { axiosInstance } from "./instance";

export const deleteColumn = async (columnId:string) =>{
    try{
        const response = await axiosInstance.delete(`hhttp://localhost:4000/columns/${columnId}`);
        if(response){
            return response
        }else{
            console.error('Error deleting Column')
        }
    }catch(error){
        console.error("message",'Internal server error')
    }
}