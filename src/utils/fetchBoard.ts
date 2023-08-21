import supabase from '@/supabase';
import axios from 'axios';
import { UserSchema } from '@/types/Zodtype';
export const fetchBoards = async () =>{
    try{
        const { data: { user } } = await supabase.auth.getUser()

        const response = await axios.get(`https://kanbantask.onrender.com/user/${user?.id}`);
        if(response){
            return UserSchema.parse(response.data[0])
        }else{
            console.error('Error fetching boards')
        }
    }catch(error){
        console.error(error)
    }
};
