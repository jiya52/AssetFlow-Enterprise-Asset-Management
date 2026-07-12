import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import {
  LayoutDashboard, Building2, Package, ArrowLeftRight, CalendarDays,
  Wrench, ClipboardCheck, BarChart3, ScrollText, Bell, ChevronLeft,
  ChevronRight, Layers
} from 'lucide-react';

const allNav = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'asset_manager', 'department_head', 'employee'] },
  { path: '/organization', label: 'Organization', icon: Building2, roles: ['admin'] },
  { path: '/assets', label: 'Assets', icon: Package, roles: ['admin', 'asset_manager', 'department_head'] },
  { path: '/allocation', label: 'Allocation', icon: ArrowLeftRight, roles: ['admin', 'asset_manager', 'department_head'] },
  { path: '/booking', label: 'Booking', icon: CalendarDays, roles: ['admin', 'asset_manager', 'department_head', 'employee'] },
  { path: '/maintenance', label: 'Maintenance', icon: Wrench, roles: ['admin', 'asset_manager', 'department_head', 'employee'] },
  { path: '/audit', label: 'Audit', icon: ClipboardCheck, roles: ['admin', 'asset_manager'] },
  { path: '/reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'asset_manager', 'department_head'] },
  { path: '/activity', label: 'Activity Logs', icon: ScrollText, roles: ['admin', 'asset_manager'] },
  { path: '/notifications', label: 'Notifications', icon: Bell, roles: ['admin', 'asset_manager', 'department_head', 'employee'] },
];

export default function Sidebar() {
  const { currentRole, sidebarOpen, setSidebarOpen, unreadCount } = useApp();
  const location = useLocation();

  const navItems = allNav.filter(item => item.roles.includes(currentRole));

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 256 : 72 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed left-0 top-0 bottom-0 z-40 bg-white border-r border-[#DCE5EA] flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#DCE5EA]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#0F766E] flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-lg text-[#0F172A] whitespace-nowrap overflow-hidden"
              >
                AssetFlow
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative
                  ${isActive
                    ? 'bg-[#E6F7F6] text-[#0F766E]'
                    : 'text-[#64748B] hover:bg-[#F4F7F9] hover:text-[#0F172A]'
                  }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.path === '/notifications' && unreadCount > 0 && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#DC2626] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-[#DCE5EA]">
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[#64748B] hover:bg-[#F4F7F9] hover:text-[#0F172A] transition-colors text-sm"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          {sidebarOpen && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
