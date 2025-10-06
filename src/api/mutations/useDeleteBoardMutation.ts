import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { boardApiServices } from "../board.service";
import { axiosInstance } from "../common/instance";
export const deleteBoard = async (boardId: string) => {
  try {
    const response = await axiosInstance.delete(`/boards/${boardId}`);

    if (response.data) {
      console.log("The boards has been deleted");
    } else {
      console.error("Error fetching boards");
    }
    Cookies.set("currentBoardIndex", "0");
  } catch (error) {
    console.error("Error while deleting the board:", error);
  }
};
export const useDeleteBoardMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (boardId: string) => boardApiServices.deleteBoard(boardId),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["boards"] });
    },
  });

  return mutation;
};
