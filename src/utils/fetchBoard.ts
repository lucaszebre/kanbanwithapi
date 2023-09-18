import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { axiosInstance } from './instance';
import { handleSessionExpiration } from './handleSessionexpiration';

export const fetchBoards = async () => {
  try {
    // Check if localStorage is available (client-side)
    if (typeof window !== 'undefined') {      

      const data = await axiosInstance.get(`/auth/profile`);
      const response = await axiosInstance.get(`/users/${data.data.id}`);
      if (response) {
        return response.data;
      } else {
        handleSessionExpiration()
        console.error('Error fetching boards');
      }
    }
  } catch (error) {
    handleSessionExpiration()
    console.error(error);
  }
};

