import { BoardColumn } from "../board/boardColumn"; // get the board  column components

type ColumnsRendererProps = {
  columnNames: string[];
  handleColumnTitleChange: (index: number, updatedTitle: string) => void;
  removeColumn: (index: number) => void;
  columnErrors: boolean[];
};

export const ColumnsRenderer = ({
  columnNames,
  handleColumnTitleChange,
  removeColumn,
  columnErrors,
}: ColumnsRendererProps) => {
  return (
    <div className="flex flex-col gap-4 py-4 w-full">
      {columnNames.map((text, index) => (
        <BoardColumn
          key={index}
          title={text}
          Remove={() => removeColumn(index)}
          onChange={(updatedTitle: string) =>
            handleColumnTitleChange(index, updatedTitle)
          }
          error={columnErrors[index] || false}
        />
      ))}
    </div>
  );
};
