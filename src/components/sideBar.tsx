import { Key, useContext, useEffect, useState } from 'react';
import { KanbanContext } from '@/contexts/sidebarcontext';
import { Opencontext } from '@/contexts/contextopen';
import styles from '@/styles/Sidebar.module.css';
import Image from 'next/image';
import { Switch as MuiSwitch } from '@mui/material';
import BoardCart from './boardCart';
import { DataContext } from '@/contexts/datacontext';
import { Board } from '@/types';
import { useTheme } from '@/contexts/themecontext';
import { useQuery } from 'react-query';
import { fetchBoards } from '@/utils/fetchBoard';
import Skeleton from 'react-loading-skeleton';
import AddBoard from './addBoard';
import { handleSessionExpiration } from '@/utils/handleSessionexpiration';

const Sidebar = (props:{boards:boolean}) => {
  
  
  const { theme, setTheme } = useTheme();
  const { isSidebarOpen, setIsSidebarOpen } = useContext(KanbanContext);  // state to toggle the sidebar 
  // const { setAddBoard } = useContext(Opencontext);  // state to toggle the display of the Add Board components
  const [addBoard,setAddBoard] = useState(false)
  const {
    currentBoardIndex,
    setCurrentBoardIndex,
    setCurrentBoardId,
    setHeaderTitle,
    SetIsMoving,
    setIsLoggedIn
    } = useContext(DataContext);

    const handleThemeToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTheme(event.target.checked ? 'light' : 'dark');
    };
    


  // function to handle the click on a board cart 
  const handleBoardClick = (boardName: string, boardIndex: number,boardId:string) => {
    setHeaderTitle(boardName);
    setCurrentBoardIndex(boardIndex);
    console.log(boardId)
    setCurrentBoardId(boardId)
    localStorage.setItem('currentBoardIndex', boardIndex.toString());
    localStorage.setItem('currentBoardId', boardId);
    SetIsMoving(prev=>!prev)
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
            onClick={() => { handleBoardClick(board.name, index,board.id) }}
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