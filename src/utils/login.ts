import { UserSchema } from '@/types/Zodtype';
import { axiosInstance } from './instance';

export const login = async (email:string, password:string) => {
    try {
        const response = await axiosInstance.post('/auth/login', {
            email,
            password,
        });
    
        if (response && response.data && response.data.access_token) {
            localStorage.setItem('key',response.data.access_token)
            console.log(response.data.access_token)
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