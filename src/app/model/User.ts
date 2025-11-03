import mongoose ,{Document,Mongoose,Schema} from "mongoose";


    export interface Message extends Document{
        content : string,
        createdAt:Date
    }

    const MessageSchema : Schema<Message>= new mongoose.Schema({
        content:{
            type: String,
            required:true
        },
        createdAt:{
            type: Date,
            required: true,
            default:Date.now
        }
    })

    export interface user extends Document{
        email:String,
        userName:String,
        password:String,
        verifyCode:String,
        isVerified:Boolean,
        isAcceptingMessages:Boolean,
        verifyCodeExpiry:Date,
        messages:Message[]
        
    }

    const userSchema : Schema<user> = new mongoose.Schema({
        email:{
            type: String,
           required :[ true,"Email is required"],
           unique:true,
           match:[/.+\@.+\..+/,"Input a valid email ID"]
        },
        userName:{
            type : String,
            required:[true,"Username is required"],
            unique:true,
            trim:true
        },
        password:{
            required:[true,"Password is required"],
            type:String,
        },
        verifyCode:{
            type: String,
            required:[true,"Verifycode is required"],
        },
        verifyCodeExpiry:{
            type:Date,
            required:[true,"verify code expiry is required"],
    
        },
        isVerified:{
            type:Boolean,
           default:false
    
        },
        isAcceptingMessages:{
            type:Boolean,
           default:false
    
        },
        messages:[MessageSchema]
    })

    const UserModel = (mongoose.models.user as mongoose.Model<user>) || mongoose.model<user>("User",userSchema)
    
