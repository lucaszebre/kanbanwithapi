import Auth from "@/components/auth/auth";
import ErrorBoundary from "@/components/common/errorPage"; // Import your ErrorBoundary component
import Layout from "@/components/layout/Layout";
import Hide from "@/components/navigation/hide";
import { DataContext } from "@/state/datacontext";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken"; // Import JwtPayload
import { useContext, useEffect } from "react";
import Board from "../components/board/board";
import "../i18n/index";
function Home() {
  const { setIsLoggedIn, isLoggedIn } = useContext(DataContext);

  useEffect(() => {
    const storedToken = Cookies.get("key");

    if (storedToken) {
      // Attempt to decode the stored token
      try {
        const decodedToken = jwt.decode(storedToken) as JwtPayload | null; // Specify the type

        if (decodedToken) {
          // Check if the 'exp' property is defined and not expired
          if (
            decodedToken.exp !== undefined &&
            decodedToken.exp * 1000 > Date.now()
          ) {
            setIsLoggedIn(true);
          } else {
            // Handle the case where the token has expired or 'exp' is undefined
          }
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  return (
    <>
      <Hide />
      {isLoggedIn ? (
        // Wrap your Board component with ErrorBoundary
        <ErrorBoundary>
          <Layout>
            <Board />
          </Layout>
        </ErrorBoundary>
      ) : (
        // Wrap your  component with ErrorBoundary
        <ErrorBoundary>
          <Auth />
        </ErrorBoundary>
      )}
    </>
  );
}

export default Home;
