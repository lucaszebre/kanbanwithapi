import supabase from '@/supabase';
import axios from 'axios';

export const toggleSubtaskCompletion = async (isCompleted:boolean,currentBoardId:string,columnId:string,taskId: string, subtaskId: string) => {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        console.log('subtaskId',subtaskId)
        console.log(isCompleted)
        console.log('path',`https://kanbantask.onrender.com/user/${user?.id}/boards/${currentBoardId}/columns/${columnId}/tasks/${taskId}/subtask/${subtaskId}`)
        const response = await axios.put(`https://kanbantask.onrender.com/user/${user?.id}/boards/${currentBoardId}/columns/${columnId}/tasks/${taskId}/subtask/${subtaskId}`,
        {
            "isCompleted": isCompleted
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