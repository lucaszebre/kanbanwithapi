import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "react-query";
import { boardApiServices } from "../board/board.service";
import { axiosInstance } from "../common/instance";
const deleteBoard = async (boardId: string) => {
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

function useDeleteBoardMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (boardId: string) => boardApiServices.deleteBoard(boardId),
    {
      onSuccess: () => {
        queryClient.refetchQueries(["boards"]);
      },
    }
  );

  return mutation;
}

export default useDeleteBoardMutation;
