import { axiosInstance } from "./instance";

export const changeBoardName = async (boardId:string,name:string) =>{
    try{
        const response = await axiosInstance.put(`hhttp://localhost:4000/boards/${boardId}`,{
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