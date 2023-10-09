import { useMutation, useQueryClient } from 'react-query';
import { axiosInstance } from './instance';
import Cookies from 'js-cookie';
const deleteBoard = async (boardId: string) => {  // function to delete the baord in the firestore 
    try {
            const response = await axiosInstance.delete(
                `/boards/${boardId}`,
                );
        
                if (response.data) {
                // Assuming the response data is an array of boards
                console.log('The boards has been deleted');
                } else {
                console.error('Error fetching boards');
                }
                Cookies.set('currentBoardIndex', '0');
        
    } catch (error) {
        console.error('Error while deleting the board:', error);
    }
};

function useDeleteBoardMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (boardId:string) => deleteBoard(boardId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['boards']);
      },
    }
  );

  return mutation;
}

export default useDeleteBoardMutation;
