// Add Framer Motion entrance animations to all pages
// This file is conceptually representing a final polish pass
import { motion } from 'framer-motion';

export const PageTransition = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
    >
        {children}
    </motion.div>
);
