import Image from 'next/image';
import React from 'react';
import { useContext } from 'react';
import styles from '../styles/Hide.module.css';
import { useSidebarStore } from '@/contexts/sidebarcontext';

const Hide = () => {

    // state to toggle the sidebar 
    const { isSidebarOpen, setIsSidebarOpen } = useSidebarStore();  

    return (
        <div className={styles.HideContainer}
            style={{
                display: isSidebarOpen ? 'none' : 'block',
            }}
        >
            <div className={styles.HideBlock} 
            onClick={()=>{
                setIsSidebarOpen(true)
                }}
                >
                <Image src="/assets/icon-hide-sidebar.svg" alt="hideBar" width={20} height={20} />
            </div>
        </div>
    )
}

export default Hide;
