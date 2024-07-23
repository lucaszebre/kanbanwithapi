import { useMutation } from 'react-query';
import { axiosInstance } from './instance';

interface RegisterData {
  email: string;
  password: string;
  fullname: string;
}

const register = async ({ email, password, fullname }: RegisterData) => {
  try {
    const response = await axiosInstance.post('/register', {
      email,
      password,
      name: fullname,
    });

    if (response && response.data && response.data.token) {
      // Authentication successful
      return response.data;
    } else {
      // Authentication failed
      throw new Error('Registration failed');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useRegister = () => {
  return useMutation<any, Error, RegisterData>(register);
};