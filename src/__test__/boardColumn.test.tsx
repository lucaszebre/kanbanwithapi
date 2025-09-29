import BoardColumn from "@/components/board/boardColumn";
import { ThemeProvidered } from "@/state/themecontext";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

describe("BoardColumn Component Tests", () => {
  it("should render with the provided title", () => {
    const title = "Column Title";
    render(
      <ThemeProvidered>
        <BoardColumn
          title={title}
          onChange={() => {}}
          Remove={() => {}}
          error={false}
        />
      </ThemeProvidered>
    );

    const input = screen.getByPlaceholderText(
      "eg Column Name"
    ) as HTMLInputElement; // Cast to HTMLInputElement
    expect(input).toBeInTheDocument();
    expect(input.value).toBe(title);
  });

  it("should call the onChange function when input value changes", () => {
    const onChangeMock = jest.fn();
    render(
      <ThemeProvidered>
        <BoardColumn
          title=""
          onChange={onChangeMock}
          Remove={() => {}}
          error={false}
        />
      </ThemeProvidered>
    );

    const input = screen.getByPlaceholderText("eg Column Name");
    fireEvent.change(input, { target: { value: "New Title" } });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith("New Title");
  });

  it("should call the Remove function when delete icon is clicked", () => {
    const removeMock = jest.fn();
    render(
      <ThemeProvidered>
        <BoardColumn
          title=""
          onChange={() => {}}
          Remove={removeMock}
          error={false}
        />
      </ThemeProvidered>
    );

    const deleteIcon = screen.getByAltText("DeleteTaskIcon");
    fireEvent.click(deleteIcon);

    expect(removeMock).toHaveBeenCalledTimes(1);
  });

  it("should reset input value when resetKey prop is true", () => {
    const { rerender } = render(
      <ThemeProvidered>
        <BoardColumn
          title="Original Title"
          onChange={() => {}}
          Remove={() => {}}
          error={false}
        />
      </ThemeProvidered>
    );

    const input = screen.getByPlaceholderText(
      "eg Column Name"
    ) as HTMLInputElement; // Cast to HTMLInputElement
    expect(input.value).toBe("Original Title");

    rerender(
      <ThemeProvidered>
        <BoardColumn
          title="Original Title"
          onChange={() => {}}
          Remove={() => {}}
          error={false}
          resetKey={true}
        />
      </ThemeProvidered>
    );
    expect(input.value).toBe("");
  });

  it("should display an error message when error prop is true", () => {
    render(
      <ThemeProvidered>
        <BoardColumn
          title=""
          onChange={() => {}}
          Remove={() => {}}
          error={true}
        />
      </ThemeProvidered>
    );

    const errorMessage = screen.getByText("Can not be empty");
    expect(errorMessage).toBeInTheDocument();
  });
});
