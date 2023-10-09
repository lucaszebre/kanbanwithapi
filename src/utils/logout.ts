import { axiosInstance } from "./instance";
import Cookies from "js-cookie"; // Assuming you use js-cookie

export const Logout = async () =>{
    try{
        const response  =  await axiosInstance.post('/auth/logout')
        Cookies.remove('key')
        localStorage.removeItem('isLoggedIn')
        window.location.reload
    }catch(error){
        console.error(error)
    }
};