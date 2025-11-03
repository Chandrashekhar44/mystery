import {z} from "zod";

export const AcceptMessageSchema = z.object({
   content: z.string()
            .min(10,{message:"content must be at leat 10 characters"})
            .max(300,{message:'Content must be no longer then 300 characters'})
})