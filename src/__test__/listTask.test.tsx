import ModalAboutTask from "@/components/modal/modalAboutTask";
import ListTask from "@/components/task/listTask";
import { DataContext } from "@/state/datacontext";
import { ThemeProvidered } from "@/state/themecontext";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { DragDropContext } from "react-beautiful-dnd";
import { QueryClient, QueryClientProvider } from "react-query";

jest.mock("../utils/fetchBoard", () => ({
  fetchBoards: jest.fn().mockResolvedValue({
    boards: [
      { id: "board1", name: "Board 1" },
      { id: "board2", name: "Board 2" },
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

describe("Sidebar component", () => {
  const mockTasks = [
    {
      id: "task1",
      title: "Task 1",
      description: "Description 1",
      subtasks: [],
    },
    {
      id: "task2",
      title: "Task 2",
      description: "Description 2",
      subtasks: [],
    },
  ];

  const mockTitle = "Test Column";
  const mockColumnId = "column1";
  const mockColumnIndex = 0;

  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it("renders the Listask component with all the task card", async () => {
    render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <DragDropContext onDragEnd={() => {}}>
              <ListTask
                tasks={mockTasks}
                title={mockTitle}
                columnId={mockColumnId}
                columnIndex={mockColumnIndex}
                NbList={0}
              />
            </DragDropContext>
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );

    const task1 = await screen.findByText("Task 1");
    const columnTitle = await screen.findByText(`Test Column(2)`);
    const task2 = await screen.findByText("Task 2");
    // Check if board carts are rendered based on the mocked data
    expect(task1).toBeInTheDocument();
    expect(task2).toBeInTheDocument();
    expect(columnTitle).toBeInTheDocument();
    // Check if the component is rendered with the expected board name
  });

  //   it('cliking createNewBoard should display the components addBoard', async () => {
  //     render(
  //         <ThemeProvidered>
  //             <DataContext.Provider value={mockDataContext}>
  //             <QueryClientProvider client={queryClient}>
  //             <DragDropContext onDragEnd={()=>{}}>
  //                     <ListTask
  //                         tasks={mockTasks}
  //                         title={mockTitle}
  //                         columnId={mockColumnId}
  //                         columnIndex={mockColumnIndex}
  //                         NbList={0}
  //                         />
  //                     </DragDropContext>
  //             </QueryClientProvider>
  //             </DataContext.Provider>
  //         </ThemeProvidered>
  //     );

  //     // Check if the "Add New Task" button is rendered
  //     const buttonNewBoard = await screen.findByText('+ Create New Board');
  //     fireEvent.click(buttonNewBoard)
  //     const NewBoard = await screen.findByText('Add Board')
  //     expect(NewBoard).toBeVisible();
  //   });
  it("handles rendering a long list of tasks", () => {
    const longListOfTasks = Array.from({ length: 100 }, (_, index) => ({
      id: `task${index + 1}`,
      title: `Task ${index + 1}`,
      description: `Description ${index + 1}`,
      subtasks: [],
    }));

    const { container } = render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <DragDropContext onDragEnd={() => {}}>
              <ListTask
                tasks={longListOfTasks}
                title={mockTitle}
                columnId={mockColumnId}
                columnIndex={mockColumnIndex}
                NbList={0}
              />
            </DragDropContext>
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );

    // Assertion 1: Check if the correct number of tasks are rendered
    const tasks = container.querySelectorAll(".TaskCardContainer"); // Assuming you have a test ID on your task card components
    expect(tasks).toHaveLength(longListOfTasks.length);
  });

  it("clicking on a task should display modalAboutTask", async () => {
    const { container } = render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <ModalAboutTask visible={true} />
            <DragDropContext onDragEnd={() => {}}>
              <ListTask
                tasks={mockTasks}
                title={mockTitle}
                columnId={mockColumnId}
                columnIndex={mockColumnIndex}
                NbList={0}
              />
            </DragDropContext>
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );

    const task1 = await screen.findByText("Task 1");

    fireEvent.click(task1);

    expect(container.querySelector(".EditModalAbout")).toBeVisible();
  });

  it("renders correctly when the task list is empty", () => {
    const { container } = render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <DragDropContext onDragEnd={() => {}}>
              <ListTask
                tasks={[]}
                title={mockTitle}
                columnId={mockColumnId}
                columnIndex={mockColumnIndex}
                NbList={0}
              />
            </DragDropContext>
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );

    const noTasksMessage = container.querySelector(".TaskCardTitle");
    expect(noTasksMessage).toBeFalsy();
  });
});
