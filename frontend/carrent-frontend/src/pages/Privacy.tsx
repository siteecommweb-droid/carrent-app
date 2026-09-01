import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";

export default function Privacy() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAPI("/privacy-policies").then((res: any) => {
      setData(res.data[0]);
    });
  }, []);

  if (!data) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto py-16">
      <h1 className="text-4xl font-black">{data.title}</h1>
      <div className="mt-6 text-slate-600 whitespace-pre-line">
        {data.content}
      </div>
    </div>
  );
}




