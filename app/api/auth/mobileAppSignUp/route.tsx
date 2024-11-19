import User from "@/app/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectMongoDB } from "@/app/libs/MongoConnect";
import { decode } from "jsonwebtoken";
import { UserType } from "@/app/types";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const secret = process.env.SECRET;
    const data = {
      name: "paha345",
      email: "pav.345@mail.ru",
    };

    let token;

    if (secret) {
      token = jwt.sign(data, secret);
    }

    const dataTest = jwt.sign(
      {
        username: "John",
        email: "john@email.com",
      },
      "secret",
      {
        expiresIn: "1h",
      }
    );

    const signature =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG4iLCJlbWFpbCI6ImpvaG5AZW1haWwuY29tIiwiaWF0IjoxNzI4OTg2Nzc1LCJleHAiOjE3Mjg5OTAzNzV9.ZyG3tPRCsez31H5OkzggeMzChPYYBGHz9R0akeSlp7Q";

    console.log(jwt.verify(signature, "secret"));
    // const body = await req.json();

    // await connectMongoDB();

    // console.log("Body" + decode(body.password));
    // console.log(body);
    // // const userData = decode()

    // console.log("Hash" + hashedPassword);

    // const addedUser = await User.create({
    //   name: body.name,
    //   email: body.email,
    //   password: body.password,
    //   userType: UserType.User,
    // });

    return NextResponse.json({ message: "Success", result: dataTest });
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
