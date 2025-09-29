import React from "react";
import BoardColumn from "../board/boardColumn";

interface SubTaskProps {
  subTasks: string[];
  handleSubTaskDelete: (index: number) => void;
  handleColumnTitleChange: (index: number, updatedTitle: string) => void;
  columnErrors: boolean[];
}

const SubTask: React.FC<SubTaskProps> = ({
  subTasks,
  handleSubTaskDelete,
  handleColumnTitleChange,
  columnErrors,
}) => {
  return (
    <>
      {subTasks.map((text: string, index: number) => (
        <BoardColumn
          key={index}
          title={text}
          Remove={() => handleSubTaskDelete(index)}
          onChange={(updatedTitle: string) =>
            handleColumnTitleChange(index, updatedTitle)
          }
          error={columnErrors[index] || false}
        />
      ))}
    </>
  );
};

export default SubTask;
