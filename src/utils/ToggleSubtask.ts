import { axiosInstance } from "./instance";

export const toggleSubtaskCompletion = async (isCompleted:boolean, subtaskId: string) => {
    try {

        const response = await axiosInstance.put(`hhttp://localhost:4000/subtask/${subtaskId}`,
        {
            "isCompleted": isCompleted
        });
        if(response){
            return 
        }else{
            console.error('Error fetching boards')
        }
    }catch(error){
        console.error(error)
    }
    

    };