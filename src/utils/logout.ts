import axios from 'axios';
import { useRouter } from 'next/router';

export const Logout = async () =>{
    try{
        const response = await axios.post(`https://kanbantask.onrender.com/auth/logout`);
        if(response){
            console.log('Log out sucessfully')
        }else{
            console.error('Error Logout')
        }
    }catch(error){
        console.error(error)
    }
};