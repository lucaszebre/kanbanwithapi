import useDeleteBoardMutation from "@/api/mutations/useDeleteBoardMutation";
import DeleteThisBoard from "@/components/delete/DeletethisBoard";
import { ThemeProvidered } from "@/state/themecontext";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

jest.mock("../utils/useDeleteBoardMutation", () => ({
  __esModule: true,
  default: jest.fn(),
}));
// Mock the modules and functions that are used in the component
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

const queryClient = new QueryClient();

describe("DeleteThisBoard component", () => {
  beforeEach(() => {
    (useDeleteBoardMutation as jest.Mock).mockReturnValue(jest.fn()); // Mock it to return a Jest mock function
  });
  it("renders loading skeleton when loading", () => {
    // Mock isLoading to true
    const mockUseQuery = jest.fn().mockReturnValue({ isLoading: true });
    require("react-query").useQuery.mockImplementation(mockUseQuery);

    const { container } = render(
      <ThemeProvidered>
        <QueryClientProvider client={queryClient}>
          <DeleteThisBoard DeleteBlock={true} setDeleteBlock={() => {}} />
        </QueryClientProvider>
      </ThemeProvidered>
    );

    // Check if loading skeleton is displayed
    expect(
      container.querySelector(".DeleteThisBoardTitle")
    ).not.toBeInTheDocument();
  });

  it("renders error message when there is an error", () => {
    // Mock isError to true
    const mockUseQuery = jest.fn().mockReturnValue({ isError: true });
    require("react-query").useQuery.mockImplementation(mockUseQuery);

    const { container } = render(
      <ThemeProvidered>
        <QueryClientProvider client={queryClient}>
          <DeleteThisBoard DeleteBlock={true} setDeleteBlock={() => {}} />
        </QueryClientProvider>
      </ThemeProvidered>
    );

    // Check if error message is displayed
    expect(container.textContent).toContain("Something went wrong");
  });

  it("renders the confirmation dialog when not loading and no error", () => {
    // Mock data to simulate a successful query
    const mockUseQuery = jest.fn().mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        boards: [
          {
            id: "board1",
            name: "Board 1",
          },
        ],
      },
    });
    require("react-query").useQuery.mockImplementation(mockUseQuery);

    const setDeleteBlock = jest.fn();

    render(
      <ThemeProvidered>
        <QueryClientProvider client={queryClient}>
          <DeleteThisBoard DeleteBlock={true} setDeleteBlock={setDeleteBlock} />
        </QueryClientProvider>
      </ThemeProvidered>
    );

    // Check if confirmation dialog is displayed
    expect(screen.getByText("Delete this board?")).toBeInTheDocument();
  });

  it('calls useDeleteBoardMutation function when "Delete" button is clicked', async () => {
    // Mock data to simulate a successful query
    const mockUseQuery = jest.fn().mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        boards: [
          {
            id: "board1",
            name: "Board 1",
          },
        ],
      },
    });
    require("react-query").useQuery.mockImplementation(mockUseQuery);

    const setDeleteBlock = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvidered>
          <DeleteThisBoard DeleteBlock={true} setDeleteBlock={setDeleteBlock} />
        </ThemeProvidered>
      </QueryClientProvider>
    );

    // Find and click the "Delete" button
    const deleteButton = await screen.getByText("Delete"); // Make sure to use `await` to wait for the element
    fireEvent.click(deleteButton);

    expect(setDeleteBlock).toHaveBeenCalledWith(false);

    // Wait for the delete function to be called and resolved
    await waitFor(() => {
      expect(useDeleteBoardMutation).toHaveBeenCalled();
    });
  });

  it('closes the dialog when "Cancel" button is clicked', () => {
    // Mock data to simulate a successful query
    const mockUseQuery = jest.fn().mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        boards: [
          {
            id: "board1",
            name: "Board 1",
          },
        ],
      },
    });
    require("react-query").useQuery.mockImplementation(mockUseQuery);

    const setDeleteBlock = jest.fn();

    render(
      <ThemeProvidered>
        <QueryClientProvider client={queryClient}>
          <DeleteThisBoard DeleteBlock={true} setDeleteBlock={setDeleteBlock} />
        </QueryClientProvider>
      </ThemeProvidered>
    );

    // Find and click the "Cancel" button
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    // Check if setDeleteBlock was called to close the dialog
    expect(setDeleteBlock).toHaveBeenCalledWith(false);
  });
});
