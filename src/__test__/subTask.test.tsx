import { Subtasks } from "@/components/task/subTask";
import { ThemeProvidered } from "@/state/themecontext";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
let queryClient: QueryClient;

beforeAll(() => {
  queryClient = new QueryClient();
});

afterAll(() => {
  // Clean up queryClient or any other resources as needed
  queryClient.clear();
});

describe("TaskCard Component Tests", () => {
  it("should render the TaskCard component with title and subtask count", () => {
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvidered>
          <Subtasks
            title="eeeee"
            checked={false}
            subtaskId="23444"
            taskId={""}
            columnId={""}
            boardId={""}
          />
        </ThemeProvidered>
      </QueryClientProvider>
    );

    const subTaskTitle = getByText("eeeee");
    expect(subTaskTitle).toBeInTheDocument();
  });

  it("should have the expected style when selected prop is true", () => {
    const { container, rerender } = render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvidered>
          <Subtasks
            title="eeeee"
            checked={false}
            subtaskId="23444"
            taskId={""}
            columnId={""}
            boardId={""}
          />
        </ThemeProvidered>
      </QueryClientProvider>
    );

    const subTaskContainer = container.firstChild as HTMLElement;
    expect(subTaskContainer).toHaveStyle({
      height: "auto", // Add your expected style properties here
    });

    rerender(
      <QueryClientProvider client={queryClient}>
        <ThemeProvidered>
          <Subtasks
            title="eeeee"
            checked={true}
            subtaskId="23444"
            taskId={""}
            columnId={""}
            boardId={""}
          />
        </ThemeProvidered>
      </QueryClientProvider>
    );

    expect(subTaskContainer).toHaveStyle({
      height: "40px", // Add your expected style properties here
    });
  });
});
