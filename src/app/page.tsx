"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/utils";

export default function Home() {
  const [file, setFile] = useState<File>();
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const onCodeEditChange = (val: any) => {
    setCode(val);
  };

  const loadSample = async () => {
    setResult("");
    const response = await fetch("/api/code?source=sample_code");
    const data = await response.json();
    setCode(data.data.code);
    setError("");
    const isConfirm = confirm("Do you want to also download a sample file?");
    if (isConfirm) {
      navigate(`${window.origin}/sample-file.xlsx`, true);
    }
  };

  const resetCode = async () => {
    setResult("");
    const response = await fetch("/api/code?source=default_code");
    const data = await response.json();
    setCode(data.data.code);
    setError("");
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setFile(e.target.files?.[0] as File);
  };

  const parseFile = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file as File);
      formData.append("code", code);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      if (!data.success) {
        setError(data.message);
      }
      setResult(data.data);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    resetCode();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center overflow-auto">
      <Card className="my-5 w-4/5">
        <CardHeader>
          <CardTitle>ExcelJs Parser Playground</CardTitle>
          <CardDescription>A parser playground for ExcelJs Nodejs libraray.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="md: m-auto mb-4 flex flex-col justify-between gap-3 md:flex-row">
            <div className="col-span-full md:col-span-6 lg:col-span-6">
              <Input id="file" type="file" onChange={onFileChange} />
            </div>
            <div className="col-span-full md:col-span-6 lg:col-span-6">
              <div className="flex flex-row gap-1.5">
                <Button className="text-sm" onClick={loadSample}>
                  Load Sample
                </Button>
                <Button className="text-sm" onClick={resetCode}>
                  Reset
                </Button>
                <Button className="text-sm" onClick={parseFile}>
                  Parse
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 w-full rounded-sm border-2 border-red-700 bg-red-400 py-4 text-center font-mono text-white">
              {error}
            </div>
          )}

          <CodeMirror
            value={code}
            height="400px"
            extensions={[javascript()]}
            onChange={onCodeEditChange}
            theme="dark"
          />

          {result && (
            <div className="mt-5 max-h-[500px] w-full overflow-auto rounded-sm border-2 border-gray-400 bg-gray-200 p-[10px]">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
