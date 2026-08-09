import { motion } from "framer-motion";

// Stagger Container Variants
export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

// Stagger Item Variants (slide up + fade in)
export const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Horizontal slide/stagger variants (for items entering from side, e.g. menu links)
export const slideInVariants = {
  hidden: { opacity: 0, x: -15 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 16
    }
  }
};

export const StaggerContainer = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className = "" }) => {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

export const HoverCard = ({ children, className = "", onClick }) => {
  return (
    <motion.div
      whileHover={{ 
        y: -4, 
        scale: 1.015,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)"
      }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`transition-shadow duration-300 ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
