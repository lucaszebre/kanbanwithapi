/* eslint-disable react/no-unescaped-entities */
import React,{useState} from 'react'
import Image from 'next/image'
import styles from '@/styles/Register.module.css'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import z from 'zod';
import { FormDataRegister } from '@/types';
import { axiosInstance } from '@/utils/instance';


const schemaRegister = z.object({
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/[A-Za-z]/, { message: 'Password must contain at least one letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one digit' })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character' }),
    username: z.string()
        .min(1, { message: 'Username must be at least 1 characters long' })
        
        ,
});

const Register: React.FC = () => {
    const Router = useRouter()
    const { register, handleSubmit,watch, formState: { errors } } = useForm<FormDataRegister>({ resolver: zodResolver(schemaRegister) });
    const watched = watch()
    const onSubmit = async (email:string,password:string,username:string) => {
        try {
        
            try {
                const response = await axiosInstance.post('/auth/register', {
                email,
                password,
                name:username
                });
        
                if (response.status === 201) {
                console.log('User initiated successfully');
                } else {
                console.error('User initiation failed');
                }
            } catch (initError) {
                console.error('User initiation error:', initError);
            }
        
            // Redirect to login page after a successful registration and initiation
            Router.push('/');
            } catch (error) {
            console.error('Registration error:', error);
            // Handle registration error (display error message, etc.)
            }
        };
        
        
        

    
    return (
        
        <div className={styles.RegisterContainer}>
            <div className={styles.RegisterWrapper}>
                <div className={styles.RegisterImageWrapper}>
                    <div className={styles.RegisterImage}>
                    </div>
                </div>            
                <form onSubmit={handleSubmit(()=>{
                    onSubmit(watched.email,watched.password,watched.username);
                })} className={styles.RegisterForm} action="">
                <h1 className={styles.RegisterH1}>
                    Create account
                </h1>
                <p className={styles.RegisterDescription}>
                Let’s get you started sharing your links!
                </p>
                <label className={styles.RegisterLabel} htmlFor="">
                    Username
                </label>
                
                <div className={styles.RegisterInputWrapper}>
                    <Image  className={styles.RegisterImageInput} src='/assets/images/icon-password.svg' alt='icon-password' height={16} width={16} />
                    <input type='text' style={errors.username ? { border: '#EC5757 1px solid' } : {}}    {...register('username')} className={styles.RegisterInput}  placeholder='At least 1 characters' />
                    {errors.username && <p className={styles.RegisterError}>{errors.username.message?.toString()}</p>}
                </div>

                <label  className={styles.RegisterLabel} htmlFor="">
                    Email adress
                </label>
                <div className={styles.RegisterInputWrapper}>
                    <Image className={styles.RegisterImageInput} src='/assets/images/icon-email.svg' alt='icon-email' height={16} width={16} />
                    <input style={errors.email ? { border: '#EC5757 1px solid' } : {}}   {...register('email')}  className={styles.RegisterInput} type="text" placeholder='e.g. alex@email.com' />
                    {errors.email && <p className={styles.RegisterError}>{errors.email.message?.toString()}</p>}
                </div>
                
                <label className={styles.RegisterLabel} htmlFor="">
                    Confirm password
                </label>
                
                <div className={styles.RegisterInputWrapper}>
                    <Image  className={styles.RegisterImageInput} src='/assets/images/icon-password.svg' alt='icon-password' height={16} width={16} />
                    <input type='password' style={errors.password ? { border: '#EC5757 1px solid' } : {}}    {...register('password')} className={styles.RegisterInput}  placeholder='At least 8 characters' />
                    {errors.password && <p className={styles.RegisterError}>{errors.password.message?.toString()}</p>}
                </div>
                <p className={styles.RegisterP}>
                Password must contain at least 8 characters
                </p>
                <button className={styles.RegisterButton}>Create new account</button>
                <div className={styles.RegisterDiv}>
                    Already have a account
                    <Link href={'/'} className={styles.RegisterNoAccount}>
                        Login
                    </Link>
                </div>
            </form>
        </div>
    </div>
    )
}

export default Register
