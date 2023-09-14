import { Column } from "@/types";
import { axiosInstance } from "./instance";
// function createColumnsArray(columnNames:string[]) {
//     const columnsArray = [];
  
//     for (const columnName of columnNames) {
//       const column = {
//         name: columnName,
//         tasks: []
//       };
//       columnsArray.push(column);
//     }
  
//     return columnsArray;
//   }
export const createBoard = async (boardName:string,columnsName:string[]) =>{
    try{
        const data = await axiosInstance.get(`/auth/profile`);

                // User is authenticated, check if a row exists in the "User" table
                const response = await axiosInstance.post(
                    `http://localhost:4000/users/${data.data.id}/boards`,
                    {
                        name:boardName,
                        columns:columnsName
                    });
                    if(response.data){
                        console.log('boards add')
                    }else{
                        console.error("Problem to add the boards")
                    
                }
    }catch(error){
        console.error('message',error)
    }
}