import { NextResponse } from "next/server";
import defaultCode from "@/data/default_code";
import sampleCode from "@/data/sample_code";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const source = url.searchParams.get("source");

  if (!source) {
    return NextResponse.json({
      success: false,
      message: "No source parameter given",
    });
  }

  if (!["default_code", "sample_code"].includes(source)) {
    return NextResponse.json({
      success: false,
      message: "Invalid source parameter given",
    });
  }

  let code = "";
  if (source === "default_code") {
    code = defaultCode.toString();
  } else if (source === "sample_code") {
    code = sampleCode.toString();
  }

  return NextResponse.json({
    success: true,
    data: code,
  });
}
