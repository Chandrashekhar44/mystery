import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request, context: { params: Promise<{ email: string }> }) {
  try {
    await dbConnect();

    const params =await context.params;
    const email = params.email;

    const { password } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: "Email not provided in URL" }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Password reset successful" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to reset password" }),
      { status: 500 }
    );
  }
}
