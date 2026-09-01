import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949]">
      <div className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl p-8 shadow-2xl border border-white/50">
        <Mail className="h-10 w-10 text-blue-600" />
        <h1 className="mt-4 text-3xl font-black text-gray-900">Reset password</h1>
        <p className="mt-2 text-sm text-gray-600">
          Password reset by email is coming soon. For now, please contact AM38 support on WhatsApp to reset your account password.
        </p>
        <a
          href="https://wa.me/23058357166"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex h-12 items-center justify-center rounded-xl bg-green-500 font-bold text-white hover:bg-green-600 transition"
        >
          Contact Support on WhatsApp
        </a>
        <Link to="/login" className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-red-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>
      </div>
    </div>
  );
}