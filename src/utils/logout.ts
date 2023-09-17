import { axiosInstance } from "./instance";

export const Logout = async () =>{
    try{
        const response  =  await axiosInstance.post('/auth/logout')
        localStorage.removeItem('key')
        localStorage.removeItem('isLoggedIn')
        window.location.reload
    }catch(error){
        console.error(error)
    }
};