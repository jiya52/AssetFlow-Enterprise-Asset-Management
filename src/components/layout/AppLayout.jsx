import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useApp } from '@/contexts/AppContext';

export default function AppLayout() {
  const { sidebarOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#F4F7F9]">
      <Sidebar />
      <Topbar />
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 256 : 72 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="p-6 min-h-[calc(100vh-64px)]"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
