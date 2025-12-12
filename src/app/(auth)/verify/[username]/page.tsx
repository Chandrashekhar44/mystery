import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";






export async function verifyAccount(){

    const params = useParams<{username :string}>()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema)
    })

    const onSubmit = async(data : z.infer<typeof verifySchema>) =>{
   
        

    }
}