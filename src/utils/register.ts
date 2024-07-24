import { UserSchema } from '@/types/Zodtype';
import { axiosInstance } from './instance';

export const register = async (email:string, password:string,name:string) => {
    try {
        const response = await axiosInstance.post('/api/register', {
            email,
            password,
            name
        });
    
        if (response && response.data && response.data.token) {
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