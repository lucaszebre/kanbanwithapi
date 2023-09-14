import axiosInstance from 'axiosInstance';
import { UserSchema } from '@/types/Zodtype';

export const register = async (email:string, password:string,name:string) => {
    try {
        const response = await axiosInstance.post('http://localhost:3000/auth/register', {
            email,
            password,
            name
        });
    
        if (response && response.data && response.data.access_token) {
            // Authentication successful
            return response.data;
        } else {
            // Authentication failed
            return null;
        }
        } catch (error) {
        console.error(error);
        return null;
        }
    };