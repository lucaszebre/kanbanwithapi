import { ColumnData } from "@/types";
import  {Column} from '@/types/Zodtype'
import { deleteColumn } from "@/utils/deleteColumn";
import { addColumn } from "@/utils/addColumn";
import { changeColumnName } from "@/utils/changeColumnName";
import { changeBoardName } from "@/utils/changeBoardName";

export const handleSaveChanges = async (columnsToDelete:string[],columnsToRename:ColumnData[],columnstoAdd:Column[],currentBoardId:string,Header:string,headerTitle:string) => {
        
    // Delete columns
    if (columnsToDelete.length > 0) {
        for (const columnId of columnsToDelete) {
        try {
            await deleteColumn(columnId);
            console.log(`Column with ID ${columnId} deleted successfully`);
        } catch (error) {
            console.log(`Error deleting column with ID ${columnId}:`, error);
        }
        }
    }

if (columnsToRename.length > 0) {
    // Update columns
    for (const column of columnsToRename) {
        
      try {
        await changeColumnName(column.id,column.name);
    } catch (error) {
        console.log(`Error deleting column with ID ${column.id}:`, error);
    }
    }
    }

if(columnstoAdd.length>0){
    // Add new columns
   // Add new columns
for (const column of columnstoAdd) {
    try {
        await addColumn(currentBoardId,column.name)
    } catch (error) {
        console.log('Error to add column')
    }

}
}

if (Header !== headerTitle) {
    
    try {
        await changeBoardName(currentBoardId,Header)
    } catch (error) {
        console.error('Error to change the baord name ')
    }
        
}

};