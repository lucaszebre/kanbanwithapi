import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { ThemeProvidered } from '@/state/themecontext';
import '@testing-library/jest-dom'
import 'jest-environment-jsdom'
import AddBoard from '@/components/addBoard';
import { QueryClient, QueryClientProvider } from 'react-query';
import user from '@testing-library/user-event';
let queryClient: QueryClient;


beforeAll(() => {
    queryClient = new QueryClient();
});


afterAll(() => {
  // Clean up queryClient or any other resources as needed
    queryClient.clear();
});

describe('addBoard components - test',()=>{

    it('Input should be contain 2 input at the first render',async ()=>{
        const {findAllByPlaceholderText } = render(
            <QueryClientProvider client={queryClient}>
                <ThemeProvidered>
                    <AddBoard  addBoard={false} setAddBoard={()=>{}}/>
                </ThemeProvidered>
            </QueryClientProvider>)
        const Input = document.getElementsByClassName('.BoardColumnDiv')
        const inputPassword = await findAllByPlaceholderText('eg Column Name')
        expect(inputPassword.length).toBe(2)
        expect(Input).toBeTruthy
    })
    
            it('Input should be empty at the 1st render', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                <ThemeProvidered>
                    <AddBoard addBoard={true} setAddBoard={() => {}} />
                </ThemeProvidered>
                </QueryClientProvider>
            );
        
            await waitFor(() => {
                const columnInputs = screen.getAllByPlaceholderText('eg Column Name');
                expect((columnInputs[0] as HTMLInputElement).value).toBe('');
                expect((columnInputs[1] as HTMLInputElement).value).toBe('');
            });
            });
    
    
    



            it('Form should submit when all inputs are filled and show success message', async () => {
                render(
                  <QueryClientProvider client={queryClient}>
                    <ThemeProvidered>
                      <AddBoard addBoard={true} setAddBoard={() => {}} />
                    </ThemeProvidered>
                  </QueryClientProvider>
                );
            
                // Fill in the board name
                const boardNameInput = screen.getByPlaceholderText('eg Web design');
                user.type(boardNameInput, 'My Board');
            
                // Fill in the column names
                const columnInputs = screen.getAllByPlaceholderText('eg Column Name');
                user.type(columnInputs[0], 'Column 1');
                user.type(columnInputs[1], 'Column 2');
            
                // Submit the form
                const submitButton = screen.getByText('Create Board');
                user.click(submitButton);
            
                // Wait for success message to appear
                await waitFor(() => {
                  const successMessage = screen.getByText('Board created successfully');
                  expect(successMessage).toBeInTheDocument();
                });
              });

        it('should render the AddBoard component when addBoard is true', async () => {
            render(
            <QueryClientProvider client={queryClient}>
                <ThemeProvidered>
                <AddBoard addBoard={true} setAddBoard={() => {}} />
                </ThemeProvidered>
            </QueryClientProvider>
            );
        
            const addBoardBlock = screen.getByText('Add Board');
            expect(addBoardBlock).toBeVisible();
        });
        
        it('should not render the AddBoard component when addBoard is false', async () => {
            render(
            <QueryClientProvider client={queryClient}>
                <ThemeProvidered>
                <AddBoard addBoard={false} setAddBoard={() => {}} />
                </ThemeProvidered>
            </QueryClientProvider>
            );
        
            const addBoardBlock = await screen.findByText('Add Board');
            expect(addBoardBlock).not.toBeVisible();
        });
        
        it('should display an error message if the board name input is empty', async () => {
            render(
            <QueryClientProvider client={queryClient}>
                <ThemeProvidered>
                <AddBoard addBoard={true} setAddBoard={() => {}} />
                </ThemeProvidered>
            </QueryClientProvider>
            );
        
            const createBoardButton = screen.getByText('Create Board');
            fireEvent.click(createBoardButton);
        
            await waitFor(() => {
            const errorMessage = screen.getByText('Please enter a board name.');
            expect(errorMessage).toBeInTheDocument();
            });
        });
    
        it('should add a new column when clicking the "+ Add Column" button', async () => {
            render(
            <QueryClientProvider client={queryClient}>
                <ThemeProvidered>
                <AddBoard addBoard={true} setAddBoard={() => {}} />
                </ThemeProvidered>
            </QueryClientProvider>
            );
        
            const addColumnButton = screen.getByText('+ Add Column');
            fireEvent.click(addColumnButton);
        
            await waitFor(() => {
            const columnInputs = screen.getAllByPlaceholderText('eg Column Name');
            expect(columnInputs.length).toBe(3); // Initial 2 columns + the added one
            });
        });
    
        it('should remove a column when clicking the remove column button', async () => {
            render(
            <QueryClientProvider client={queryClient}>
                <ThemeProvidered>
                <AddBoard addBoard={true} setAddBoard={() => {}} />
                </ThemeProvidered>
            </QueryClientProvider>
            );
        
            const removeColumnButtons = await screen.findAllByRole('img');
            fireEvent.click(removeColumnButtons[0]);
        
            await waitFor(() => {
            const columnInputs = screen.getAllByPlaceholderText('eg Column Name');
            expect(columnInputs.length).toBe(1); // Only one column remains
            });
        });
})