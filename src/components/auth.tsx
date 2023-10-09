// import { useState } from 'react'
import React, { useState } from 'react';
import { Login } from './login'
import { Button, buttonVariants } from './ui/button'
import { cn } from '../lib/utils'
import { Register } from './register';
import Link from 'next/link';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function Auth() {
  const [login, setLogin] = useState(false)

  return (
    
    <>
   

    <div className="container relative bg-white h-screen flex-col items-center justify-center md:grid  lg:grid-cols-2 lg:px-0">
      <Button variant={'ghost'}
        onClick={()=>{setLogin(prevLogin => !prevLogin)}}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        {login && 'Register' ||'Login'}
      </Button>
      <div className="relative  h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex hidden">
        <div className="absolute inset-0 bg-zinc-900 "  />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href='/'><Image
                    src={'/assets/logo-light.svg' }                    alt=""
                    width={152}
                    height={26}
                    /></Link>
          
        </div>
        <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This Kanban Task manager has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Lucas Zebre</footer>
            </blockquote>
          </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          
        <Tabs defaultValue="login" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="login">Login</TabsTrigger>
    <TabsTrigger value="register">Register</TabsTrigger>
  </TabsList>
  <TabsContent value="login"><Login /></TabsContent>
  <TabsContent value="register"><Register /></TabsContent>
</Tabs>
          
        </div>
      </div>
    </div>

    
  </>
    
  )
}

export default Auth