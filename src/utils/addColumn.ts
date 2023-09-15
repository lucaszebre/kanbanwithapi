import { axiosInstance } from "./instance";
export const addColumn = async (boardId:string,Columnname:string) =>{
    try{

        const response = await axiosInstance.post(`/boards/${boardId}/columns`,{
            name:Columnname
        });
        if(response){
            return response
        }else{
            console.error('Error add Column')
        }
    }catch(error){
        console.error("message",'Internal server error')
    }
}