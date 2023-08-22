import supabase from '@/supabase';
import axios from 'axios';

export const toggleSubtaskCompletion = async (isCompleted:boolean,currentBoardId:string,columnId:string,taskId: string, subtaskId?: string) => {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        const response = await axios.put(`http://localhost:4000/user/${user?.id}/boards/${currentBoardId}/columns/${columnId}/tasks/${taskId}/subtask/${subtaskId}`,{
            isCompleted:isCompleted
        });
        if(response){
            return 
        }else{
            console.error('Error fetching boards')
        }
    }catch(error){
        console.error(error)
    }
    

    };