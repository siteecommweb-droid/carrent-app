import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";

export default function Contact() {
  const [data, setData] = useState<any>(null);
  const lang = localStorage.getItem("preferredLanguage") || "en";

  useEffect(() => {
    fetchAPI("/contact-pages").then((res: any) => {
      setData(res.data[0]);
    });
  }, []);

  if (!data) return <div className="p-10 text-center text-white">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-16 space-y-6 text-white">
      <h1 className="text-4xl font-black">
        {lang === "fr" ? "Contactez-nous" : "Contact us"}
      </h1>

      <div className="space-y-3 bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
        <p className="text-lg">
          <span className="font-bold">{lang === "fr" ? "Email" : "Email"}:</span> {data.email}
        </p>
        <p className="text-lg">
          <span className="font-bold">{lang === "fr" ? "Téléphone" : "Phone"}:</span> {data.phone}
        </p>
        <p className="text-lg">
          <span className="font-bold">{lang === "fr" ? "Adresse" : "Address"}:</span> {data.address}
        </p>
      </div>

      {/* Back button */}
      <button
        onClick={() => window.history.back()}
        className="mt-6 text-sm text-gray-400 hover:text-white transition"
      >
        ← {lang === "fr" ? "Retour" : "Back"}
      </button>
    </div>
  );
}




