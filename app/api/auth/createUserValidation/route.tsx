import User from "@/app/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectMongoDB } from "@/app/libs/MongoConnect";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);

    await connectMongoDB();

    // const hashedPassword = await hash(body.password, 12);

    // const addedUser = await User.create({
    //   name: body.name,
    //   email: body.email,
    //   password: hashedPassword,
    // });

    const addedUser = await User.find({ email: body.email });
    console.log(addedUser);
    if (addedUser.length !== 0) {
      return NextResponse.json({ message: "Такой пользователь уже существует" }, { status: 400 });
    }

    if (body.name.length < 6 || body.password.length < 6) {
      return NextResponse.json(
        { message: "Логин или пароль должны быть длиннее 6 символов" },
        { status: 422 }
      );
    }
    return NextResponse.json({ message: "Success", result: addedUser });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ message: "Такой пользователь уже существует" }, { status: 400 });
    } else {
      return NextResponse.json(
        { message: "Длинна логина/пароля должна быть более 6 символов" },
        { status: 422 }
      );
    }
  }
}
