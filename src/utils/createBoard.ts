import { Column } from "@/types";
import { axiosInstance } from "./instance";
import { handleSessionExpiration } from "./handleSessionexpiration";
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
                const response = await axiosInstance.post(
                    `/api/boards`,
                    {
                        name:boardName,
                        columns:columnsName
                    });
                    if(response.data){
                        console.log('boards add')
                    }else{
                        console.error("Problem to add the boards")
                        handleSessionExpiration()
                }
    }catch(error){
        handleSessionExpiration()
        console.error('message',error)
    }
}