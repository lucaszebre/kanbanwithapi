
import { handleSaveChanges } from "@/components/editBoard/handleSave";
import { ColumnData } from "@/types";
import  {Column} from '@/types/Zodtype'
import { addColumn } from "@/utils/addColumn";
import { changeBoardName } from "@/utils/changeBoardName";
import { changeColumnName } from "@/utils/changeColumnName";
import { deleteColumn } from "@/utils/deleteColumn"
import '@testing-library/jest-dom'
const sampleData = [
  {
    id: 'board1',
    name: 'Board 1',
    tasks: [
      {
        id: 'task1',
        status: 'Todo',
        title: 'Task 1',
        description: 'Description for Task 1',
        subtasks: [
          {
            id: 'subtask1',
            title: 'Subtask 1',
            isCompleted: false,
          },
          {
            id: 'subtask2',
            title: 'Subtask 2',
            isCompleted: true,
          },
        ],
      },
      {
        id: 'task2',
        status: 'In Progress',
        title: 'Task 2',
        description: 'Description for Task 2',
        subtasks: [],
      },
    ],
  },
  {
    id: 'board2',
    name: 'Board 2',
    tasks: [],
  },
];
jest.mock('../utils/addColumn')
jest.mock('../utils/changeBoardName')
jest.mock('../utils/changeColumnName')
jest.mock('../utils/deleteColumn')
describe('handleSaveChanges Function Tests', () => {
    it('should delete columns when columnsToDelete is not empty', async () => {
      const columnsToDelete = ['columnId1', 'columnId2'];
      const columnsToRename: ColumnData[] = [];
      const columnstoAdd: { name: string; tasks: { status: string; title: string; description: string; subtasks: { title: string; isCompleted: boolean; id: string; }[]; id: string; }[]; id: string; }[] = [];
      const currentBoardId = 'boardId';
      const Header = 'New Header';
      const headerTitle = 'Old Header';
  
      const deleteColumnMock = deleteColumn as jest.Mock;
      deleteColumnMock.mockResolvedValue({ data: null });
  
      await handleSaveChanges(
        columnsToDelete,
        columnsToRename,
        columnstoAdd,
        currentBoardId,
        Header,
        headerTitle
      );
  
      expect(deleteColumnMock).toHaveBeenCalledTimes(2);
    });
  
    it('should rename columns when columnsToRename is not empty', async () => {
      const columnsToDelete: string[] = [];
      const columnsToRename = [
        { id: 'columnId1', name: 'New Column 1' },
        { id: 'columnId2', name: 'New Column 2' },
      ];
      const columnstoAdd: { name: string; tasks: { status: string; title: string; description: string; subtasks: { title: string; isCompleted: boolean; id: string; }[]; id: string; }[]; id: string; }[] = [];
      const currentBoardId = 'boardId';
      const Header = 'New Header';
      const headerTitle = 'Old Header';
  
      const changeColumnNameMock = changeColumnName as jest.Mock;
      changeColumnNameMock.mockResolvedValue({ data: null });
  
      await handleSaveChanges(
        columnsToDelete,
        columnsToRename,
        columnstoAdd,
        currentBoardId,
        Header,
        headerTitle
      );
  
      expect(changeColumnNameMock).toHaveBeenCalledTimes(2);
    });
  
    it('should add new columns when columnstoAdd is not empty', async () => {
      const columnsToDelete: string[] = [];
      const columnsToRename: ColumnData[] = [];
      const columnstoAdd: { name: string; tasks: { status: string; title: string; description: string; subtasks: { title: string; isCompleted: boolean; id: string; }[]; id: string; }[]; id: string; }[] = sampleData
      const currentBoardId = 'boardId';
      const Header = 'New Header';
      const headerTitle = 'Old Header';
  
      const addColumnMock = addColumn as jest.Mock;
      addColumnMock.mockResolvedValue({ data: null });
  
      await handleSaveChanges(
        columnsToDelete,
        columnsToRename,
        columnstoAdd,
        currentBoardId,
        Header,
        headerTitle
      );
  
      expect(addColumnMock).toHaveBeenCalledTimes(2);
    });
  
    it('should change the board name when Header is different from headerTitle', async () => {
      const columnsToDelete: string[] = [];
      const columnsToRename: ColumnData[] = [];
      const columnstoAdd: { name: string; tasks: { status: string; title: string; description: string; subtasks: { title: string; isCompleted: boolean; id: string; }[]; id: string; }[]; id: string; }[] = [];
      const currentBoardId = 'boardId';
      const Header = 'New Header';
      const headerTitle = 'Old Header';
  
      const changeBoardNameMock = changeBoardName as jest.Mock;
      changeBoardNameMock.mockResolvedValue({ data: null });
  
      await handleSaveChanges(
        columnsToDelete,
        columnsToRename,
        columnstoAdd,
        currentBoardId,
        Header,
        headerTitle
      );
  
      expect(changeBoardNameMock).toHaveBeenCalled();
    });
  
    // Add more test cases for edge cases and additional scenarios
  });
  