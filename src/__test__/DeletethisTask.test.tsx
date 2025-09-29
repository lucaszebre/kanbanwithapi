import useDeleteTaskMutation from "@/api/mutations/useDeleteTaskMutation";
import DeleteThisTask from "@/components/delete/DeletethisTask";
import { DataContext } from "@/state/datacontext";
import { ThemeProvidered } from "@/state/themecontext";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

jest.mock("../utils/useDeleteTaskMutation", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock React Query's useMutation and useQuery
jest.mock("react-query", () => ({
  ...jest.requireActual("react-query"),
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

jest.mock("../utils/instance", () => ({
  axiosInstance: {
    delete: jest.fn(),
  },
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

const queryClient = new QueryClient();

describe("DeleteThisTask component", () => {
  beforeEach(() => {
    (useDeleteTaskMutation as jest.Mock).mockReturnValue(jest.fn()); // Mock it to return a Jest mock function
  });

  it("renders the DeleteThisTask component", async () => {
    const TaskTitle = "Task 1";
    const TaskId = "task1";
    const columnId = "column1";

    // Mock the useQuery result
    const mockUseQuery = jest.fn().mockReturnValue({
      data: { boards: [] },
      isLoading: false,
      isError: false,
    });
    require("react-query").useQuery.mockImplementation(mockUseQuery);

    // Render the DeleteThisTask component
    render(
      <ThemeProvidered>
        <QueryClientProvider client={queryClient}>
          <DeleteThisTask
            TaskTitle={TaskTitle}
            TaskId={TaskId}
            columnId={columnId}
          />
        </QueryClientProvider>
      </ThemeProvidered>
    );

    // Check if the component is rendered
    expect(await screen.findByText("Delete this task?")).toBeInTheDocument();
  });

  it('calls useDeleteTaskMutation when "Delete" button is clicked', async () => {
    const TaskTitle = "Task 1";
    const TaskId = "task1";
    const columnId = "column1";

    // Mock the useQuery result
    const mockUseQuery = jest.fn().mockReturnValue({
      data: { boards: [{ id: "board1" }], currentBoardIndex: 0 },
      isLoading: false,
      isError: false,
    });
    require("react-query").useQuery.mockImplementation(mockUseQuery);

    // Mock the useMutation function
    const mockMutation = jest.fn();
    require("../utils/useDeleteTaskMutation").default.mockReturnValue({
      mutate: mockMutation,
    });

    // Render the DeleteThisTask component
    render(
      <ThemeProvidered>
        <QueryClientProvider client={queryClient}>
          <DeleteThisTask
            TaskTitle={TaskTitle}
            TaskId={TaskId}
            columnId={columnId}
          />
        </QueryClientProvider>
      </ThemeProvidered>
    );

    // Find and click the "Delete" button
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    // Wait for the mutation to be called and resolved
    expect(mockMutation).toHaveBeenCalled();
  });

  it('closes the dialog when "Cancel" button is clicked', async () => {
    const TaskTitle = "Task 1";
    const TaskId = "task1";
    const columnId = "column1";

    // Mock the useQuery result
    const mockUseQuery = jest.fn().mockReturnValue({
      data: { boards: [{ id: "ddd" }] },
      isLoading: false,
      isError: false,
    });
    require("react-query").useQuery.mockImplementation(mockUseQuery);

    // Render the DeleteThisTask component
    render(
      <ThemeProvidered>
        <QueryClientProvider client={queryClient}>
          <DataContext.Provider value={mockDataContext}>
            <DeleteThisTask
              TaskTitle={TaskTitle}
              TaskId={TaskId}
              columnId={columnId}
            />
          </DataContext.Provider>
        </QueryClientProvider>
      </ThemeProvidered>
    );

    // Find and click the "Cancel" button
    const cancelButton = (await screen.findByText("Cancel")) as HTMLElement;
    fireEvent.click(cancelButton);

    // Check if the dialog is closed (not in the document)
    expect(screen.queryByText("Delete this task?")).not.toBeVisible();
  });
});
