import supabase from '@/supabase';
import axios from 'axios';
import { useRouter } from 'next/router';

export const Logout = async () =>{
    try{
        const response = await axios.post(`https://kanbantask.onrender.com/auth/logout`);    
        let { error } = await supabase.auth.signOut()
        
        if(response){
            console.log('Log out sucessfully')
        }else{
            console.error('Error Logout')
        }
    }catch(error){
        console.error(error)
    }
};