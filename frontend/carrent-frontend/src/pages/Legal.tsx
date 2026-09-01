import { Link } from "react-router-dom";

export default function Legal() {
  return (
    <div className="min-h-screen px-6 py-32 text-white">

      <div className="max-w-6xl mx-auto bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[32px] p-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/30 to-red-600/30 border border-white/10 mb-6">
          ⚖️ Legal Center
        </div>

        <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-blue-400 via-white to-red-400 bg-clip-text text-transparent">
          Legal Information
        </h1>

        <p className="text-white/75 text-lg leading-8 max-w-4xl">
          Access all AM38 legal documentation, compliance policies,
          privacy information, refund conditions and customer protection
          agreements through the links below.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-12">

          <Link
            to="/terms"
            className="p-8 rounded-[28px] bg-white/5 border border-white/10 hover:border-cyan-400/40 transition group"
          >
            <div className="text-3xl mb-4">📄</div>

            <h2 className="text-2xl font-black mb-2 group-hover:text-cyan-300">
              Terms & Conditions
            </h2>

            <p className="text-white/60">
              Vehicle rental rules and service conditions.
            </p>
          </Link>

          <Link
            to="/privacy"
            className="p-8 rounded-[28px] bg-white/5 border border-white/10 hover:border-cyan-400/40 transition group"
          >
            <div className="text-3xl mb-4">🔒</div>

            <h2 className="text-2xl font-black mb-2 group-hover:text-cyan-300">
              Privacy Policy
            </h2>

            <p className="text-white/60">
              User privacy and personal data protection.
            </p>
          </Link>

          <Link
            to="/refund"
            className="p-8 rounded-[28px] bg-white/5 border border-white/10 hover:border-cyan-400/40 transition group"
          >
            <div className="text-3xl mb-4">💳</div>

            <h2 className="text-2xl font-black mb-2 group-hover:text-cyan-300">
              Refund Policy
            </h2>

            <p className="text-white/60">
              Cancellation and payment refund conditions.
            </p>
          </Link>

          <Link
            to="/gdpr"
            className="p-8 rounded-[28px] bg-white/5 border border-white/10 hover:border-cyan-400/40 transition group"
          >
            <div className="text-3xl mb-4">🛡️</div>

            <h2 className="text-2xl font-black mb-2 group-hover:text-cyan-300">
              GDPR Compliance
            </h2>

            <p className="text-white/60">
              European data protection compliance details.
            </p>
          </Link>

        </div>

      </div>
    </div>
  );
}