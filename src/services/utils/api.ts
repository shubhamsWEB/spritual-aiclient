import { redirect } from 'next/navigation';
import { deleteCookie } from '@/utils/cookies';

export async function handleApiResponse(response: any) {
  const data = response.data; 
  return data;
}

export const handleApiError = (error: any) => {
    if (error.status === 401) {
        console.log("🚀 ~ handleApiError ~ error:", error);
        deleteCookie('authToken');
        
        // Replace redirect with window.location for client-side navigation
        if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
            return null; // Return early after redirect
        } else {
            // Keep the redirect for server components if needed
            redirect('/auth/login');
        }
    }
    return error;
}