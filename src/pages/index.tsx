import React,{ useContext, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Theme from '../components/theme';
import Board from '../components/board';
import Hide from '@/components/hide';
import { DataContext } from '@/state/datacontext';
import jwt, { JwtPayload } from 'jsonwebtoken'; // Import JwtPayload
import ErrorBoundary from '@/components/errorPage'; // Import your ErrorBoundary component
import Auth from '@/components/auth';
import Cookies from 'js-cookie';

function Home() {
  const { setIsLoggedIn, isLoggedIn,  } =
    useContext(DataContext);

  useEffect(() => {
    const storedToken = Cookies.get('key');

    if (storedToken) {
      // Attempt to decode the stored token
      try {
        const decodedToken = jwt.decode(storedToken) as JwtPayload | null; // Specify the type

        if (decodedToken) {
          // Check if the 'exp' property is defined and not expired
          if (decodedToken.exp !== undefined && decodedToken.exp * 1000 > Date.now()) {
            setIsLoggedIn(true);
          } else {
            // Handle the case where the token has expired or 'exp' is undefined
          }
        }
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  return (
    <>
      <Hide />
      <ChakraProvider theme={Theme}>
        {isLoggedIn ? (
          // Wrap your Board component with ErrorBoundary
          <ErrorBoundary>
            <Board />
          </ErrorBoundary>
        ) : (
          // Wrap your Login component with ErrorBoundary
          <ErrorBoundary>
            <Auth />
          </ErrorBoundary>
        )}
      </ChakraProvider>
    </>
  );
}

export default Home;
