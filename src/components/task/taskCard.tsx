import { useStore } from "@/state/contextopen";
import type { TaskType } from "@/types";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalTask } from "../modal/modalTask";
import { Card } from "../ui/card";

export const TaskCard = ({
  task,
  onClick,
}: {
  task: TaskType;
  onClick: () => void;
}) => {
  const { theme } = useTheme();
  const { setCompleted } = useStore();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("task");
  function Iscompleted() {
    let i = 0;
    if (task.subtasks) {
      for (const sub of task.subtasks) {
        if (sub.isCompleted) i++;
      }
    }
    return i;
  }

  useEffect(() => {
    setCompleted(Iscompleted());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerBase =
    "cursor-pointer rounded-lg px-4 py-2 w-[280px] text-left mb-4 shadow-sm hover:shadow-md transition-shadow";
  const themeStyles =
    theme === "light"
      ? "bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.2)]"
      : "bg-[#2B2C37] shadow-[0_0_10px_0_rgba(0,0,0,0.2)]";
  const titleClasses =
    "text-lg font-semibold mb-4 hover:text-[#3F51B5] transition-colors " +
    (theme === "light" ? "text-black" : "text-white");
  const subTextClasses = "text-gray-500 text-sm font-semibold mb-4";

  return (
    <>
      <ModalTask task={task} open={open} setOpen={setOpen} />

      <Card
        className={`${containerBase} ${themeStyles}`}
        onClick={() => {
          setOpen(true);
          onClick();
        }}
      >
        <h1 className={titleClasses}>{task.title}</h1>
        <p className={subTextClasses}>
          {t("card.progress", {
            completed: Iscompleted(),
            total: task.subtasks.length,
          })}
        </p>
      </Card>
    </>
  );
};
