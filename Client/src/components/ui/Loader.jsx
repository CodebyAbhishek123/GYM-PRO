import { motion } from "framer-motion";

const Loader = ({ size = "md", color = "blue", text = "" }) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  const colorClasses = {
    blue: "border-blue-600 dark:border-blue-500",
    emerald: "border-emerald-600 dark:border-emerald-500",
    white: "border-white",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <div className="relative">
        {/* Outer Glowing Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-t-transparent border-r-transparent ${colorClasses[color] || colorClasses.blue} shadow-sm`}
        />
        
        {/* Inner Counter-Rotating Pulsing Core */}
        <motion.div
          animate={{ scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-2 bg-blue-500/25 rounded-full blur-[2px]"
        />
      </div>
      
      {text && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default Loader;
