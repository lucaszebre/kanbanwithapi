import supabase from "@/supabase";
import { Column } from "@/types";
import axios from "axios";
function createColumnsArray(columnNames:string[]) {
    const columnsArray = [];
  
    for (const columnName of columnNames) {
      const column = {
        name: columnName,
        tasks: []
      };
      columnsArray.push(column);
    }
  
    return columnsArray;
  }
export const createBoard = async (boardName:string,columnsName:string[]) =>{
    try{
        const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                // User is authenticated, check if a row exists in the "User" table
                const response = await axios.post(
                    `https://kanbantask.onrender.com/user/${user.id}`,
                    {
                        name:boardName,
                        columns:createColumnsArray(columnsName)
                    });
                    if(response.data){
                        console.log('Boards add')
                    }else{
                        console.error("Problem to add the boards")
                    }
                }
    }catch(error){
        console.error('message',error)
    }
}