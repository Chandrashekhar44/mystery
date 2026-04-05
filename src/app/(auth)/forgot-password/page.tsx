'use client'
import { useRouter } from "next/navigation";
import z from "zod";
import { useForm } from "react-hook-form";
import {forgotPasswordSchema} from "@/schemas/forgotPasswordSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";



export default function SignInForm() {
    const router = useRouter()
    const {toast} = useToast();
    const [isSubmitting,setisSubmitting] = useState(false);

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email:'',
        }
    })


     const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setisSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/forgot-password', data);
      

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace(`/otp-verify/${data.email}`);

      setisSubmitting(false);
    }  catch (error) {
  console.error('Error during forgot password request:', error);

  const axiosError = error as AxiosError<ApiResponse>;

  const errorMessage =
    axiosError.response?.data.message ||
    'There was a problem sending the reset email. Please try again.';

  toast({
    title: 'Failed to send reset email',
    description: errorMessage,
    variant: 'destructive',
  });

  setisSubmitting(false);
}

  };


    return (<div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                     True Feedback
                </h1>
                <p className="mb-4">To change password enter the Email</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <Input {...field} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className='w-full' type="submit" disabled={isSubmitting}
                    >{isSubmitting ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Please wait
                                    </>
                                  ) : (
                                    'Verify Email'
                                  )}</Button>
                </form>
            </Form>
            
        </div>
    </div>
    );


} 