import { Key, useContext, useEffect } from 'react';
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

const Sidebar = () => {
  
  
  const { theme, setTheme } = useTheme();

  const { isSidebarOpen, setIsSidebarOpen } = useContext(KanbanContext);  // state to toggle the sidebar 
  const { setAddBoard } = useContext(Opencontext);  // state to toggle the display of the Add Board components
  const {
    boards,
    currentBoardIndex,
    setCurrentBoardIndex,
    setCurrentBoardId,
    setHeaderTitle,
    SetIsMoving
    } = useContext(DataContext);

    const handleThemeToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTheme(event.target.checked ? 'light' : 'dark');
    };
    


  // function to handle the click on a board cart 
  const handleBoardClick = (boardName: string, boardIndex: number,boardId:string) => {
    setHeaderTitle(boardName);
    setCurrentBoardIndex(boardIndex);
    setCurrentBoardId(boardId)
    localStorage.setItem('currentBoardIndex', boardIndex.toString());
    localStorage.setItem('currentBoardId', boardId);
    SetIsMoving(prev=>!prev)
    };

    const {data,isLoading,isError} = useQuery({
      queryKey:['Boards'],
      queryFn:()=>fetchBoards(),
    });
    if(isLoading){
      return <p>Loading...</p>
    }
    if(isError){
      return <p>
        Something went wrongs
      </p>
    }
  return (
    <div className={`${styles.SidebarContainer} ${
      theme === 'light' ? styles.light : styles.dark
    }`}>
      <div className={styles.SibebarWrapper}>
        <div className={styles.DropDown}>
          <h1 
          className={`${styles.SideBarTitle} ${
            theme === 'light' ? styles.light : styles.dark
          }`}>ALL BOARDS({data.Boards.length})</h1>
        
          {data.Boards.map((board: { name: string; _id: string; },index: number) => (
            <BoardCart 
            text={board.name} 
            key={index} 
            onClick={() => { handleBoardClick(board.name, index,board._id) }}
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
      
  );
};

export default Sidebar;