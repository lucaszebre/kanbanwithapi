import axios from 'axios';

export const fetchColumns = async (userId:string,boardId:string,columnId:string) =>{
    try{
        const response = await axios.get(`https://kanbantask.onrender.com/user/${userId}/boards/${boardId}/columns/${columnId}`);
        if(response){
            return response
        }else{
            console.error('Error fetching column')
        }
    }catch(error){
        console.error(error)
    }
};