import { authApiServices } from "@/api/auth.service";
import { boardApiServices } from "@/api/board.service";
import { useTaskManagerStore } from "@/state/taskManager";
import { getInitials } from "@/utils/getInitialName";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { AddBoard } from "../board/addBoard";
import { EditBoard } from "../board/editBoard";
import { DeleteThisBoard } from "../delete/DeletethisBoard";
import { EditableText } from "../reusable/EditableText";
import ReusablePopover from "../reusable/reusable-popover";
import { AddTask } from "../task/addTask";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useSidebar } from "../ui/sidebar";

export const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("header");
  const { isMobile, setOpenMobile } = useSidebar();
  const { theme } = useTheme();
  const { boardId } = useParams();
  const taskManager = useTaskManagerStore((state) => state.taskManager);
  const updateBoard = useTaskManagerStore((state) => state.updateBoard);
  const queryClient = useQueryClient();

  const { mutate: updateBoardName } = useMutation({
    mutationFn: boardApiServices.updateBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  const currentBoard = useMemo(() => {
    return (
      taskManager?.boards?.find((board) => board.id === boardId) ??
      taskManager?.boards?.[0] ??
      null
    );
  }, [boardId, taskManager]);

  const handleNameUpdate = async (newName: string) => {
    if (currentBoard) {
      updateBoard({ ...currentBoard, name: newName });
      updateBoardName({
        id: currentBoard.id,
        name: newName,
      });
    }
  };

  const desktopWrapper = `hidden md:flex border-l-0 flex-row justify-between items-center w-full h-16 px-8 rounded-none`;
  const mobileWrapper = `flex md:hidden flex-row justify-between items-center w-full p-4`;
  const addTaskButton = `flex items-center justify-center bg-[#635FC7] text-white rounded-full px-5 py-2.5 text-sm font-medium cursor-pointer hover:brightness-110 transition-colors`;
  const logoutButton = `text-white dark:bg-transparent bg-[#2B2C37] dark:text-white border border-white rounded-md px-2.5 py-1.5 text-sm font-medium cursor-pointer ml-2 mr-4 transition-colors hover:bg-white hover:text-[#635FC7]`;
  const mobileAddButton = `flex items-center justify-center bg-[#635FC7] text-white rounded-full px-4 py-2 text-lg font-semibold cursor-pointer`;

  return (
    <>
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
          <div className="flex flex-row gap-4 ">
            <EditableText
              initialValue={currentBoard ? currentBoard.name : ""}
              onSave={handleNameUpdate}
              textClassName="text-2xl font-bold cursor-pointer"
              inputClassName="text-2xl font-bold bg-transparent border-b-2 border-gray-400 focus:outline-none"
            />

            {currentBoard?.id && (
              <EditBoard board={currentBoard}>
                <Button variant={"outline"}>
                  <Icon icon={"pixel:edit-solid"} height={16} width={16} />
                </Button>
              </EditBoard>
            )}
          </div>

          <div className="flex flex-row items-center justify-around">
            {currentBoard?.id && (
              <div className="flex gap-4 items-center">
                {currentBoard.columns?.length > 0 && (
                  <AddTask>
                    <Button className={addTaskButton}>{t("addNewTask")}</Button>
                  </AddTask>
                )}
                <DeleteThisBoard>
                  <Button className="cursor-pointer" variant={"outline"}>
                    <Icon width={16} height={16} icon="mdi:trash-outline" />
                  </Button>
                </DeleteThisBoard>
              </div>
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
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>
                  {getInitials(taskManager?.name)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </Card>
      {/* Mobile */}
      <div className={mobileWrapper}>
        <div
          className="flex flex-row items-center justify-center"
          onClick={() => {
            setOpenMobile(!isMobile);
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
                {t("allBoards")}({taskManager?.boards?.length})
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {taskManager?.boards.map(
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
              <AddBoard>
                <Button variant={"ghost"}>
                  <DropdownMenuLabel className="cursor-pointer">
                    {t("addBoard")}
                  </DropdownMenuLabel>
                </Button>
              </AddBoard>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-row items-center justify-center gap-4">
          {currentBoard?.id && (
            <AddTask>
              <button className={mobileAddButton}>+</button>
            </AddTask>
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
                <EditBoard board={currentBoard}>
                  <button
                    type="button"
                    className="text-left text-sm text-gray-500 hover:text-gray-400 dark:text-gray-300 dark:hover:text-gray-200"
                  >
                    {t("editBoard")}
                  </button>
                </EditBoard>
                <DeleteThisBoard>
                  <button
                    type="button"
                    className="text-left text-sm text-[#ea5555] hover:text-[#ff8d8d]"
                  >
                    {t("deleteBoard")}
                  </button>
                </DeleteThisBoard>
              </div>
            </ReusablePopover>
          )}
        </div>
      </div>
    </>
  );
};
