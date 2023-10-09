import Cookies from 'js-cookie';
import { axiosInstance } from './instance';
import React, { SetStateAction } from 'react';

export const login = async (
  email: string, 
  password: string, 
  setIsLoading: React.Dispatch<SetStateAction<boolean>>
) => {

  try {
    setIsLoading(true);  // Set loading to true when starting to try to login
    
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    
    if (response && response.data && response.data.access_token) {
      Cookies.set('key', response.data.access_token);
      // Authentication successful
      setIsLoading(false);  // Reset loading when login is successful
      return response.data;
    } else {
      // Authentication failed
      console.error('auth failed')
      setIsLoading(false);  // Reset loading when login fails
      return null;
    }
  } catch (error) {
   
    console.error(error);
    setIsLoading(false);  // Ensure loading is reset even on error
    return null;
  }
};
