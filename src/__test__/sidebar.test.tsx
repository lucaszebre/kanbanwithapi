import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { DataContext } from '@/state/datacontext';
import { ThemeProvidered } from '@/state/themecontext';
import '@testing-library/jest-dom'
import Sidebar from '@/components/sideBar';
import Hide from '@/components/hide';



jest.mock('../utils/fetchBoard', () => ({
  fetchBoards: jest.fn().mockResolvedValue({
    boards: [
      { id: 'board1', name: 'Board 1' },
      { id: 'board2', name: 'Board 2' },
    ],
  }),
}));

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

describe('Sidebar component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it('renders the Sidebar component with all the board name', async () => {
  const {container}=  render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <Sidebar boards={true} />
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );
        // Check if board carts are rendered based on the mocked data
    expect(await screen.findByText('ALL boards(2)')).toBeInTheDocument();
    expect(container.querySelectorAll('.BoardCartText')).toHaveLength(2)
    // Check if the component is rendered with the expected board name
  });

  it('cliking createNewBoard should display the components addBoard', async () => {
    render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <Sidebar boards={true} />
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );

    // Check if the "Add New Task" button is rendered
    const buttonNewBoard = await screen.findByText('+ Create New Board');
    fireEvent.click(buttonNewBoard)
    const NewBoard = await screen.findByText('Add Board')
    expect(NewBoard).toBeVisible();
  });
 

  it('Hide components should be visible after clicking on hide', async () => {
    const {container}=render(
        <ThemeProvidered>
            <DataContext.Provider value={mockDataContext}>
            <QueryClientProvider client={queryClient}>
                <Hide />
                <Sidebar boards={true} />
            </QueryClientProvider>
            </DataContext.Provider>
        </ThemeProvidered>
    );

    const HideDiv = await screen.findByText('Hide Sidebar');
    
    fireEvent.click(HideDiv);

    const sideBar=  container.querySelector('.HideContainer');
    // Check if the "Logout" button is rendered
    expect(sideBar).toBeVisible();
  });
  
 






});
