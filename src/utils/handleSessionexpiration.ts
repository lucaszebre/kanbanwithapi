/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from 'next/router';

// Handle session expiration error and redirect to custom error page
export const handleSessionExpiration = () => {
  const router = useRouter();
  router.replace('/SessionExpiredError');
};
