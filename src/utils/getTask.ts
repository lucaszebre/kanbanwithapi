import { axiosInstance } from "./instance";

export const getTask = async (taskId:string) =>{
    try{

        const response = await axiosInstance.get(`http://localhost:4000/tasks/${taskId}`);
        if(response){
            return response.data
            
        }else{
            console.error('Error fetching boards')
        }
    }catch(error){
        console.error(error)
    }
};