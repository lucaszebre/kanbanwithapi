import supabase from "@/supabase";
import axios from "axios";

export const changeBoardName = async (boardId:string,name:string) =>{
    try{
        const { data: { user } } = await supabase.auth.getUser()
        const response = await axios.put(`http://localhost:4000/user/${user?.id}/boards/${boardId}`,{
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