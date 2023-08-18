import axios from "axios";

export const addBoard = async (userId:string) =>{
    try{
        const response = await axios.post(`https://kanbantask.onrender.com/user/${userId}`);
        if(response){
            return response
        }else{
            console.error('Error adding Board')
        }
    }catch(error){

    }
}