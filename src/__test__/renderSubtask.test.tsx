import { ColumnsRenderer } from "@/components/task/rendercolumn";
import { ThemeProvidered } from "@/state/themecontext";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

describe("ColumnsRenderer Component Tests", () => {
  it("should handle an empty columnNames array", () => {
    const columnNames: string[] = [];
    const handleColumnTitleChange = jest.fn();
    const removeColumn = jest.fn();
    const columnErrors: boolean[] = [];

    const { container } = render(
      <ThemeProvidered>
        <ColumnsRenderer
          columnNames={columnNames}
          handleColumnTitleChange={handleColumnTitleChange}
          removeColumn={removeColumn}
          columnErrors={columnErrors}
        />
      </ThemeProvidered>
    );

    // Ensure that no columns are rendered when the array is empty
    const columns = container.querySelectorAll(".BoardColumnDiv");
    expect(columns.length).toBe(0);
  });

  it("should handle an columnNames array", () => {
    const columnNames = ["Column 1", "Column 2"];
    const handleColumnTitleChange = jest.fn();
    const removeColumn = jest.fn();
    const columnErrors: boolean[] = [];

    const { container } = render(
      <ThemeProvidered>
        <ColumnsRenderer
          columnNames={columnNames}
          handleColumnTitleChange={handleColumnTitleChange}
          removeColumn={removeColumn}
          columnErrors={columnErrors}
        />
      </ThemeProvidered>
    );

    // Ensure that no columns are rendered when the array is empty
    const columns = container.querySelectorAll(".BoardColumnDiv");
    expect(columns.length).toBe(2);
  });

  //   it('should handle columnErrors by applying error styling', async () => {
  //     const columnNames = ['Column 1', 'Column 2'];
  //     const handleColumnTitleChange = jest.fn();
  //     const removeColumn = jest.fn();
  //     const columnErrors = [false, true]; // Simulate an error in the second column

  //     const { findByText } = render(
  //         <ThemeProvidered>
  //       <ColumnsRenderer
  //         columnNames={columnNames}
  //         handleColumnTitleChange={handleColumnTitleChange}
  //         removeColumn={removeColumn}
  //         columnErrors={columnErrors}
  //       />
  //       </ThemeProvidered>
  //     );

  //     const column1 = await findByText('Column 1');
  //     const column2 = await findByText('Column 2');

  //     // Ensure that only the second column has error styling
  //     expect(column1).not.toHaveClass('error');
  //     expect(column2).toHaveClass('error');
  //   });
});
