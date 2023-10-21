import React, { useContext, useState } from 'react'
import styles from '../styles/sideMobile.module.css'
import AddBoard from './addBoard'
import { useStore } from '@/state/contextopen'
import { DataContext } from '@/state/datacontext'
import { useQuery, useQueryClient } from 'react-query'
import Cookies from 'js-cookie'
import { fetchBoards } from '@/utils/fetchBoard'

const sideMobile = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [addBoard,setAddBoard] = useState(false)
    const {
        setIsLoggedIn
        // eslint-disable-next-line react-hooks/rules-of-hooks
        } = useContext(DataContext);
    
        const {currentBoardIndex,
          // eslint-disable-next-line react-hooks/rules-of-hooks
          setCurrentBoardIndex} = useStore()
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const queryClient = useQueryClient()



          // function to handle the click on a board cart 
         const handleBoardClick = (boardIndex: number, boardId: string) => {
          // Update the state for the currentBoardIndex
          setCurrentBoardIndex(boardIndex);
          console.log('Board Index:', boardIndex);
        
          // Update cookies with the new boardIndex and boardId
          Cookies.set('currentBoardIndex', boardIndex.toString());
          Cookies.set('currentBoardId', boardId);
        
          // * Invalidate queries to refetch the data, assuming you are using React Query.
          // If not, you can remove this part.
          queryClient.refetchQueries(['boards']);
        };
        
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const {data,isLoading,isError,error} = useQuery({
              queryKey:['boards'],
              queryFn:()=>fetchBoards(),
            });
            if ( data === undefined) {
              // If there's an error or data is undefined, display the custom error page
              
            }else{
              setIsLoggedIn(true)
            }
    return (
        <>
        <AddBoard addBoard={addBoard} setAddBoard={setAddBoard} />
        <div className={styles.sideContainer}>
        
        </div>
        </>
        
    )
}

export default sideMobile
