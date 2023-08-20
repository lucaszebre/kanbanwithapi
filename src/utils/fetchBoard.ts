import supabase from '@/supabase';
import axios from 'axios';

export const fetchBoards = async () =>{
    try{
        const { data: { user } } = await supabase.auth.getUser()

        const response = await axios.get(`https://kanbantask.onrender.com/user/${user?.id}`);
        if(response){
            return response
        }else{
            console.error('Error fetching boards')
        }
    }catch(error){
        console.error(error)
    }
};
