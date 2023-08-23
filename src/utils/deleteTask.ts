import supabase from "@/supabase";
import axios from "axios";
supabase
export const deleteTask = async (boardId:string,columnId:string,taskId:string) =>{
    try{
        const { data: { user } } = await supabase.auth.getUser()
        const response = await axios.delete(`http://localhost:4000/user/${user?.id}/boards/${boardId}/columns/${columnId}/tasks/${taskId}`);
        if(response){
            console.log(response.status)
        }else{
            console.error('Error deleting task')
        }
    }catch(error){

    }
}