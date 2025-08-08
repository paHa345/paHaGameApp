import User from "@/app/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectMongoDB } from "@/app/libs/MongoConnect";
import { decode } from "jsonwebtoken";
import { UserType } from "@/app/types";

export async function POST(req: NextRequest) {
  try {
    console.log("user cretaed");
    const body = await req.json();

    await connectMongoDB();

    // console.log("Body" + decode(body.password));
    // console.log(body);
    // // const userData = decode()

    // console.log("Hash" + hashedPassword);

    const addedUser = await User.create({
      name: body.name,
      email: body.email,
      password: body.password,
      userType: UserType.User,
    });

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
