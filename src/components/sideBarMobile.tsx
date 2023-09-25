import { useState,useContext, useEffect } from 'react';
import { useSidebarStore } from '@/state/sidebarcontext';
import styles from '../styles/SidebarMobile.module.css';
import Image from 'next/image';
import BoardCart from './boardCart';
import { DataContext } from '@/state/datacontext';
import { getInitialWindowWidth } from '@/utils/GetInitialWidth';
import { useTheme } from '@/state/themecontext';
import { Switch as MuiSwitch } from '@mui/material';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from 'react-query';
import { fetchBoards } from '@/utils/fetchBoard';

const Sidebar = (props:{boards:boolean}) => {
const { theme, setTheme } = useTheme();

const { isSidebarMobile, setIsSidebarMobile } = useSidebarStore();  // state to toggle the sidebar 
const { setIsLoggedIn } = useContext(DataContext);  // state to toggle the sidebar 
const [windowWidth, setWindowWidth] = useState(getInitialWindowWidth()); // Update the useState call
const [addBoard,setAddBoard] = useState(false)

const {
    currentBoardId,
    setCurrentBoardId,
    SetIsMoving,
    setHeaderTitle,
    isMoving,
    currentBoardIndex,
    setCurrentBoardIndex
    } = useContext(DataContext);

    useEffect(() => {
        // Check if the window object is available
        if (typeof window !== 'undefined') {
            // Add this useEffect to update the windowWidth state when the window is resized
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };

            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);
    useEffect(() => {
        // Add this useEffect to update the isSidebarOpen state based on the windowWidth state
        if (windowWidth > 767) {
            setIsSidebarMobile(false);
        }
    }, [windowWidth, setIsSidebarMobile]);

    
  useEffect(() => {  // everytime the something happen in the data we get a new track from the firestore to stay update 
    

    }, []);

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
        <div className={styles.SidebarContainer} 
        style={{ display: isSidebarMobile ? 'flex' : 'none' }}
        onClick={(e)=>{
            if (e.target === e.currentTarget) {
                setIsSidebarMobile(false)
            }
        }}
        >
            <div 
            className={`${styles.SibebarWrapper} ${
                theme === 'light' ? styles.light : styles.dark
                }`}
            >
                    <h1 className={`${styles.SideBarTitle} ${
                        theme === 'light' ? styles.light : styles.dark
                        }`}
                    >ALL boards({data.boards.length})</h1>
                
                    
          {data.boards.map((board: { name: string; id: string; },index: number) => (
            <BoardCart 
            text={board.name} 
            key={index} 
            onClick={() => { handleBoardClick(board.name, index,board.id) }}
            selected={currentBoardIndex === index}
            />
          ))}
                
                    <div className={`${styles.CreateBoard} ${
                        theme === 'light' ? styles.light : styles.dark
                        }`} onClick={() => { setAddBoard(true);}}>
                        <Image className={styles.BoardImage} src="/assets/icon-board2.svg" alt="plus" width={16} height={16} />
                        <p className={styles.CreateBoardText}>+ Create New Board</p>
                    </div>
            
            
                    <div className={`${styles.ToggleBlock} ${
                        theme === 'light' ? styles.light : styles.dark
                        }`} >
                        <Image src="/assets/icon-dark-theme.svg" alt="icon-dark-theme" width={18.33} height={18.33} />
                        <MuiSwitch
                        size="medium"
                        color="default"
                        checked={theme !== 'dark'}
                        onChange={handleThemeToggle}
                        />                        
                        <Image src="/assets/icon-light-theme.svg" alt="icon-light-theme" width={15} height={15} />
                    </div>

                    <div onClick={() => {setIsSidebarMobile(false);}} className={styles.HideSideBar}>
                        <Image className={styles.HideItems} src="/assets/icon-hide-sidebar.svg" width={18} height={16} alt="hide-sidebar" />
                        <p>Hide Sidebar</p>
                    </div>
            
        </div>
    </div>


        
    );
    };

export default Sidebar;