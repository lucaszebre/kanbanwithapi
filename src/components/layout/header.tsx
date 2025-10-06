import { authApiServices } from "@/api/auth.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebarStore } from "@/state/sidebarcontext";
import { useTaskManagerStore } from "@/state/taskManager";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { AddBoard } from "../board/addBoard";
import { EditBoard } from "../board/editBoard";
import { DeleteThisBoard } from "../delete/DeletethisBoard";
// Removed ModalAbout in favor of ReusablePopover inline actions
import ReusablePopover from "../reusable/reusable-popover";
import { AddTask } from "../task/addTask";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("header");
  const { isSidebarMobile, setIsSidebarMobile } = useSidebarStore();
  const [editBoard, setEditBoard] = useState(false);
  const [addTask, setAddTask] = useState(false);
  const [addBoard, setAddBoard] = useState(false);
  const [DeleteBlock, setDeleteBlock] = useState(false);
  const { theme } = useTheme();
  const { boardId } = useParams();
  const taskManager = useTaskManagerStore((state) => state.taskManager);

  const currentBoard = useMemo(() => {
    return (
      taskManager[0].boards.find((board) => board.id === boardId) ??
      taskManager[0].boards[0] ??
      null
    );
  }, [boardId, taskManager]);

  const desktopWrapper = `hidden md:flex border-l-0 flex-row justify-between items-center w-full h-16 px-8 rounded-none`;
  const mobileWrapper = `flex md:hidden flex-row justify-between items-center w-full p-4 bg-white dark:bg-[#2B2C37] z-25`;
  const addTaskButton = `flex items-center justify-center bg-[#635FC7] text-white rounded-full px-5 py-2.5 text-sm font-medium cursor-pointer hover:brightness-110 transition-colors`;
  const logoutButton = `text-white dark:bg-transparent bg-[#2B2C37] dark:text-white border border-white rounded-md px-2.5 py-1.5 text-sm font-medium cursor-pointer ml-2 mr-4 transition-colors hover:bg-white hover:text-[#635FC7]`;
  const mobileAddButton = `flex items-center justify-center bg-[#635FC7] text-white rounded-full px-4 py-2 text-lg font-semibold cursor-pointer`;

  const getInitials = (name?: string) => {
    if (!name) return "";
    const parts = name
      .trim()
      .split(/[\s_-]+/)
      .filter(Boolean);

    if (parts.length === 0) return "";

    const initials =
      parts.length > 1
        ? `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`
        : parts[0].slice(0, 2);

    return initials.toUpperCase();
  };

  return (
    <>
      <DeleteThisBoard
        DeleteBlock={DeleteBlock}
        setDeleteBlock={setDeleteBlock}
      />
      <AddTask addTask={addTask} setAddTask={setAddTask} />
      <EditBoard editBoard={editBoard} setEditBoard={setEditBoard} />
      <AddBoard addBoard={addBoard} setAddBoard={setAddBoard} />

      {/* Desktop */}
      <Card className={desktopWrapper}>
        <div className="flex flex-row items-center h-full w-[350px]">
          <img
            className="w-[152px] h-[26px]"
            src={
              theme === "dark"
                ? "/assets/logo-light.svg"
                : "/assets/logo-dark.svg"
            }
            alt={t("alt.logo")}
            width={152}
            height={26}
          />
        </div>

        <div className="flex flex-row items-center justify-between text-center w-full p-4">
          <h1 className="text-2xl font-bold ">
            {currentBoard ? currentBoard.name : ""}
          </h1>
          <div className="flex flex-row items-center justify-around">
            {currentBoard?.id && (
              <Button
                onClick={() => {
                  setAddTask(true);
                }}
                className={addTaskButton}
              >
                {t("addNewTask")}
              </Button>
            )}
            <Button
              onClick={async () => {
                await authApiServices.logout();
                navigate("/auth");
              }}
              className={logoutButton}
            >
              {t("logout")}
            </Button>
            {currentBoard?.id && (
              <ReusablePopover
                trigger={
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {getInitials(taskManager[0]?.name)}
                    </AvatarFallback>
                  </Avatar>
                }
                align="end"
                side="bottom"
                size="sm"
                contentClassName="p-4"
              >
                <div className="flex flex-col gap-3 w-40">
                  <button
                    type="button"
                    className="text-left text-sm text-gray-500 hover:text-gray-400 dark:text-gray-300 dark:hover:text-gray-200"
                    onClick={() => {
                      setEditBoard(true);
                    }}
                  >
                    {t("editBoard")}
                  </button>
                  <button
                    type="button"
                    className="text-left text-sm text-[#ea5555] hover:text-[#ff8d8d]"
                    onClick={() => {
                      setDeleteBlock(true);
                    }}
                  >
                    {t("deleteBoard")}
                  </button>
                </div>
              </ReusablePopover>
            )}
          </div>
        </div>
      </Card>
      {/* Mobile */}
      <div className={mobileWrapper}>
        <div
          className="flex flex-row items-center justify-center"
          onClick={() => {
            setIsSidebarMobile(!isSidebarMobile);
          }}
        >
          <img
            className="w-6 h-6 mr-2"
            src="/assets/logo-mobile.svg"
            alt={t("alt.mobileLogoKanban")}
            width={24}
            height={24}
          />
          <h1 className="text-xl mr-2 text-black dark:text-white">
            {currentBoard ? currentBoard.name : ""}
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <img
                src="/assets/icon-chevron-down.svg"
                alt={t("alt.chevronDown")}
                width={15}
                height={15}
                className="cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-4 w-56">
              <DropdownMenuLabel className="cursor-pointer">
                {t("allBoards")}({taskManager[0].boards.length})
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {taskManager[0].boards.map(
                (board: { name: string; id: string }) => (
                  <DropdownMenuLabel
                    key={board.id}
                    className="cursor-pointer"
                    onClick={() => {
                      navigate(`/boards/${board.id}`);
                    }}
                  >
                    {board.name}
                  </DropdownMenuLabel>
                )
              )}
              <DropdownMenuSeparator />
              <DropdownMenuLabel
                onClick={() => {
                  setAddBoard(true);
                }}
                className="cursor-pointer"
              >
                {t("addBoard")}
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-row items-center justify-center gap-4">
          {currentBoard?.id && (
            <button
              onClick={() => {
                setAddTask(true);
              }}
              className={mobileAddButton}
            >
              +
            </button>
          )}
          {currentBoard?.id && (
            <ReusablePopover
              trigger={
                <img
                  className="cursor-pointer"
                  src="/assets/icon-vertical-ellipsis.svg"
                  alt={t("alt.verticalEllipsis")}
                  width={8}
                  height={16}
                />
              }
              align="end"
              side="bottom"
              size="sm"
              contentClassName="p-4"
            >
              <div className="flex flex-col gap-3 w-40">
                <button
                  type="button"
                  className="text-left text-sm text-gray-500 hover:text-gray-400 dark:text-gray-300 dark:hover:text-gray-200"
                  onClick={() => {
                    setEditBoard(true);
                  }}
                >
                  {t("editBoard")}
                </button>
                <button
                  type="button"
                  className="text-left text-sm text-[#ea5555] hover:text-[#ff8d8d]"
                  onClick={() => {
                    setDeleteBlock(true);
                  }}
                >
                  {t("deleteBoard")}
                </button>
              </div>
            </ReusablePopover>
          )}
        </div>
      </div>
    </>
  );
};
