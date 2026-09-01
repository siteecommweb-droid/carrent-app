import { ReactNode } from "react";

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function PageShell({
  title,
  subtitle,
  children,
}: PageShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* GLOBAL BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/images/backgrounds/global-luxury-bg.jpg')",
          }}
        />

        {/* LIGHTER OVERLAY */}
        <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" />

        {/* CYAN GLOW */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
      </div>

      {/* PAGE CONTENT */}
      <div className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto">

        {/* TITLE */}
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            {title}
          </h1>

          {subtitle && (
            <p className="text-white/75 mt-4 text-lg max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}