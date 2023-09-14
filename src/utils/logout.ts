import { axiosInstance } from "./instance";
import { useRouter } from 'next/router';

export const Logout = async () =>{
    try{
        const response  =  await axiosInstance.post('http://localhost:3000/auth/logout')
    }catch(error){
        console.error(error)
    }
};