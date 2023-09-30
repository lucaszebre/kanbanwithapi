import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TaskCard from '@/components/taskCard';
import { ThemeProvidered } from '@/state/themecontext';
import '@testing-library/jest-dom'


describe('TaskCard Component Tests', () => {
  it('should render the TaskCard component with title and subtask count', () => {
    render(
        <ThemeProvidered >
      <TaskCard
        index={0}
        title="Task 1"
        description="Description 1"
        id="1"
        subtask={[
          { id: 'subtask1', title: 'Subtask 1', isCompleted: true, taskId: "22" },
          { id: 'subtask2', title: 'Subtask 2', isCompleted: false, taskId: "223" },
        ]}
        columnId="column1"
        onClick={() => { }}
        columnIndex={0}
      />
      </ThemeProvidered>
    );

    const taskTitle = screen.getByText('Task 1');
    expect(taskTitle).toBeInTheDocument();

    const subtaskCount = screen.getByText('1 of 2 substacks'); // Update based on your test data
    expect(subtaskCount).toBeInTheDocument();
  });

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

