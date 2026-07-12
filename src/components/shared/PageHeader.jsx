import React from 'react';
import { motion } from 'framer-motion';

export default function PageHeader({ title, description, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">{title}</h1>
        {description && <p className="text-sm text-[#64748B] mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </motion.div>
  );
}
