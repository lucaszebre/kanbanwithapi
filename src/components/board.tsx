import  {useState, useEffect, useContext, Key } from 'react';
import ListTask from './listTask';
import Sidebar from './sideBar';
import EmptyBoard from './emptyBoard';
import { KanbanContext } from '@/contexts/sidebarcontext';
import Header from './header';
import styles from '../styles/Board.module.css';
import { DataContext } from '@/contexts/datacontext';
import { getInitialWindowWidth } from '@/utils/GetInitialWidth';
import { useTheme } from '@/contexts/themecontext';
import { useQuery } from 'react-query';
import { fetchBoards } from '@/utils/fetchBoard';
import { Task } from '@/types';
import Skeleton from 'react-loading-skeleton'
import EditBoard from './editBoard/editBoard';

const Board = () => {
    const { isSidebarOpen, setIsSidebarOpen } = useContext(KanbanContext);  // state to toggle the sidebar 
    const {currentBoardIndex,Interval,setInterval } = useContext(DataContext); // state to manage the global data 
    const [windowWidth, setWindowWidth] = useState(getInitialWindowWidth()); // Update the useState call
    const { theme } = useTheme();
    const [editBoard,setEditBoard]= useState(false)

    useEffect(() => {
        setInterval(1000)
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
        if (windowWidth <= 767) {
            setIsSidebarOpen(false);
        }
    }, [windowWidth, setIsSidebarOpen]);
    
    const {data,isLoading,isError,isFetching} = useQuery({
        queryKey:['Boards'],
        queryFn:()=>fetchBoards(),
        refetchInterval: Interval,
        });
    
        if (isLoading) {
            // Return loading skeletons
            return (
                <div className={styles.AppContainer}>
                    <div className={styles.HeaderBoard}>
                        <Skeleton height={30} width={150} />
                    </div>
                    <div className={styles.BoardDiv}>
                        <div className={styles.SideContainer}>
                            <Skeleton height={500} width={70} />
                        </div>
                        <div className={styles.BoardWrapper}>
                            {/* Display multiple skeletons for columns */}
                            <div className={styles.AddColumn}>
                                <Skeleton height={30} width={100} />
                            </div>
                            {/* Repeat this skeleton for each column */}
                        </div>
                    </div>
                </div>
            );
        }
        if(isError){
        return  <p>
            Something went wrongs
            </p>
        }
        
    function renderListTask() {    // function to render the columns if no we display the empty board components
        if (  data.Boards[currentBoardIndex].columns && data.Boards[currentBoardIndex].columns.length > 0) {
            return (
                <>
                    {data.Boards[currentBoardIndex] && data.Boards[currentBoardIndex].columns.map((doc: { name: string; tasks: Task[]; _id: string; }, index: number) => (
                        <ListTask
                            key={index}
                            title={doc.name}
                            NbList={index}
                            tasks={doc.tasks}
                            columnId={doc._id}
                            columnIndex={index}
                        />
                    ))}
                    <div
                        onClick={() => {
                            // Perform any action you want when the div is clicked
                            setEditBoard(true)
                            
                        }}
                        
                        className={`${styles.AddColumn} ${
                            theme === 'light' ? styles.light : styles.dark
                            }`}
                    >
                        + New Columns
                    </div>
                </>
            );
        } else {
            return <EmptyBoard Boards={true} />;
        }
    }
   if(data.Boards[currentBoardIndex]){


    return (
        <>
        <EditBoard editBoard={editBoard} setEditBoard={setEditBoard} />
        <div className={styles.AppContainer}>
            <div className={styles.HeaderBoard}>
                <Header Boards={true} />
            </div>
            <div className={styles.BoardDiv}>
                <div
                    className={styles.SideContainer}
                    style={{
                        display: isSidebarOpen ? 'block' : 'none',
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    <Sidebar Boards={true} />
                </div>
                <div
                    className={styles.BoardWrapper}
                    tabIndex={0}
                    style={{
                        marginLeft: isSidebarOpen ? '-70px' : '0px',
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    {renderListTask()}
                </div>
            </div>
        </div>
        </>
    );}else{
        return (
            <>
            
            <div className={styles.AppContainer}>
                <div className={styles.HeaderBoard}>
                    <Header Boards={false}/>
                </div>
                <div className={styles.BoardDiv}>
                    <div
                        className={styles.SideContainer}
                        style={{
                            display: isSidebarOpen ? 'block' : 'none',
                            transition: 'all 0.3s ease-in-out',
                        }}
                    >
                        <Sidebar Boards={false} />
                    </div>
                    <div
                        className={styles.BoardWrapper}
                        tabIndex={0}
                        style={{
                            marginLeft: isSidebarOpen ? '-70px' : '0px',
                            transition: 'all 0.3s ease-in-out',
                        }}
                    >
                        <EmptyBoard Boards={false} />
                    </div>
                </div>
            </div>
            </>
        )
    }
};

export default Board;
