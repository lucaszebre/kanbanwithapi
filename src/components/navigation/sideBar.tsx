import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTaskManagerStore } from "@/state/taskManager";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { AddBoard } from "../board/addBoard";
import { ThemeToggle } from "../theme-toggle";
import { Card } from "../ui/card";

export const AppSidebar = (props: { boards: boolean }) => {
  const { boardId } = useParams();
  const [addBoard, setAddBoard] = useState(false);
  const taskManager = useTaskManagerStore((state) => state.taskManager);
  const { t, i18n } = useTranslation("sidebar");
  const { state, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const handleBoardClick = (boardId: string) => {
    navigate(`/boards/${boardId}`);
  };

  return (
    <>
      <AddBoard addBoard={addBoard} setAddBoard={setAddBoard} />
      <Card
        className={`fixed bottom-3 z-10 flex gap-0 flex-row items-center  p-2 left-3 cursor-pointer 
          
          ${state === "expanded" ? "hidden" : ""}
          
          `}
      >
        <button className="cursor-pointer">
          <Icon
            onClick={() => toggleSidebar()}
            icon="codicon:layout-sidebar-right-dock"
            height={16}
            width={16}
          />
        </button>
      </Card>
      <Sidebar
        variant="sidebar"
        className="w-[250px] pt-16 flex flex-col h-full border-t-0"
      >
        <SidebarHeader className="flex flex-col items-center gap-2">
          <SidebarMenuButton
            onClick={() => setAddBoard(true)}
            className="w-full justify-start flex items-center cursor-pointer gap-2 text-[#635FC7] hover:bg-white hover:text-[#635FC7] dark:hover:bg-white"
          >
            <img
              src="/assets/icon-board2.svg"
              alt={t("alt.plus")}
              width={16}
              height={16}
            />
            <span>{t("createNewBoard")}</span>
          </SidebarMenuButton>

          <SidebarSeparator />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            {props.boards && (
              <SidebarGroupLabel className="text-[#828FA3] text-[12px] tracking-[2.4px] leading-[15px] font-bold uppercase">
                {t("allBoards")} ({taskManager[0].boards.length})
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <ScrollArea className="h-full w-full">
                <SidebarMenu className="space-y-1">
                  {taskManager[0].boards.map(
                    (board: { name: string; id: string }) => (
                      <SidebarMenuItem key={board.id}>
                        <SidebarMenuButton
                          onClick={() => handleBoardClick(board.id)}
                          isActive={board.id === boardId}
                          className="w-full justify-start cursor-pointer gap-2 hover:bg-[#635FC7] hover:text-white"
                        >
                          <img
                            src="/assets/icon-board.svg"
                            alt={t("alt.board")}
                            width={16}
                            height={16}
                          />
                          <span className="truncate">{board.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  )}
                </SidebarMenu>
              </ScrollArea>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter
          className={`${
            state === "expanded" ? "hidden" : ""
          } p-4 pb-6 flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <button
              className="cursor-pointer p-2 rounded-md hover:bg-muted/60 transition-colors"
              aria-label={t("collapseSidebar", {
                defaultValue: "Collapse sidebar",
              })}
              onClick={() => toggleSidebar()}
            >
              <Icon
                icon="codicon:layout-sidebar-left-dock"
                height={16}
                width={16}
              />
            </button>
            <ThemeToggle />
            <div className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium">
              <button
                type="button"
                aria-label="Switch to English"
                onClick={() => i18n.changeLanguage("EN")}
                className={`px-1 py-0.5 cursor-pointer rounded-sm transition-colors ${
                  i18n.language.toLowerCase().startsWith("en")
                    ? "bg-[#635FC7] text-white"
                    : "hover:bg-muted"
                }`}
              >
                EN
              </button>
              <span className="opacity-40">/</span>
              <button
                type="button"
                aria-label="Basculer en Français"
                onClick={() => i18n.changeLanguage("FR")}
                className={`px-1 py-0.5 cursor-pointer rounded-sm transition-colors ${
                  i18n.language.toLowerCase().startsWith("fr")
                    ? "bg-[#635FC7] text-white"
                    : "hover:bg-muted"
                }`}
              >
                FR
              </button>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};
