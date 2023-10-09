import { useQuery } from 'react-query';
import { axiosInstance } from './instance';

 const register = async (email:string, password:string,fullname:string) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks

    try {
        const response = await axiosInstance.post('/auth/register', {
            email,
            password,
            name:fullname,
        });
    
        if (response && response.data && response.data.token) {
            // Authentication successful
           
            return response.data;
        } else {
            // Authentication failed
           
            return response;
        }
        } catch (error) {
            
        console.error(error);
        return null;
        }
    };

    export const useRegister = (email:string, password:string,fullname:string) => {
        const { data, isLoading, isError } = useQuery([ email, password,fullname], 
            () => register( email, password,fullname));
    
        return { data, isLoading, isError };
    };