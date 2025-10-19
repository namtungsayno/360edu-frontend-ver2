import { motion } from "framer-motion";
export default function PageTransition({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="p-6"
    >
      {children}
    </motion.main>
  );
}
