import { axiosInstance } from "./instance";


export const deleteTask = async (taskId:string) =>{
    try{
        const response = await axiosInstance.delete(`http://localhost:4000/tasks/${taskId}`);
        if(response){
            console.log(response.status)
        }else{
            console.error('Error deleting task')
        }
    }catch(error){

    }
}