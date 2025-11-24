import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

import et from "elementtree";

export async function POST(req: NextRequest) {
  try {
    console.log("POST message");
    const body = await req.json();
    console.log(body);

    // var XML = et.XML;
    // var ElementTree = et.ElementTree;
    // var element = et.Element;
    // var subElement = et.SubElement;

    let etree;
    const parseXMLFolder = "../../parseXML";
    fs.readdirSync(parseXMLFolder).forEach((XML) => {
      console.log(XML);
      const data = fs.readFileSync(`../../parseXML/${XML}`).toString();
      etree = et.parse(data);
      console.log(etree.getroot());
      etree = etree.getroot().getchildren();
    });

    return NextResponse.json({
      message: "Success",
      result: etree,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Не удалось сформировать письмо. Повторите попытку позже" },
      { status: 400 }
    );
  }
}
