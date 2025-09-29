import { logout } from "@/api/auth/logout";
import Header from "@/components/layout/header";
import { DataContext } from "@/state/datacontext";
import { ThemeProvidered } from "@/state/themecontext";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

jest.mock("../utils/logout", () => ({
  Logout: jest.fn(),
}));

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

describe("Header component", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it("renders the Header component with board name", async () => {
    render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <Header boards={true} />
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );
    const Board = await screen.findAllByText("Board 1");
    // Check if the component is rendered with the expected board name
    expect(Board).toBeTruthy();
  });

  it("renders the Header component with add task button", async () => {
    render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <Header boards={true} />
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );

    // Check if the "Add New Task" button is rendered
    expect(await screen.findByText("+ Add New Task")).toBeInTheDocument();
  });

  it("renders the Header component without add task button", async () => {
    render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <Header boards={false} />
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );

    // Check if the "Add New Task" button is rendered
    expect(screen.queryByText("+ Add New Task")).toBeNull();
  });

  it("renders the Header component with logout button", async () => {
    render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <Header boards={true} />
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );

    // Check if the "Logout" button is rendered
    expect(await screen.findByText("Logout")).toBeInTheDocument();
  });

  it("when clicking on ellipsis Modal should display", async () => {
    render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <Header boards={true} />
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );

    const ellipsis = await screen.findByAltText("vertical-ellipsis-pc");

    fireEvent.click(ellipsis);

    const ModalDiv = await screen.findAllByText("Edit Board");
    const ModalDiv2 = await screen.findByText("Delete Board");
    // Check if the "Logout" button is rendered
    expect(ModalDiv[1]).toBeVisible();
    expect(ModalDiv2).toBeVisible();
  });

  it("when on button addTask should display modal to addTask", async () => {
    render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <Header boards={true} />
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );

    const addButton = await screen.findByText("+ Add New Task");

    fireEvent.click(addButton);

    const AddDiv = await screen.findByText("Add Task");
    const AddDiv2 = await screen.findByText("Task Title");
    const AddDiv3 = await screen.findByText("Task Description");
    const AddDiv4 = await screen.findByText("Subtasks");

    expect(AddDiv).toBeVisible();
    expect(AddDiv2).toBeVisible();
    expect(AddDiv3).toBeVisible();
    expect(AddDiv4).toBeVisible();
  });

  it("when clicking on button Logout should call the logout function", async () => {
    render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <Header boards={true} />
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );

    const LogoutButton = await screen.findByText("Logout");

    fireEvent.click(LogoutButton);

    expect(logout).toHaveBeenCalled();
  });
});
