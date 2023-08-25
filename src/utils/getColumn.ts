import supabase from '@/supabase';
import axios from 'axios';

export const getColumn = async (boardId:string,columnId:string) =>{
    try{
        const { data: { user } } = await supabase.auth.getUser()

        const response = await axios.get(`https://kanbantask.onrender.com/user/${user?.id}/boards/${boardId}/columns/${columnId}`);
        if(response){
            return response.data
            
        }else{
            console.error('Error fetching column')
        }
    }catch(error){
        console.error(error)
    }
};