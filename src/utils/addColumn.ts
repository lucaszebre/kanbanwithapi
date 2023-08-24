import supabase from "@/supabase";
import axios from "axios";
export const addColumn = async (boardId:string,name:string) =>{
    try{
        const { data: { user } } = await supabase.auth.getUser()
        const response = await axios.post(`https://kanbantask.onrender.com/user/${user?.id}/boards/${boardId}`,{
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