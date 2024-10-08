import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SchemaRegister } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Icons } from "./icons"
import { useRegister } from "@/utils/useRegister"
import React, { SetStateAction, useState } from "react"
import toast from "react-hot-toast"



export function Register() {
    const [isLoading,setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof SchemaRegister>>({
        resolver: zodResolver(SchemaRegister),
        defaultValues: {
          email: "",
          
        },
      })


      const registerMutation = useRegister();

      const handleRegister = (email: string, password: string, fullname: string) => {
        registerMutation.mutate({ email, password, fullname }, {
          onSuccess: (data) => {
            toast.success("User registered sucessfully")
          },
          onError: (error) => {
            console.error(error);
          }
        });
      };

      
      function onSubmit(values: z.infer<typeof SchemaRegister>) {
       setIsLoading(true)
    const dd =    handleRegister(values.email,
            values.password,
            values.name,
        )

        
        setIsLoading(false)
      }
  return (
        
            <Card className="p-2">
        <CardHeader className="space-y-1">
            <CardTitle className="text-2xl ">Register an account</CardTitle>
            <CardDescription >
            Enter your email below to register your account
            </CardDescription>
        </CardHeader>
        <Form {...form} >
        <form  onSubmit={form.handleSubmit(onSubmit)} className="p-3 content-start items-start flex-col space-y-8">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem className="flex-col items-start content-start w-full">
                <FormLabel className="text-start w-full" >Name</FormLabel>
                <FormControl>
                    <Input placeholder="lucas" {...field} />
                </FormControl>
                
                <FormMessage />
                </FormItem>
            )}
            />   <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem className="flex-col items-start content-start w-full">
                <FormLabel className="text-start w-full" >Email</FormLabel>
                <FormControl>
                    <Input type="email"  placeholder="lucas1@gmail.com" {...field} />
                </FormControl>
                
                <FormMessage />
                </FormItem>
            )}
            /> 
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem className="w-full">
                <FormLabel className="text-start items-start w-full" >Password</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="shadcn@dd11" {...field} />
                </FormControl>
                
                <FormMessage />
                </FormItem>
            )}
            />
            <Button className="w-full"> {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}Register</Button>
        </form>
        </Form>
       
        </Card>
        
        
    )
}
