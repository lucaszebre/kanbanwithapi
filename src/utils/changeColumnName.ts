import { axiosInstance } from "./instance";

export const changeColumnName = async (columnId:string,name:string) =>{
    try{
        const response = await axiosInstance.put(`/column/${columnId}`,{
            name:name
        });
        if(response){
            return response
        }else{
            console.error('Error changing column name')
        }
    }catch(error){
        console.error("message",'Internal server error')
    }
}