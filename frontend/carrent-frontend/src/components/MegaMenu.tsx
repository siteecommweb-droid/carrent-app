import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function MegaMenu() {

  const sections = [
    {
      title: "Main",
      items: [
        ["Home", "/"],
        ["Fleet", "/cars"],
        ["Explore", "/explore"],
        ["Partners", "/partners"],
      ],
    },

    {
      title: "Support",
      items: [
        ["FAQ", "/faq"],
        ["Support", "/support"],
        ["About", "/about"],
      ],
    },

    {
      title: "Legal",
      items: [
        ["Terms", "/terms"],
        ["Privacy", "/privacy"],
        ["Refund", "/refund"],
        ["GDPR", "/gdpr"],
        ["Legal", "/legal"],
      ],
    },

    {
      title: "Account",
      items: [
        ["Login", "/login"],
        ["Register", "/register"],
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 14 }}
      className="absolute top-[85px] left-1/2 -translate-x-1/2 w-[900px] rounded-[32px] border border-white/10 bg-black/75 backdrop-blur-3xl shadow-[0_30px_120px_rgba(0,0,0,0.55)] p-8 z-[99999]"
    >

      <div className="grid grid-cols-4 gap-8">

        {sections.map((section) => (
          <div key={section.title}>

            <div className="text-lg font-black mb-5 bg-gradient-to-r from-cyan-300 to-red-300 bg-clip-text text-transparent">
              {section.title}
            </div>

            <div className="space-y-3">

              {section.items.map(([label, path]) => (
                <Link
                  key={path}
                  to={path}
                  className="block text-white/75 hover:text-white hover:translate-x-1 transition-all"
                >
                  {label}
                </Link>
              ))}

            </div>
          </div>
        ))}

      </div>
    </motion.div>
  );
}