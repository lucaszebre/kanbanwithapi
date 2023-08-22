import supabase from "@/supabase";
import axios from "axios";

export const deleteColumn = async (boardId:string,columnId:string) =>{
    try{
        const { data: { user } } = await supabase.auth.getUser()
        const response = await axios.delete(`http://localhost:4000/user/${user?.id}/boards/${boardId}/columns/${columnId}`);
        if(response){
            return response
        }else{
            console.error('Error deleting Column')
        }
    }catch(error){
        console.error("message",'Internal server error')
    }
}