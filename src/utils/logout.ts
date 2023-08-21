import supabase from '@/supabase';
import axios from 'axios';
import { useRouter } from 'next/router';

export const Logout = async () =>{
    try{
        let { error } = await supabase.auth.signOut()
       if(error){
        console.error(error)
       }else{
        console.log("sucessfully logout")
       }
    }catch(error){
        console.error(error)
    }
};