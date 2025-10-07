import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { AddBoard } from "./addBoard";

export const NoBoards = () => {
  const { t } = useTranslation("board");

  return (
    <>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-y-4">
        <h2 className="text-center text-lg font-bold ">
          {t("noBoardsMessage")}
        </h2>
        <AddBoard>
          <Button
            variant={"secondary"}
            className="cursor-pointer rounded-3xl p-4"
          >
            {t("addBoardButton")}
          </Button>
        </AddBoard>
      </div>
    </>
  );
};
