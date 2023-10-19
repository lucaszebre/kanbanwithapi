import Cookies from "js-cookie"; // Assuming you use js-cookie

export const Logout = async () =>{
    try{
        Cookies.remove('key')
    }catch(error){
        console.error(error)
    }
};