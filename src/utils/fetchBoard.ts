import supabase from '@/supabase';
import axios from 'axios';
import { UserSchema } from '@/types/Zodtype';
export const fetchBoards = async () =>{
    try{
        const { data: { user } } = await supabase.auth.getUser()

        const response = await axios.get(`http://localhost:4000/user/${user?.id}`);
        if(response){
            console.log(response.data[0])
            return response.data[0]; // Return the data without type assertion
        }else{
            console.error('Error fetching boards')
        }
    }catch(error){
        console.error(error)
    }
};
