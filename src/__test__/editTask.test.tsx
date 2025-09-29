import useEditTaskMutation from "@/api/mutations/useEditTaskMutation";
import { getTask } from "@/api/task/getTask";
import EditTask from "@/components/task/editTask";
import { DataContext } from "@/state/datacontext";
import { ThemeProvidered } from "@/state/themecontext";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";

jest.mock("../utils/getTask");
jest.mock("../utils/useEditTaskMutation");
jest.mock("../utils/useChangeColumnMutation");

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
const sampleSubtasks = [
  { id: "subtask1", title: "Subtask 1", isCompleted: false },
  { id: "subtask2", title: "Subtask 2", isCompleted: true },
  { id: "subtask3", title: "Subtask 3", isCompleted: false },
];
const queryClient = new QueryClient();

describe("EditTask component", () => {
  it("show error when all the input are not fill", async () => {
    (getTask as jest.Mock).mockImplementation(async () => {
      // Mock the response data here as needed
      return {
        id: "task1",
        title: "Task 1",
        description: "Description for Task 1",
        subtasks: [
          { id: "subtask1", title: "Subtask 1", isCompleted: false },
          { id: "subtask2", title: "Subtask 2", isCompleted: true },
          { id: "subtask3", title: "Subtask 3", isCompleted: false },
        ],
      };
    });

    render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <EditTask columnId="column1" taskId="task1" index={0} />
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );
    const TaskInput = await screen.findByPlaceholderText("task name");
    const SubTasksInput = await screen.findAllByPlaceholderText(
      "eg Column Name"
    );
    const SaveButton = await screen.findByText("Save Changes");
    await userEvent.clear(TaskInput);
    await userEvent.clear(SubTasksInput[0]);
    await userEvent.click(SaveButton);
    expect(
      await screen.findByText("Please enter a Task name.")
    ).toBeInTheDocument();
    expect(await screen.findByText("Can not be empty")).toBeInTheDocument();
  });

  it("we can fill the form right", async () => {
    (getTask as jest.Mock).mockImplementation(async () => {
      // Mock the response data here as needed
      return {
        id: "task1",
        title: "Task 1",
        description: "Description for Task 1",
        subtasks: [
          { id: "subtask1", title: "Subtask 1", isCompleted: false },
          { id: "subtask2", title: "Subtask 2", isCompleted: true },
          { id: "subtask3", title: "Subtask 3", isCompleted: false },
        ],
      };
    });

    render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <EditTask columnId="column1" taskId="task1" index={0} />
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );
    const TaskInput = (await screen.findByPlaceholderText(
      "task name"
    )) as HTMLInputElement;

    const SubTasksInput = (await screen.findAllByPlaceholderText(
      "eg Column Name"
    )) as HTMLInputElement[];
    await waitFor(async () => {
      await userEvent.clear(SubTasksInput[1]);
      await userEvent.clear(SubTasksInput[2]);
    });
    await userEvent.type(TaskInput, `je mange`);
    await userEvent.type(SubTasksInput[1], "{selectall}hahaha2");
    await userEvent.type(SubTasksInput[2], "{selectall}hahaha3");
    expect(TaskInput.value).toBe("Task 1je mange");
    expect(SubTasksInput[1].value).toBe("hahaha2");
    expect(SubTasksInput[2].value).toBe("hahaha3");
  });

  it("we can delete subtask", async () => {
    (getTask as jest.Mock).mockImplementation(async () => {
      // Mock the response data here as needed
      return {
        id: "task1",
        title: "Task 1",
        description: "Description for Task 1",
        subtasks: [
          { id: "subtask1", title: "Subtask 1", isCompleted: false },
          { id: "subtask2", title: "Subtask 2", isCompleted: true },
          { id: "subtask3", title: "Subtask 3", isCompleted: false },
        ],
      };
    });

    render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <EditTask columnId="column1" taskId="task1" index={0} />
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );

    const DeleteSubtask = (await screen.findAllByAltText(
      "DeleteTaskIcon"
    )) as HTMLInputElement[];
    await userEvent.click(DeleteSubtask[0]);
    const Input = await screen.findAllByPlaceholderText("eg Column Name");
    expect(Input.length).toBe(2);
  });

  it("we can add subtasks", async () => {
    (getTask as jest.Mock).mockImplementation(async () => {
      // Mock the response data here as needed
      return {
        id: "task1",
        title: "Task 1",
        description: "Description for Task 1",
        subtasks: [
          { id: "subtask1", title: "Subtask 1", isCompleted: false },
          { id: "subtask2", title: "Subtask 2", isCompleted: true },
          { id: "subtask3", title: "Subtask 3", isCompleted: false },
        ],
      };
    });

    render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <EditTask columnId="column1" taskId="task1" index={0} />
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );
    const AddButton = await screen.findByText("Add Subtask");
    await userEvent.click(AddButton);
    await userEvent.click(AddButton);
    const Input = await screen.findAllByPlaceholderText("eg Column Name");
    expect(Input.length).toBe(5);
  });

  it("when click the outside the components , components should not be visible", async () => {
    // Mock the useQuery result with initial data
    (getTask as jest.Mock).mockImplementation(async () => {
      // Mock the response data here as needed
      return {
        id: "task1",
        title: "Task 1",
        description: "Description for Task 1",
        subtasks: [
          { id: "subtask1", title: "Subtask 1", isCompleted: false },
          { id: "subtask2", title: "Subtask 2", isCompleted: true },
          { id: "subtask3", title: "Subtask 3", isCompleted: false },
        ],
      };
    });

    const { container } = render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <EditTask columnId="column1" taskId="task1" index={0} />
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );

    const OutsideDiv = container.querySelector(
      ".EditTaskWrapper"
    ) as HTMLInputElement;

    await userEvent.click(OutsideDiv);

    const EditTaskDiv = await screen.findByText("Edit Task");

    expect(EditTaskDiv).not.toBeVisible();
  });

  it("renders the EditTask component with initial data", async () => {
    // Mock the useQuery result with initial data
    (getTask as jest.Mock).mockImplementation(async () => {
      // Mock the response data here as needed
      return {
        id: "task1",
        title: "Task 1",
        description: "Description for Task 1",
        subtasks: [
          { id: "subtask1", title: "Subtask 1", isCompleted: false },
          { id: "subtask2", title: "Subtask 2", isCompleted: true },
          { id: "subtask3", title: "Subtask 3", isCompleted: false },
        ],
      };
    });

    render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <EditTask columnId="column1" taskId="task1" index={0} />
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );

    const TaskNameInput = (await screen.findByPlaceholderText(
      "task name"
    )) as HTMLInputElement;

    // Check if the component is rendered with the initial data
    expect(await screen.findByText("Edit Task")).toBeInTheDocument();
    expect(await screen.findByText("Task name")).toBeInTheDocument();
    expect(TaskNameInput.value).toBe("Task 1");
    expect(
      await screen.findByText("Description for Task 1")
    ).toBeInTheDocument();
    expect(
      await screen.findAllByPlaceholderText("eg Column Name")
    ).toHaveLength(3); // Assuming there are no subtasks initially
    expect(await screen.findByText("Save Changes")).toBeInTheDocument();
  });

  it('calls the editTask function when "Save Changes" button is clicked', async () => {
    // Mock the useQuery result with initial data
    (getTask as jest.Mock).mockImplementation(async () => {
      // Mock the response data here as needed
      return {
        id: "task1",
        title: "Task 1",
        description: "Description for Task 1",
        subtasks: [
          { id: "subtask1", title: "Subtask 1", isCompleted: false },
          { id: "subtask2", title: "Subtask 2", isCompleted: true },
          { id: "subtask3", title: "Subtask 3", isCompleted: false },
        ],
      };
    });

    (useEditTaskMutation as jest.Mock).mockImplementation(async () => {
      // Mock the response data here as needed
    });

    render(
      <ThemeProvidered>
        <DataContext.Provider value={mockDataContext}>
          <QueryClientProvider client={queryClient}>
            <EditTask columnId="column1" taskId="task1" index={0} />
          </QueryClientProvider>
        </DataContext.Provider>
      </ThemeProvidered>
    );

    // Find and click the "Save Changes" button
    const saveButton = await screen.findByText("Save Changes");
    fireEvent.click(saveButton);

    // Check if the editTask function was called with the expected arguments
    expect(useEditTaskMutation).toHaveBeenCalled();
  });
});
