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
import axios from 'axios'; // Import axios for making API requests

const schemaRegister = z.object({
    email: z.string().email({ message: 'Invalid email format' }),
    username: z.string()
    .min(1, { message: 'need a username' }),
    password1: z.string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/[A-Za-z]/, { message: 'Password must contain at least one letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one digit' })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character' }),
    password2: z.string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/[A-Za-z]/, { message: 'Password must contain at least one letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one digit' })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character' })
        ,
});

const Register: React.FC = () => {
    const Router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [sucess,setSucess]=useState<boolean>(false)
    const { register, handleSubmit,watch, formState: { errors } } = useForm<FormDataRegister>({ resolver: zodResolver(schemaRegister) });
    const watched = watch()
    const onSubmit = async () => {
        try {
          const response = await axios.post('https://kanbantask.onrender.com/auth/register', {
            email: email,
            password: password,
            username: username, // Make sure to use the correct field name
          });
    
          if (response.status === 200) {
            setSucess(true);
            console.log("Registered sucessfully")
            // You can redirect to another page or display a success message here
            Router.push('login')
          } else {
            console.error('Register error')
            // Handle other response statuses
          }
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
                    setEmail(watched.email);
                    setPassword(watched.password1);
                    setUsername(watched.username);
                    onSubmit();
                })} className={styles.RegisterForm} action="">
                <h1 className={styles.RegisterH1}>
                    Create account
                </h1>
                <p className={styles.RegisterDescription}>
                Let’s get you started sharing your links!
                </p>
                <label  className={styles.RegisterLabel} htmlFor="">
                    Email adress
                </label>
                <div className={styles.RegisterInputWrapper}>
                    <Image className={styles.RegisterImageInput} src='/assets/images/icon-email.svg' alt='icon-email' height={16} width={16} />
                    <input style={errors.email ? { border: '#EC5757 1px solid' } : {}}   {...register('email')}  className={styles.RegisterInput} type="text" placeholder='e.g. alex@email.com' />
                    {errors.email && <p className={styles.RegisterError}>{errors.email.message?.toString()}</p>}
                </div>
                <label  className={styles.RegisterLabel} htmlFor="">
                    UserName
                </label>
                <div className={styles.RegisterInputWrapper}>
                    <Image className={styles.RegisterImageInput} src='/assets/images/icon-email.svg' alt='icon-email' height={16} width={16} />
                    <input style={errors.email ? { border: '#EC5757 1px solid' } : {}}   {...register('username')}  className={styles.RegisterInput} type="text" placeholder='e.g. alex@email.com' />
                    {errors.username && <p className={styles.RegisterError}>{errors.username.message?.toString()}</p>}
                </div>
                <label className={styles.RegisterLabel} htmlFor="">
                    Create password
                </label>
                
                <div className={styles.RegisterInputWrapper}>
                    <Image  className={styles.RegisterImageInput} src='/assets/images/icon-password.svg' alt='icon-password' height={16} width={16} />
                    <input type='password' style={errors.password1 ? { border: '#EC5757 1px solid' } : {}}    {...register('password1')} className={styles.RegisterInput}  placeholder='At least 8 characters' />
                    {errors.password1 && <p className={styles.RegisterError}>{errors.password1.message?.toString()}</p>}
                </div>
                <label className={styles.RegisterLabel} htmlFor="">
                    Confirm password
                </label>
                
                <div className={styles.RegisterInputWrapper}>
                    <Image  className={styles.RegisterImageInput} src='/assets/images/icon-password.svg' alt='icon-password' height={16} width={16} />
                    <input type='password' style={errors.password2 ? { border: '#EC5757 1px solid' } : {}}    {...register('password2')} className={styles.RegisterInput}  placeholder='At least 8 characters' />
                    {errors.password2 && <p className={styles.RegisterError}>{errors.password2.message?.toString()}</p>}
                </div>
                <p className={styles.RegisterP}>
                Password must contain at least 8 characters
                </p>
                <button className={styles.RegisterButton}>Create new account</button>
                <div className={styles.RegisterDiv}>
                    Already have a account
                    <Link href={'/login'} className={styles.RegisterNoAccount}>
                        Login
                    </Link>
                </div>
            </form>
        </div>
    </div>
    )
}

export default Register
