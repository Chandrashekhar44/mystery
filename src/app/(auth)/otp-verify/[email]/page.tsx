'use client'

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { ApiResponse } from "@/types/ApiResponse";
import { otpVerificationSchema } from "@/schemas/otpVerificationSchema";



export default function OTPVerificationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof otpVerificationSchema>>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: { otp: '' },
  });

 const params = useParams();
const emailParam = params.email;
const email = Array.isArray(emailParam) ? emailParam[0] : emailParam;

if (!email) {
  toast({
    title: "Error",
    description: "Email not found in URL",
    variant: "destructive",
  });
  return null;
}

 const onSubmit = async (data: z.infer<typeof otpVerificationSchema>) => {
  setIsSubmitting(true);

  try {

const response = await axios.post<ApiResponse>(
  `/api/otp-verification/${email}`,
  data
);



    toast({
      title: "Success",
      description: response.data.message,
    });

router.replace(`/reset-password/${email}`);

  } catch (error) {
    console.error("OTP verification error:", error);
    const axiosError = error as AxiosError<ApiResponse>;
    const errorMessage = axiosError.response?.data.message || "Failed to verify OTP";

    toast({
      title: "Failed",
      description: errorMessage,
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            True Feedback
          </h1>
          <p className="mb-4">Enter the OTP sent to your email</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="otp"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <Input {...field} type="text" maxLength={6} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
