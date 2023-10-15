import { NextResponse } from "next/server";
import Excel from "exceljs";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const code: string | null = data.get("code") as unknown as string;

    if (!file || (file && `${file}` === "undefined")) {
      return NextResponse.json({
        success: false,
        message: "No file provided",
      });
    }

    if (!code) {
      return NextResponse.json({
        success: false,
        message: "No code provided",
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const workbook = new Excel.Workbook();
    const wb = await workbook.xlsx.load(buffer);

    const stringToFunction = new Function("return " + code.toString())();
    const result = await stringToFunction(wb);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.log(JSON.stringify(error));
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
