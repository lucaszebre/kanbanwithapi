import styles from '../styles/TaskCard.module.css';
import { useTheme } from '@/contexts/themecontext';

const TaskCardLoader = () => {

    const { theme, setTheme } = useTheme();

    



    return (
        <>
        

        <div 
        className={`${styles.TaskCardContainer} ${styles.Skeleton} ${
        theme === 'light' ? styles.light : styles.dark
        }`}
        
        
        >
            <h1 
            className={`${styles.SkeletonText} ${
            theme === 'light' ? styles.light : styles.dark
            }`}
            >
            
            </h1>
            <p className={styles.TaskCardP}>
            
            </p>
        </div>
        </>

    );
    };

export default TaskCardLoader;
