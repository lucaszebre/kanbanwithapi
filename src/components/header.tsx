// Import necessary hooks and components from React and your own libraries

import Image from 'next/image';
import styles from '../styles/Header.module.css';
import { Opencontext } from '@/contexts/contextopen';
import { useContext, useEffect, useState } from 'react';
import ModalAbout from './modalAbout';
import { DataContext } from '@/contexts/datacontext';
import { useRouter } from 'next/router';
import { KanbanContext } from '@/contexts/sidebarcontext';
import { useTheme } from '@/contexts/themecontext';
import { Logout } from '@/utils/logout';
import { useQuery } from 'react-query';
import { fetchBoards } from '@/utils/fetchBoard';
import Skeleton from 'react-loading-skeleton';
import EditBoard from './editBoard/editBoard';
import AddTask from './addTask/addTask';
import DeleteThisBoard from './DeletethisBoard';

export default function Header(props:{boards:boolean}) {
    // state to toggle the display of the  different components to decide to click on 
    const {  setIsOpenModal, isOpenModal, } = useContext(Opencontext);
    // state to get the current headerTitle 
    const {currentBoardIndex,setIsLoggedIn} = useContext(DataContext);

    const { isSidebarMobile, setIsSidebarMobile } = useContext(KanbanContext);  // state to toggle the sidebar 
    const [editBoard,setEditBoard] = useState(false)
    const [addTask,setAddTask] = useState(false)
    const [DeleteBlock,setDeleteBlock] = useState(false)

    const { theme, setTheme } = useTheme();

    const Router = useRouter()
    const {data,isLoading,isError} = useQuery({
        queryKey:['boards'],
        queryFn:()=>fetchBoards(),
      });
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
                        }`}>{ data.boards[currentBoardIndex]? data.boards[currentBoardIndex].name : ''}</h1>
                    <div className={styles.HeaderBlock1}>
                    {props.boards && <button
                        onClick={() => {
                        setAddTask(true);
                        }}
                        className={styles.HeaderButton}
                    >
                        + Add New Task
                    </button>}
                    <button
                            onClick={()=>{
                                Logout()
                                setIsLoggedIn(false)
                                window.location.reload}}
                        className={styles.LogoutButton}
                    >
                        Logout
                    </button>
                    {props.boards && <Image
                        onClick={() => {
                        setIsOpenModal(!isOpenModal);
                        }}
                        className={styles.HeaderEllipsis}
                        src="/assets/icon-vertical-ellipsis.svg"
                        alt="vertical-ellipsis"
                        width={100}
                        height={100}
                    />}
                    </div>
                </div>
            </div>
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
                    <h1 className={styles.HeaderMobileTitle}>{data.boards[currentBoardIndex]? data.boards[currentBoardIndex].name : ''}</h1>
                    <Image
                    src="/assets/icon-chevron-down.svg"
                    alt="chevron-up"
                    width={15}
                    height={15}
                    />
                </div>
            <div className={styles.HeaderMobileRight}>
                <button className={styles.AddStaskMobile}>+</button>
                <Image className={styles.HeaderMobileEllipsis} onClick={() => {
                        setIsOpenModal(!isOpenModal);
                        }} src="/assets/icon-vertical-ellipsis.svg" alt="vertical-ellipsis"  width={3.69} height={16}/>
            </div>
        </div>
    </div>
        </>
    );
};

