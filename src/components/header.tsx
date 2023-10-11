import Image from 'next/image';
import styles from '../styles/Header.module.css';
import { useContext, useEffect, useState } from 'react';
import ModalAbout from './modalAbout';
import { DataContext } from '@/state/datacontext';
import { useTheme } from '@/state/themecontext';
import { Logout } from '@/utils/logout';
import { useQuery, useQueryClient } from 'react-query';
import { fetchBoards } from '@/utils/fetchBoard';
import Skeleton from 'react-loading-skeleton';
import EditBoard from './editBoard/editBoard';
import AddTask from './addTask/addTask';
import DeleteThisBoard from './DeletethisBoard';
import {useStore} from '@/state/contextopen';
import { useSidebarStore } from '@/state/sidebarcontext';
import Avatar from '@mui/material/Avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import React from 'react'
import Cookies from 'js-cookie';
import AddBoard from './addBoard';
export default function Header(props:{boards:boolean}) {
    // state to toggle the display of the  different components to decide to click on 
    const {
        isOpenModal,
        setIsOpenModal,
        currentBoardIndex,
        setCurrentBoardIndex
      } = useStore()
    // state to get the current headerTitle 
    const {setIsLoggedIn} = useContext(DataContext);

    const { isSidebarMobile, setIsSidebarMobile } = useSidebarStore();  // state to toggle the sidebar 
    const [editBoard,setEditBoard] = useState(false)
    const [addTask,setAddTask] = useState(false)
    const [addBoard,setAddBoard] = useState(false)
    const [DeleteBlock,setDeleteBlock] = useState(false)

    const { theme } = useTheme();

    const {data,isLoading,isError,error} = useQuery({
        queryKey:['boards'],
        queryFn:()=>fetchBoards(),
      });
      
      if ( data === undefined) {
        // If there's an error or data is undefined, display the custom error page
        
      }else{
        setIsLoggedIn(true)
      }
        function stringToColor(string: string) {
            let hash = 0;
            let i;
        
            /* eslint-disable no-bitwise */
            for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
            }
        
            let color = '#';
        
            for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
            }
            /* eslint-enable no-bitwise */
        
            return color;
        }
        function stringAvatar(name: string) {
            return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}`,
            };
        }
     

        const queryClient = useQueryClient()

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

      if (isLoading) {
        // Return loading skeletons
        return (
            <>
                <div className={styles.HeaderContainer}>
                    {/* Display loading skeletons for desktop header */}
                    <div className={`${styles.HeaderWrapperDesktop} ${theme === 'light' ? styles.light : styles.dark}`}>
                        <Skeleton height={26} width={152} style={{ marginRight: '20px' }} />
                        <Skeleton height={30} width={300} />
                        <Skeleton height={30} width={100} style={{ marginLeft: 'auto' }} />
                    </div>
                    {/* Display loading skeletons for mobile header */}
                    <div className={styles.HeaderWrapperMobile}>
                        <div className={styles.HeaderMobileLeft}>
                            <Skeleton height={56} width={56} style={{ marginRight: '20px' }} />
                            <Skeleton height={30} width={200} />
                            <Skeleton height={15} width={30} style={{ marginLeft: 'auto' }} />
                        </div>
                        <div className={styles.HeaderMobileRight}>
                            <Skeleton height={25} width={25} style={{ marginRight: '10px' }} />
                            <Skeleton height={15} width={15} />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (isError) {
        return (
            <p>
                Something went wrong
            </p>
        );
    }

    return (
        <>
        <DeleteThisBoard  DeleteBlock={DeleteBlock} setDeleteBlock={setDeleteBlock} />
        <AddTask addTask={addTask} setAddTask={setAddTask} />
        <EditBoard editBoard={editBoard} setEditBoard={setEditBoard} />
        <AddBoard addBoard={addBoard} setAddBoard={setAddBoard} />
        {isOpenModal && (
            <ModalAbout right={'2rem'} top={'7rem'} visible={isOpenModal} editBoard={editBoard} setEditBoard={setEditBoard} setDeleteBlock={setDeleteBlock} />
        )}
        <div className={styles.HeaderContainer}>
            <div 
            className={`${styles.HeaderWrapperDesktop} ${
                theme === 'light' ? styles.light : styles.dark
                }`}>
                <div className={styles.HeaderLeft}>
                    <Image
                    className={styles.HeaderLogo}
                    src={theme === 'dark' ? '/assets/logo-light.svg' : '/assets/logo-dark.svg'}                    alt=""
                    width={152}
                    height={26}
                    />
                </div>
                <div className={styles.HeaderRight}>
                    <h1 
                    className={`${styles.HeaderTitle} ${
                        theme === 'light' ? styles.light : styles.dark
                        }`}>{ data[0].boards[currentBoardIndex]? data[0].boards[currentBoardIndex].name : ''}</h1>
                    <div className={styles.HeaderBlock1}>
                    {props.boards && <button
                        onClick={() => {
                        setAddTask(true);
                        }}
                        className={styles.HeaderButton}
                    >+ Add New Task</button>}
                    <button
                            onClick={()=>{
                                Logout()
                                setIsLoggedIn(false)
                                window.location.reload}}
                        className={styles.LogoutButton}
                    >
                        Logout
                    </button>
                    
                    
                    {props.boards && <div style={{'cursor':'po'}} onClick={() => {
                        setIsOpenModal(!isOpenModal);
                        }}> <Avatar {...stringAvatar(data[0].name)} /> </div>}
                    </div>
                </div>
            </div>
            {/* Mobile Section */}
            <div className={styles.HeaderWrapperMobile}>
                <div className={styles.HeaderMobileLeft}
                onClick={()=>{
                    setIsSidebarMobile(!isSidebarMobile)
                }}
                >
                    <Image
                    className={styles.HeaderMobileLogo}
                    src="/assets/logo-mobile.svg"
                    alt="mobile-logo-kanba"
                    width={56}
                    height={56}
                    />
                    <h1 className={styles.HeaderMobileTitle}>{data[0].boards[currentBoardIndex]? data[0].boards[currentBoardIndex].name : ''}</h1>
                    
                    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Image
                    src="/assets/icon-chevron-down.svg"
                    alt="chevron-up"
                    width={15}
                    height={15}
                    style={{'cursor':'pointer'}}
                    />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-4 w-56">
        <DropdownMenuLabel className='cursor-pointer' >ALL boards({data[0].boards.length})</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {data[0].boards.map((board: { name: string; id: string; },index: number) => (
                // eslint-disable-next-line react/jsx-key
                <DropdownMenuLabel className='cursor-pointer' onClick={() => { handleBoardClick( index,board.id) }}>
                {board.name} 
                </DropdownMenuLabel>
              ))}
        <DropdownMenuSeparator />

        <DropdownMenuLabel onClick={()=>{setAddBoard(true)}} className='cursor-pointer'>Add a board</DropdownMenuLabel>
        
    
        
      </DropdownMenuContent>
    </DropdownMenu>
                </div>
            <div className={styles.HeaderMobileRight}>
                <button onClick={() => {
                        setAddTask(true);
                        }} className={styles.AddStaskMobile}>+</button>
                <Image className={styles.HeaderMobileEllipsis} onClick={() => {
                        setIsOpenModal(!isOpenModal);
                        }} src="/assets/icon-vertical-ellipsis.svg" alt="vertical-ellipsis"  width={8} height={16}/>
            </div>
        </div>
    </div>
        </>
    );
};

