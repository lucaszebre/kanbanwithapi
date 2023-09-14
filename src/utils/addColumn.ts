import { axiosInstance } from "./instance";
export const addColumn = async (boardId:string,name:string) =>{
    try{

        const response = await axiosInstance.post(`hhttp://localhost:4000/boards/${boardId}/columns`,{
            name:name
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