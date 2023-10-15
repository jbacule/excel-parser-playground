import { NextResponse } from "next/server";
import { defaultCode, sampleCode } from "@/data/code";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const source = url.searchParams.get("source");

  if (!source) {
    return NextResponse.json({
      success: false,
      message: "No source query parameter given",
    });
  }

  if (!["default_code", "sample_code"].includes(source)) {
    return NextResponse.json({
      success: false,
      message: "Invalid source query parameter given",
    });
  }

  let code = "";
  if (source === "default_code") {
    code = defaultCode.toString();
  } else if (source === "sample_code") {
    code = sampleCode.toString();
  }

  const host = request.headers.get("host");

  return NextResponse.json({
    success: true,
    data: source === "default_code" ? { code } : { code, file: `${host}/sample-file.xlsx` },
  });
}
