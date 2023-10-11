import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { axiosInstance } from './instance';
import { handleSessionExpiration } from './handleSessionexpiration';

export const fetchTask = async (taskId:string) => {
    try {
        // Check if localStorage is available (client-side)

        const response = await axiosInstance.get(`/tasks/${taskId}`);
        if (response) {
            return response.data;
        } else {
            console.error('Error fetching boards');
        }
        
    } catch (error) {
        console.error(error);
    }
};