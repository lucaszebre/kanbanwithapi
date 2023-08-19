import React, { useContext,useState } from 'react';
import styles from '@/styles/Login.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SchemaLogin } from '@/types';
import axios from 'axios';
import Link from 'next/link';
import { DataContext } from '@/contexts/datacontext';
import { cookieStorageManager } from '@chakra-ui/react';

const Login: React.FC = () => {

    const Router = useRouter();
    const {setUserId,setToken} = useContext(DataContext)
    const {register,handleSubmit,watch,formState: { errors },} = useForm({resolver: zodResolver(SchemaLogin),});
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const onSubmit = async () => {
        try {
        const response = await axios.post('https://kanbantask.onrender.com/auth/login', {
            password: password,
            username: username, // Make sure to use the correct field name
        },{ withCredentials: true });
        
    
        if (response.status === 200) {
            console.log("Login sucessfully")
            // You can redirect to another page or display a success message here
            setUserId(response.data.id)
            setToken(response.data.token)
            localStorage.setItem('userId',response.data.id)
            localStorage.setItem('token',response.data.token)
            console.log(response.data.id)
            Router.push('/')
        } else {
            console.error('Login error')
            // Handle other response statuses
        }
        } catch (error) {
        console.error('Login error:', error);
        // Handle registration error (display error message, etc.)
        }
    };


        

    return (
        <>
        <div className={styles.LoginContainer}>
            <div className={styles.LoginWrapper}>
                <div className={styles.LoginImageWrapper}>
                    <div className={styles.LoginImage}>
                        
                    </div>
                </div>
                
                <form onSubmit={handleSubmit(()=>{
                    const watched=watch()
                    setUsername(watched.username)
                    setPassword(watched.password)
                    onSubmit()
                })} className={styles.LoginForm} action="">
                    <h1 className={styles.LoginH1}>
                        Login
                    </h1>
                    
                    <p className={styles.LoginDescription}>
                    Add your details below to get back into the app
                    </p>
                    <label style={errors.email ? { color: '#EC5757' } : {}} className={styles.LoginLabel} htmlFor="">
                        Username
                    </label>
                    <div  className={styles.LoginInputWrapper}>
                        <Image className={styles.LoginImageInput} src='/assets/images/icon-email.svg' alt='icon-email' height={16} width={16} />
                        <input  style={errors.username ? { border: '#EC5757 1px solid' } : {}}   {...register('username')} className={styles.LoginInput} type="text" placeholder='e.g. lucasbeaugosse@email.com' />
                        {errors && errors.username && <p className={styles.LoginError}>{errors.username.message?.toString()}</p>}
                    </div>
                    
                    <label style={errors.password ? { color: '#EC5757' } : {}}  className={styles.LoginLabel} htmlFor="">
                        Password
                    </label>
            
                    <div className={styles.LoginInputWrapper}>
                        <Image  className={styles.LoginImageInput} src='/assets/images/icon-password.svg' alt='icon-password' height={16} width={16} />
                        <input   style={errors.password ? { border: '#EC5757 1px solid' } : {}}    {...register('password')} className={styles.LoginInput}  placeholder='Enter your password' type = "password" />
                        {(errors && errors.password && <p className={styles.LoginError}>{errors.password.message?.toString()}</p>) || (errors && errors.message && <p className={styles.LoginError}>Invalid password</p>) }
                    </div>
                    <button type='submit' className={styles.LoginButton}>Login</button>
                    <div className={styles.LoginDiv}>
                        Dont have a account
                        <Link  href='/register'className={styles.LoginNoAccount}>
                            Create account
                        </Link>
                    </div>
                    <div>
                    
                    </div>
                    
                </form>
            </div>
        </div>
    </>
    );
};

export default Login;
