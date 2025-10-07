import type { Board } from "@/types/global";

export function IdtoBoarName(id: string | null, boards: Board[]) {
  let boardName = "";
  boards?.forEach((board: Board) => {
    if (board.id === id) {
      boardName = board.name;
    }
  });
  return boardName;
}
