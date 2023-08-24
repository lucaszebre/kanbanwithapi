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

export default function Header() {
    // state to toggle the display of the  different components to decide to click on 
    const { setAddTask, setIsOpenModal, isOpenModal, isChanged } = useContext(Opencontext);
    // state to get the current headerTitle 
    const {currentBoardIndex} = useContext(DataContext);

    const { isSidebarMobile, setIsSidebarMobile } = useContext(KanbanContext);  // state to toggle the sidebar 

    const { theme, setTheme } = useTheme();

    const Router = useRouter()
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
        <>
        {isOpenModal && (
            <ModalAbout right={'2rem'} top={'7rem'} visible={isOpenModal} />
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
                        }`}>{ data.Boards[currentBoardIndex]? data.Boards[currentBoardIndex].name : ''}</h1>
                    <div className={styles.HeaderBlock1}>
                    <button
                        onClick={() => {
                        setAddTask(true);
                        }}
                        className={styles.HeaderButton}
                    >
                        + Add New Task
                    </button>
                    <button
                            onClick={()=>{Logout()
                            Router.push('/login')}}
                        className={styles.LogoutButton}
                    >
                        Logout
                    </button>
                    <Image
                        onClick={() => {
                        setIsOpenModal(!isOpenModal);
                        }}
                        className={styles.HeaderEllipsis}
                        src="/assets/icon-vertical-ellipsis.svg"
                        alt="vertical-ellipsis"
                        width={100}
                        height={100}
                    />
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
                    <h1 className={styles.HeaderMobileTitle}>{data.Boards[currentBoardIndex]? data.Boards[currentBoardIndex].name : ''}</h1>
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

