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
import supabase from '@/supabase';
const Login: React.FC = () => {

    const Router = useRouter();
    const {register,handleSubmit,watch,formState: { errors },} = useForm({resolver: zodResolver(SchemaLogin),});
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const onSubmit = async () => {
        try {

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        
        if(error){
            console.error('Error login ',error.message)
        }else{
            Router.push('/')
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
                    setEmail(watched.email)
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
                        Email
                    </label>
                    <div  className={styles.LoginInputWrapper}>
                        <Image className={styles.LoginImageInput} src='/assets/images/icon-email.svg' alt='icon-email' height={16} width={16} />
                        <input  style={errors.email ? { border: '#EC5757 1px solid' } : {}}   {...register('email')} className={styles.LoginInput} type="text" placeholder='e.g. lucasbeaugosse@email.com' />
                        {errors && errors.email && <p className={styles.LoginError}>{errors.email.message?.toString()}</p>}
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
