import { NextResponse } from "next/server";
import Excel from "exceljs";

export async function POST(request: Request) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;
  const code: string | null = data.get("code") as unknown as string;

  if (!file) {
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

  try {
    const result = await stringToFunction(wb);
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
