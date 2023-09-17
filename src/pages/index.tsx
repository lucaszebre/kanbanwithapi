import  {useContext, useEffect}  from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Theme from '../components/theme';
import Board from '../components/board';
import Login from '@/components/login';
import Hide from '@/components/hide';
import { DataContext } from '@/contexts/datacontext';
import jwt from 'jsonwebtoken';

function Home() {
  const {setIsLoggedIn,isLoggedIn,setTokenExpiration,tokenExpiration} = useContext(DataContext);

  useEffect(() => {
    const storedToken = localStorage.getItem('key');

    if (storedToken) {
      // Attempt to decode the stored token
      try {
        const decodedToken = jwt.decode(storedToken);
        
        if (decodedToken) {
          
          // Check if the token has expired
          const isTokenExpired = decodedToken.exp * 1000 <= Date.now();

          if (!isTokenExpired) {
            setIsLoggedIn(true);
          }else{
            setIsLoggedIn(false)
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
        {isLoggedIn ? ( // Conditional rendering based on login state
          <Board />
        ) : (
          <Login /> // Render the Login component when not logged in
        )}
      </ChakraProvider>
    </>
  );
}
export default Home;

