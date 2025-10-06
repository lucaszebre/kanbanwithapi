import { boardApiServices } from "@/api/board.service";
import { columnApiServices } from "@/api/column.service";
import type { ColumnData } from "@/types";
import type { Column } from "@/types/Zodtype";

export const handleSaveChanges = async (
  columnsToDelete: string[],
  columnsToRename: ColumnData[],
  columnstoAdd: Column[],
  currentBoardId: string,
  Header: string,
  headerTitle: string
) => {
  // Delete columns
  if (columnsToDelete.length > 0) {
    for (const columnId of columnsToDelete) {
      try {
        await columnApiServices.deleteColumn(columnId);
      } catch (error) {
        console.error(`Error deleting column with ID ${columnId}:`, error);
      }
    }
  }

  if (columnsToRename.length > 0) {
    // Update columns
    for (const column of columnsToRename) {
      try {
        await columnApiServices.changeColumnName(column.id, column.name);
      } catch (error) {
        console.log(`Error deleting column with ID ${column.id}:`, error);
      }
    }
  }

  if (columnstoAdd.length > 0) {
    // Add new columns
    // Add new columns
    for (const column of columnstoAdd) {
      try {
        await columnApiServices.addColumn(currentBoardId, column.name);
      } catch (error) {
        console.error("Error to add column",error);
      }
    }
  }

  if (Header !== headerTitle) {
    try {
      await boardApiServices.changeBoardName(currentBoardId, Header);
    } catch (error) {
      console.error("Error to change the baord name ",error);
    }
  }
};
