// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import { QueryClient, QueryClientProvider } from 'react-query';
// import EditTask from '@/components/editTask';
// import { ThemeProvidered } from '@/state/themecontext';
// import '@testing-library/jest-dom'
// import { getTask } from '@/utils/getTask';
// import { DataContext } from '@/state/datacontext';



  

// jest.mock('../utils/getTask', () => ({
//     getTask: jest.fn().mockResolvedValue({
//       task: {
//         id: 'task1',
//         title: 'Task 1',
//         description: 'Description for Task 1',
//         subtasks: [
//           { id: 'subtask1', title: 'Subtask 1', isCompleted: false },
//           { id: 'subtask2', title: 'Subtask 2', isCompleted: true },
//           { id: 'subtask3', title: 'Subtask 3', isCompleted: false },
//         ],
//       }, // Provide the expected task data here
//     }),
//   }))

// const mockDataContext = {
//     currentBoardIndex: 0,
//     setCurrentBoardIndex: jest.fn(),
//     Interval: 0,
//     setInterval: jest.fn(),
//     openedTask: null,
//     setOpenedTask: jest.fn(),
//     isCompleted: 0,
//     setIsCompleted: jest.fn(),
//     isLoggedIn: false,
//     setIsLoggedIn: jest.fn(),
//   };
//   const sampleSubtasks = [
//     { id: 'subtask1', title: 'Subtask 1', isCompleted: false },
//     { id: 'subtask2', title: 'Subtask 2', isCompleted: true },
//     { id: 'subtask3', title: 'Subtask 3', isCompleted: false },
//   ];
// const queryClient = new QueryClient();

// describe('EditTask component', () => {

//         // beforeEach(() => {
//         //     // Manually mock the fetchBoards function
//         //     (getTask as jest.Mock).mockImplementation(async () => {
//         //     // Mock the response data here as needed
//         //     return {
//         //         task: [{ id: 'task1', title: 'Mocked Task',description:'Description for Task 1', subtasks:sampleSubtasks }],
//         //     };
//         //     });
//         // });

// it('show error when all the input are not fill',async ()=>{
//     const useQueryMock = jest.fn().mockReturnValue({
//         task: [{ id: 'task1', title: 'Mocked Task',description:'Description for Task 1', subtasks:sampleSubtasks }], // Simulate no data
//         isLoading: false,
//         isError: false,
//       });
//       jest.mock('react-query', () => ({
//         ...jest.requireActual('react-query'),
//         useQuery: useQueryMock,
//       }));

      
//     render(
//         <ThemeProvidered>
//             <DataContext.Provider value={mockDataContext}>
//                 <QueryClientProvider client={queryClient}>
//                     <EditTask columnId="column1" taskId="task1" index={0} />
//                 </QueryClientProvider>
//             </DataContext.Provider>
//         </ThemeProvidered>
//         );
//         const TaskInput = await screen.findByPlaceholderText("task name")
//         const SubTasksInput = await screen.findAllByPlaceholderText('eg Column Name')
//         const SaveButton = await screen.findByText('Save Changes')
//         fireEvent.change(TaskInput,'')
//         fireEvent.change(SubTasksInput[0],'')
//         fireEvent.click(SaveButton)
//         expect(await screen.findByText('Please enter a Task name.')).toBeInTheDocument()
//         expect(await screen.findByText('Can not be empty')).toBeInTheDocument()
// })

// it('we can fill the form right',()=>{

// })

// it('we can delete subtask',()=>{

// })

// it('we can add subtasks',()=>{

// })

// it('When the editTask submit should call handlesave',()=>{

// })

// it('when we chosse another column the column mutation get called',()=>{

// })

// it('when we dont chosse another column the column mutation  get not called',()=>{
    
// })

// it('when click the outside the components , components should not be visible',()=>{

// })

//     it('renders the EditTask component with initial data', async () => {
//         // Mock the useQuery result with initial data
        

//         render(
//         <ThemeProvidered>
//             <DataContext.Provider value={mockDataContext}>
//                 <QueryClientProvider client={queryClient}>
//                     <EditTask columnId="column1" taskId="task1" index={0} />
//                 </QueryClientProvider>
//             </DataContext.Provider>
//         </ThemeProvidered>
//         );

//         // Check if the component is rendered with the initial data
//         expect(await screen.findByText('Edit Task')).toBeInTheDocument();
//         expect(await screen.findByText('Task name')).toBeInTheDocument();
//         expect(await screen.findByText('Mocked Task')).toBeInTheDocument();
//         expect(await screen.findByText('Description for Task 1')).toBeInTheDocument();
//         expect(screen.findAllByPlaceholderText('eg Column Name')).toHaveLength(0); // Assuming there are no subtasks initially
//         expect(await screen.findByText('Save Changes')).toBeInTheDocument();
//     });

//   it('calls the editTask function when "Save Changes" button is clicked', async () => {
//     // Mock the useQuery result with initial data
//     const useQueryMock = jest.fn().mockReturnValue({
//       data: {
//         title: 'Task 1',
//         description: 'Description for Task 1',
//         subtasks: [],
//       },
//       isLoading: false,
//       isError: false,
//     });
//     jest.mock('react-query', () => ({
//       ...jest.requireActual('react-query'),
//       useQuery: useQueryMock,
//     }));

//     // Mock the editTask function
//     const editTaskMock = jest.fn();
//     jest.mock('../utils/editTask', () => ({
//       editTask: editTaskMock,
//     }));

//     render(
//     <ThemeProvidered>
//         <DataContext.Provider value={mockDataContext}>
//             <QueryClientProvider client={queryClient}>
//                 <EditTask columnId="column1" taskId="task1" index={0} />
//             </QueryClientProvider>
//         </DataContext.Provider>
//     </ThemeProvidered>
//     );

//     // Find and click the "Save Changes" button
//     const saveButton = await screen.findByText('Save Changes');
//     fireEvent.click(saveButton);

//     // Check if the editTask function was called with the expected arguments
//     expect(editTaskMock).toHaveBeenCalledWith({
//       taskId: 'task1',
//       taskName: 'Task 1',
//       taskDescription: 'Description for Task 1',
//       subTasktoAdd: [],
//       subTasktoDelete: [],
//       subTask: [],
//     });
//   });

// });
