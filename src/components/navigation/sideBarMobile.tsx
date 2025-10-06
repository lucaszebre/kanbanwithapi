import { boardApiServices } from "@/api/board.service";
import { useStore } from "@/state/contextopen";
import { DataContext } from "@/state/datacontext";
import { useSidebarStore } from "@/state/sidebarcontext";
import { getInitialWindowWidth } from "@/utils/GetInitialWidth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { BoardCart } from "../board/boardCart";
import { ThemeToggle } from "../theme-toggle";

export const Sidebar = (props: { boards: boolean }) => {
  const { isSidebarMobile, setIsSidebarMobile } = useSidebarStore();
  const { setIsLoggedIn } = useContext(DataContext);
  const [windowWidth, setWindowWidth] = useState(getInitialWindowWidth());
  const { currentBoardIndex, setCurrentBoardIndex } = useStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (windowWidth > 767) setIsSidebarMobile(false);
  }, [windowWidth, setIsSidebarMobile]);

  const handleBoardClick = (boardIndex: number, boardId: string) => {
    setCurrentBoardIndex(boardIndex);
    localStorage.setItem("currentBoardIndex", boardIndex.toString());
    localStorage.setItem("currentBoardId", boardId);
    queryClient.refetchQueries({ queryKey: ["Task", "boards"] });
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["boards"],
    queryFn: () => boardApiServices.fetchBoards(),
  });

  if (data === undefined) {
    // noop for now
  } else {
    setIsLoggedIn(true);
  }

  const overlayBase =
    "flex md:hidden fixed inset-0 top-24 items-center justify-center z-20 bg-black/50";
  const panelBase =
    "w-[90%] max-h-[90%] h-auto rounded-xl shadow-lg text-[#828FA3] p-4 flex flex-col items-start overflow-y-auto bg-white [data-theme='dark']:bg-[#2B2C37]";
  const titleClasses =
    "text-[12px] tracking-[2.4px] leading-[15px] mb-6 ml-5 font-bold text-black [data-theme='dark']:text-white";
  const createBoardClasses =
    "my-2 flex flex-row cursor-pointer text-[15px] font-bold mr-6 px-6 py-[15px] transition-colors ml-[-0.5rem] rounded-r-full hover:bg-[rgba(99,95,199,0.1)] [data-theme='dark']:hover:bg-white hover:text-[#635FC7]";
  const createBoardTextClasses = "text-[#635FC7] text-[16px] font-medium";
  const hideSidebarClasses =
    "flex flex-row items-center justify-center text-[#828FA3] cursor-pointer gap-2 mt-4 hover:text-[#635FC7]";

  if (isLoading) {
    return (
      <div
        className={`${overlayBase}`}
        style={{ display: isSidebarMobile ? "flex" : "none" }}
      >
        <div className={panelBase}>
          {props.boards && (
            <Skeleton height={30} width={200} className="mb-4" />
          )}
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} height={50} className="mt-2" />
          ))}
          <div className={createBoardClasses}>
            <Skeleton height={13} width={10} className="mr-1" />
            <Skeleton height={16} width={100} />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={`${overlayBase}`}
        style={{ display: isSidebarMobile ? "flex" : "none" }}
      >
        <p className="text-white">Something went wrong</p>
      </div>
    );
  }

  return (
    <div
      className={overlayBase}
      style={{ display: isSidebarMobile ? "flex" : "none" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsSidebarMobile(false);
      }}
    >
      <div className={panelBase}>
        <h1 className={titleClasses}>ALL boards({data.length})</h1>
        {data.map((board: { name: string; id: string }, index: number) => (
          <BoardCart
            text={board.name}
            key={board.id}
            onClick={() => handleBoardClick(index, board.id)}
            selected={currentBoardIndex === index}
          />
        ))}
        <div className={createBoardClasses}>
          <img
            className="mr-1"
            src="/assets/icon-board2.svg"
            alt="plus"
            width={16}
            height={16}
          />
          <p className={createBoardTextClasses}>+ Create New Board</p>
        </div>
        <ThemeToggle />
        <div
          onClick={() => setIsSidebarMobile(false)}
          className={hideSidebarClasses}
        >
          <img
            className="mr-2"
            src="/assets/icon-hide-sidebar.svg"
            width={18}
            height={16}
            alt="hide-sidebar"
          />
          <p>Hide Sidebar</p>
        </div>
      </div>
    </div>
  );
};
