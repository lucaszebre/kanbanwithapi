import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ThemeProvidered } from '@/state/themecontext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { DataContext } from '@/state/datacontext';
import { Column } from '@/types';
import EditBoard from '@/components/editBoard/editBoard';
import '@testing-library/jest-dom'
import { fetchBoards } from '@/utils/fetchBoard';
import { handleSaveChanges } from '@/components/editBoard/handleSave';

jest.mock('../utils/fetchBoard');
jest.mock('../components/editBoard/handleSave')
const queryClient = new QueryClient();

const mockColumns: Column[] = [
  { id: '1', name: 'Column 1', tasks: [], add: false },
  { id: '2', name: 'Column 2', tasks: [], add: false },
];

const mockDataContext = {
    currentBoardIndex: 0,
    setCurrentBoardIndex: jest.fn(),
    Interval: 0,
    setInterval: jest.fn(),
    openedTask: null,
    setOpenedTask: jest.fn(),
    isCompleted: 0,
    setIsCompleted: jest.fn(),
    isLoggedIn: false,
    setIsLoggedIn: jest.fn(),
  };



describe('EditBoard component', () => {
    beforeEach(() => {
        // Manually mock the fetchBoards function
        (fetchBoards as jest.Mock).mockImplementation(async () => {
          // Mock the response data here as needed
          return {
            boards: [{ id: 'board1', name: 'Mocked Board', columns: mockColumns }],
          };
        });
      });
  it('renders the component',async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvidered>
          <DataContext.Provider value={mockDataContext}>
            <EditBoard editBoard={true} setEditBoard={() => {}} />
          </DataContext.Provider>
        </ThemeProvidered>
      </QueryClientProvider>
    );

    const editBoardTitle = await screen.findByText('Edit Board');
    expect(editBoardTitle).toBeInTheDocument();
  });

//   it('displays loading skeleton when loading', async () => {
//     render(
//       <QueryClientProvider client={queryClient}>
//         <ThemeProvidered>
//           <DataContext.Provider value={mockDataContext}>
//             <EditBoard editBoard={true} setEditBoard={() => {}} />
//           </DataContext.Provider>
//         </ThemeProvidered>
//       </QueryClientProvider>
//     );

//     const skeletonElements = screen.getAllByRole('status');
//     expect(skeletonElements).toHaveLength(4); // 1 title + 3 columns
//   });

//   it('displays error message when there is an error fetching data', async () => {
//     const mockFetchBoards = jest.fn().mockRejectedValue(new Error('Network Error'));
//     render(
//       <QueryClientProvider client={queryClient}>
//         <ThemeProvidered>
//           <DataContext.Provider value={mockDataContext}>
//             <EditBoard editBoard={true} setEditBoard={() => {}} />
//           </DataContext.Provider>
//         </ThemeProvidered>
//       </QueryClientProvider>
//     );

//     await waitFor(async () => await screen.findByText('Something went wrong'));
//     expect(mockFetchBoards).toHaveBeenCalledTimes(1);
//   });

it('renders the board name and columns', async () => {

        render(
        <QueryClientProvider client={queryClient}>
            <ThemeProvidered>
            <DataContext.Provider value={mockDataContext}>
                <EditBoard editBoard={true} setEditBoard={() => {}} />
            </DataContext.Provider>
            </ThemeProvidered>
        </QueryClientProvider>
        );
        
        // Wait for the elements to appear or change
        await waitFor(() => {
        expect(screen.getByPlaceholderText('Board Name')).toHaveValue('Mocked Board');
        expect(screen.getAllByPlaceholderText('eg Column Name')).toHaveLength(2);
        });
    });

  it('allows editing the board name', async () => {
   

    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvidered>
          <DataContext.Provider value={mockDataContext}>
            <EditBoard editBoard={true} setEditBoard={() => {}} />
          </DataContext.Provider>
        </ThemeProvidered>
      </QueryClientProvider>
    );


    const boardNameInput = await screen.findByPlaceholderText('Board Name');
    fireEvent.change(boardNameInput, { target: { value: 'Updated Board Name' } });

    expect(boardNameInput).toHaveValue('Updated Board Name');
  });

  it('allows adding a new column', async () => {
   

    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvidered>
          <DataContext.Provider value={mockDataContext}>
            <EditBoard editBoard={true} setEditBoard={() => {}} />
          </DataContext.Provider>
        </ThemeProvidered>
      </QueryClientProvider>
    );


    const addButton = await screen.findByText('+ Add Column');
    fireEvent.click(addButton);

    const columnInputs = await screen.findAllByPlaceholderText('eg Column Name');
    expect(columnInputs).toHaveLength(3); // 2 initial + 1 added column
  });

//   it('allows deleting a column', async () => {
   

//     render(
//       <QueryClientProvider client={queryClient}>
//         <ThemeProvidered>
//           <DataContext.Provider value={mockDataContext}>
//             <EditBoard editBoard={true} setEditBoard={() => {}} />
//           </DataContext.Provider>
//         </ThemeProvidered>
//       </QueryClientProvider>
//     );

//     await waitFor(async () => await screen.findByText('Edit Board'));

//     const deleteButtons = screen.findAllByRole('button', { name: /Delete Column/ });
//     fireEvent.click(deleteButtons[0]);

//     const columnInputs = screen.getAllByLabelText('Column Name');
//     expect(columnInputs).toHaveLength(1); // 1 remaining column
//   });

  it('displays error messages for empty board name and columns', async () => {
    

    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvidered>
          <DataContext.Provider value={mockDataContext}>
            <EditBoard editBoard={true} setEditBoard={() => {}} />
          </DataContext.Provider>
        </ThemeProvidered>
      </QueryClientProvider>
    );


    const boardNameInput = await screen.findByPlaceholderText('Board Name');
    const columnInputs = await screen.findAllByPlaceholderText('eg Column Name');

    fireEvent.change(boardNameInput, { target: { value: '' } }); // Empty board name
    fireEvent.change(columnInputs[0], { target: { value: '' } }); // Empty column name
    fireEvent.change(columnInputs[1], { target: { value: '' } }); // Empty column name

    const saveButton = await screen.findByText('Save Changes');
    fireEvent.click(saveButton);

    const errorMessages = screen.getAllByText('Can not be empty');
    expect(errorMessages).toHaveLength(2); // One for board name, one for column
  });
  it('submits the form successfully when valid data is entered', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvidered>
          <DataContext.Provider value={mockDataContext}>
            <EditBoard editBoard={true} setEditBoard={() => {}} />
          </DataContext.Provider>
        </ThemeProvidered>
      </QueryClientProvider>
    );
  
    const boardNameInput = await screen.findByPlaceholderText('Board Name');
    const columnInputs = await screen.findAllByPlaceholderText('eg Column Name');
    const saveButton = await screen.findByText('Save Changes');
  
    // Mocking handleSaveChanges to resolve successfully
    (handleSaveChanges as jest.Mock).mockResolvedValueOnce({});
  
    fireEvent.change(boardNameInput, { target: { value: 'Updated Board Name' } });
    fireEvent.change(columnInputs[0], { target: { value: 'Updated Column 1' } });
    fireEvent.change(columnInputs[1], { target: { value: 'Updated Column 2' } });
  
    await act(async () => {
      fireEvent.click(saveButton);
    });
  
    // Verify that handleSaveChanges is called with the expected arguments
    expect(handleSaveChanges).toHaveBeenCalledWith([], [{"add": false, "id": "1", "name": "Updated Column 1", "tasks": []}, {"add": false, "id": "2", "name": "Updated Column 2", "tasks": 
    []}], [], "board1", "Updated Board Name", "Mocked Board");
  });
});
