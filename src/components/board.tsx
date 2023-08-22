import  {useState, useEffect, useContext, Key } from 'react';
import ListTask from './listTask';
import Sidebar from './sideBar';
import EmptyBoard from './emptyBoard';
import { KanbanContext } from '@/contexts/sidebarcontext';
import Header from './header';
import styles from '../styles/Board.module.css';
import { DataContext } from '@/contexts/datacontext';
import { Opencontext } from '@/contexts/contextopen';  // get the context to toggle the board 
import { getInitialWindowWidth } from '@/utils/GetInitialWidth';
import { useTheme } from '@/contexts/themecontext';
import { useQuery } from 'react-query';
import { fetchBoards } from '@/utils/fetchBoard';
import { Task } from '@/types';
const Board = () => {
    const { isSidebarOpen, setIsSidebarOpen } = useContext(KanbanContext);  // state to toggle the sidebar 
    const {currentBoardIndex } = useContext(DataContext); // state to manage the global data 
    const {setEditBoard}= useContext(Opencontext) // state to toggle the display of the components EditBoard 
    const [windowWidth, setWindowWidth] = useState(getInitialWindowWidth()); // Update the useState call
    const { theme } = useTheme();


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
        if (windowWidth <= 767) {
            setIsSidebarOpen(false);
        }
    }, [windowWidth, setIsSidebarOpen]);
    
    const {data,isLoading,isError} = useQuery({
        queryKey:['Boards'],
        queryFn:()=>fetchBoards(),
        });
        if(isLoading){
            return <p>Loading...</p>
        }
        if(isError){
        return  <p>
            Something went wrongs
            </p>
        }
        
    function renderListTask() {    // function to render the columns if no we display the empty board components
        if (data?.Boards[currentBoardIndex].columns && data.Boards[currentBoardIndex].columns.length > 0) {
            return (
                <>
                    {data.Boards[currentBoardIndex].columns.map((doc: { name: string; tasks: Task[]; _id: string; }, index: number) => (
                        <ListTask
                            key={index}
                            title={doc.name}
                            NbList={index}
                            tasks={doc.tasks}
                            data={data.Boards[currentBoardIndex]}
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
            return <EmptyBoard />;
        }
    }
   
    return (
        <div className={styles.AppContainer}>
            <div className={styles.HeaderBoard}>
                <Header />
            </div>
            <div className={styles.BoardDiv}>
                <div
                    className={styles.SideContainer}
                    style={{
                        display: isSidebarOpen ? 'block' : 'none',
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    <Sidebar />
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
    );
};

export default Board;
