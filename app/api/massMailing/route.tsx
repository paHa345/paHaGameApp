import { NextRequest, NextResponse } from "next/server";
// import { promises as fs } from "fs";
import xlsx from "node-xlsx";
import fs from "fs";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  console.log("start");
  console.log(process.cwd());
  try {
    let transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.armgs.team",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      secure: true,
    });

    const reestr = await fs.readFileSync("../../mailingTest/reestr/test222.txt", "utf-8");
    const clearedReestr = reestr.split(",").map((el) => el.trim());

    const filesList = fs.readdirSync("../../mailingTest/files").map((file) => {
      return file;
    });

    interface ISendMailProps {
      email?: string;
      text?: string;
      fileName?: string;
    }

    const sendMail = async function ({ email, text, fileName }: ISendMailProps) {
      // console.log("Send Mail");
      // console.log(email);
      // console.log(text);
      // console.log(fileName);
      const mailData = {
        from: "54@rosstat.gov.ru",
        to: `${email}`,
        subject: `${text}`,
        // text: ` | Sent from: TEST`,
        bcc: "54@rosstat.gov.ru",
        html: `<div>${text}</div>`,
        attachments: [
          {
            filename: `${fileName}`,
            path: `../../mailingTest/files/${fileName}`,
            contentType: "application/pdf",
          },
        ],
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
      fs.renameSync(`../../mailingTest/files/${fileName}`, `../../mailingTest/success/${fileName}`);
      console.log(`Письмо успешно отправлено: ${email}`);
    };

    for await (const el of clearedReestr) {
      try {
        const promise = await new Promise((resolve, reject) => {
          filesList.forEach((file) => {
            // проверяем наличие файла, адрес которого есть в реестра
            if (file.includes(el)) {
              sendMail({
                email: file.split("_")[0],
                text: file.split("_")[1].slice(0, -4),
                fileName: file,
              });
            } else {
              // throw new Error(`Не найден файл с указанной электронной почтой: ${el} `);
              // reject("Error");
            }
          });

          setTimeout(() => {
            resolve("Go to next message");
          }, 10000);
        });
      } catch (error: any) {
        console.log(error.message);
      }
    }

    // const workSheetsFromBuffer = xlsx.parse(fs.readFileSync("../../mailingTest/987.xlsx"));

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

    return NextResponse.json({
      message: "Success",
      result: clearedReestr,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Не удалось сформировать письмо. Повторите попытку позже" },
      { status: 400 }
    );
  }
}
