import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TaskCard from '@/components/taskCard';
import { DataContextType } from '@/state/datacontext';
import { Subtask } from '@/types';

// Mock the context and any necessary dependencies
jest.mock('../state/datacontext', () => ({
    DataContext: {
        Consumer: ({ children }: { children: (value: DataContextType) => React.ReactNode }) => children({
            setIsCompleted: jest.fn(),
            openedTask: null,
            currentBoardIndex: 0,
            setCurrentBoardIndex: function (boardId: number): void {
                throw new Error('Function not implemented.');
            },
            Interval: 0,
            setInterval: function (value: React.SetStateAction<number>): void {
                throw new Error('Function not implemented.');
            },
            setOpenedTask: function (value: React.SetStateAction<{ id: string; title: string; description: string; columnId: string; subTask: Subtask[]; } | null>): void {
                throw new Error('Function not implemented.');
            },
            isCompleted: 0,
            isLoggedIn: false,
            setIsLoggedIn: function (value: React.SetStateAction<boolean>): void {
                throw new Error('Function not implemented.');
            }
        }),
        },
    }));

jest.mock('../state/themecontext', () => ({
  useTheme: () => ({ theme: 'light' }), // You can change the theme for testing
}));

jest.mock('../state/contextopen', () => ({
  useStore: () => ({
    setSubTasks: jest.fn(),
  }),
}));

describe('TaskCard Component Tests', () => {
//   it('should render the TaskCard component with title and subtask count', () => {
//     render(
//       <TaskCard
//         index={0}
//         title="Task 1"
//         description="Description 1"
//         id="1"
//         subtask={[
//           { id: 'subtask1', title: 'Subtask 1', isCompleted: true, taskId: "22" },
//           { id: 'subtask2', title: 'Subtask 2', isCompleted: false, taskId: "223" },
//         ]}
//         columnId="column1"
//         onClick={() => { }}
//         columnIndex={0}
//       />
//     );

//     const taskTitle = screen.getByText('Task 1');
//     expect(taskTitle).toBeInTheDocument();

//     const subtaskCount = screen.getByText('1 of 2 substacks'); // Update based on your test data
//     expect(subtaskCount).toBeInTheDocument();
//   });

//   it('should call the onClick function when clicked', () => {
//     const onClickMock = jest.fn();
//     render(
//       <TaskCard
//         index={0}
//         title="Task 1"
//         description="Description 1"
//         id="1"
//         subtask={[]}
//         columnId="column1"
//         onClick={onClickMock}
//         columnIndex={0}
//       />
//     );

//     const taskContainer = screen.getByText('Task 1');
//     fireEvent.click(taskContainer);
//     expect(onClickMock).toHaveBeenCalledTimes(1);
//   });

//   it('should handle the case when no subtasks are provided', () => {
//     render(
//       <TaskCard
//         index={0}
//         title="Task 1"
//         description="Description 1"
//         id="1"
//         subtask={[]}
//         columnId="column1"
//         onClick={() => { }}
//         columnIndex={0}
//       />
//     );

//     const subtaskCount = screen.getByText('0 of 0 substacks');
//     expect(subtaskCount).toBeInTheDocument();
//   });
});

