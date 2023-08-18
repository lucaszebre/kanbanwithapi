import axios from 'axios';

export const fetchBoards = async (userId:string) =>{
    try{
        const response = await axios.get(`https://kanbantask.onrender.com/user/${userId}`);
        if(response){
            return response
        }else{
            console.error('Error fetching boards')
        }
    }catch(error){
        console.error(error)
    }
};
