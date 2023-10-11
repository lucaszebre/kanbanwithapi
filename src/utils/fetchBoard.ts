import { axiosInstance } from './instance';
import { handleSessionExpiration } from './handleSessionexpiration';

export const fetchBoards = async ():Promise<any> => {
  try {
    
    const response = await axiosInstance.get(`/boards`);
      if (response) {
        return response.data;
      } else {
        handleSessionExpiration()
        console.error('Error fetching boards');
      }
    }
   catch (error) {
    handleSessionExpiration()
    console.error(error);
  }
};

