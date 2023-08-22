import supabase from '@/supabase';
import { TaskSchema } from '@/types/Zodtype';
import axios from 'axios';

export const getTask = async (boardId:string,columnId:string,taskId:string) =>{
    try{
        const { data: { user } } = await supabase.auth.getUser()

        const response = await axios.get(`http://localhost:4000/user/${user?.id}/boards/${boardId}/columns/${columnId}/tasks/${taskId}`);
        if(response){
            return response.data
            
        }else{
            console.error('Error fetching boards')
        }
    }catch(error){
        console.error(error)
    }
};