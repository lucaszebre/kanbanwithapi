import {  useContext, useState } from 'react';
import { useSidebarStore } from '@/state/sidebarcontext';
import styles from '@/styles/Sidebar.module.css';
import Image from 'next/image';
import { Switch as MuiSwitch } from '@mui/material';
import BoardCart from './boardCart';
import { DataContext } from '@/state/datacontext';
import { useTheme } from '@/state/themecontext';
import { useQuery, useQueryClient } from 'react-query';
import { fetchBoards } from '@/utils/fetchBoard';
import Skeleton from 'react-loading-skeleton';
import AddBoard from './addBoard';
import { useStore } from '@/state/contextopen';
import React from 'react'
import Cookies from 'js-cookie';
const Sidebar = (props:{boards:boolean}) => {
  
  
  const { theme, setTheme } = useTheme();
  const {  setIsSidebarOpen } = useSidebarStore();  // state to toggle the sidebar 
  // const { setAddBoard } = useContext(Opencontext);  // state to toggle the display of the Add Board components
  const [addBoard,setAddBoard] = useState(false)
  const {
    setIsLoggedIn
    } = useContext(DataContext);

    const {currentBoardIndex,
      setCurrentBoardIndex} = useStore()

      const handleThemeToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTheme = event.target.checked ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Update localStorage with the new theme
      };
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
  queryClient.invalidateQueries(['boards']);
};

    const {data,isLoading,isError,error} = useQuery({
      queryKey:['boards'],
      queryFn:()=>fetchBoards(),
    });
    if ( data === undefined) {
      // If there's an error or data is undefined, display the custom error page
      
    }else{
      setIsLoggedIn(true)
    }

    if (isLoading) {
      // Return loading skeletons
      return (
          <div className={`${styles.SidebarContainer} ${theme === 'light' ? styles.light : styles.dark}`}>
              <div className={styles.SibebarWrapper}>
                  <div className={styles.DropDown}>
                      {props.boards && (
                          <Skeleton height={30} width={200} className={`${styles.SideBarTitle} ${theme === 'light' ? styles.light : styles.dark}`} />
                      )}

                      {/* Display multiple skeletons for board carts */}
                      {[...Array(3)].map((_, index) => (
                          <Skeleton
                              key={index}
                              height={50}
                              style={{ marginTop: '10px' }}
                              className={currentBoardIndex === index ? styles.selected : ''}
                          />
                      ))}

                      <div
                          className={styles.CreateBoard}
                          onClick={() => {
                              setAddBoard(true);
                          }}
                      >
                          <Skeleton height={13} width={10} className={styles.BoardImage} />
                          <Skeleton height={16} width={100} className={styles.CreateBoardText} />
                      </div>
                  </div>

                  {/* ... (existing theme toggle and hide sidebar code) */}
              </div>
          </div>
      );
  }

  if (isError) {
      return (
          <div className={`${styles.SidebarContainer} ${theme === 'light' ? styles.light : styles.dark}`}>
              <p>Something went wrong</p>
          </div>
      );
  }
 
  return (
    <>
    <AddBoard addBoard={addBoard} setAddBoard={setAddBoard} />
    <div className={`${styles.SidebarContainer} ${
      theme === 'light' ? styles.light : styles.dark
    }`}>
      <div className={styles.SibebarWrapper}>
        <div className={styles.DropDown}>
          {props.boards && <h1 
          className={`${styles.SideBarTitle} ${
            theme === 'light' ? styles.light : styles.dark
          }`}>ALL boards({data.boards.length})</h1>}
        
          {data.boards.map((board: { name: string; id: string; },index: number) => (
            <BoardCart 
            text={board.name} 
            key={index} 
            onClick={() => { handleBoardClick( index,board.id) }}
            selected={currentBoardIndex === index}
            />
          ))}
          
            <div
              className={styles.CreateBoard}
              onClick={() => {
                setAddBoard(true);
              }}
            >
              <Image className={styles.BoardImage} src="/assets/icon-board2.svg" alt="plus" width={10} height={13} />
              <p className={styles.CreateBoardText}>+ Create New Board</p>
              </div>
            </div>
        
          <div className={styles.SideBarBottom}>
            <div className={styles.ToggleBlock}>
              <Image src="/assets/icon-dark-theme.svg" alt="icon-dark-theme" width={18.33} height={18.33} />
              <MuiSwitch
                size="medium"
                color="default"
                checked={theme !== 'dark'}
                onChange={handleThemeToggle}
              />
              <Image src="/assets/icon-light-theme.svg" alt="icon-light-theme" width={15} height={15} />
            
          </div>
          <div
            onClick={() => {
              setIsSidebarOpen(false);
            }}
            className={`${styles.HideSideBar} ${
              theme === 'light' ? styles.light : styles.dark
            }`}
            
          >
            <Image className={styles.HideItems} src="/assets/icon-hide-sidebar.svg" width={18} height={16} alt="hide-sidebar" />
            <p>Hide Sidebar</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Sidebar;