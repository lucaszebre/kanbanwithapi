/* eslint-disable react-hooks/rules-of-hooks */

import { useNavigate } from "react-router";

// Handle session expiration error and redirect to custom error page
export const handleSessionExpiration = () => {
  const router = useNavigate();
  router("/SessionExpiredError");
};
