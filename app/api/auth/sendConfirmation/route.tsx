import { connectMongoDB } from "@/app/libs/MongoConnect";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import jwt, { Secret } from "jsonwebtoken";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    //ищем пользователя с таким же email в б.д. и если он есть,
    //  то отправляем ошибку "Пользовватель с таким email уже зарегистрирован"

    const body = await req.json();

    const secret = process.env.SECRET as Secret;

    const hashedPassword = await hash(body.password, 12);

    const token = jwt.sign(
      { email: body.email, name: body.name, password: hashedPassword },
      secret,
      { expiresIn: 60 * 60 }
    );

    let transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.mail.ru",
      auth: {
        user: "pav.345@mail.ru",
        pass: "LJ1YPtKcVshZxGuE9cgB",
      },
      secure: true,
    });

    await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });

    const mailData = {
      from: "pav.345@mail.ru",
      to: body.email,
      subject: `Message From paHa store Admin`,
      text: ` | Sent from: ${body.email}`,
      html: `<div>Для подтверждения регистрации перейдите по ссылке</div> 

      <a href=${process.env.HOST}/auth/confirmUserSignIn/${token}>Подтверждение регистрации</a>
      <p>${process.env.HOST}/auth/confirmUserSignIn/${token}</p>
  `,
    };

    await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailData, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(info);
        }
      });
    });

    return NextResponse.json({
      message: "Success",
      result: `Письмо с подтверждением регистрации отправлено на почту ${body.email}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Не удалось сформировать письмо. Повторите попытку позже" },
      { status: 400 }
    );
  }
}
