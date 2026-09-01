import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FuturisticCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  delay?: number;
}

export const FuturisticCard = ({ 
  children, 
  className = '', 
  glow = true, 
  delay = 0 
}: FuturisticCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm p-6 ${className}`}
    >
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};