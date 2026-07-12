import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Search, Bell, ChevronDown, User, LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

const pathLabels = {
  '/': ['Dashboard'],
  '/organization': ['Organization Setup'],
  '/assets': ['Asset Directory'],
  '/assets/register': ['Asset Directory', 'Register Asset'],
  '/allocation': ['Asset Allocation & Transfer'],
  '/booking': ['Resource Booking'],
  '/maintenance': ['Maintenance Management'],
  '/audit': ['Asset Audit'],
  '/reports': ['Reports & Analytics'],
  '/activity': ['Activity Logs'],
  '/notifications': ['Notifications'],
};

const roleLabels = {
  admin: 'Admin',
  asset_manager: 'Asset Manager',
  department_head: 'Dept. Head',
  employee: 'Employee',
};

const roleColors = {
  admin: 'bg-[#0F766E] text-white',
  asset_manager: 'bg-[#059669] text-white',
  department_head: 'bg-[#475569] text-white',
  employee: 'bg-[#64748B] text-white',
};

export default function Topbar() {
  const { currentRole, setCurrentRole, ROLES, unreadCount, sidebarOpen } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const crumbs = pathLabels[location.pathname] || [location.pathname.slice(1)];

  return (
    <motion.header
      initial={false}
      animate={{ marginLeft: sidebarOpen ? 256 : 72 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="sticky top-0 z-30 h-16 bg-white border-b border-[#DCE5EA] flex items-center justify-between px-6"
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-[#DCE5EA]">/</span>}
            <span className={i === crumbs.length - 1 ? 'text-[#0F172A] font-medium' : 'text-[#64748B]'}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search assets, employees..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-64 bg-[#F4F7F9] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0F766E] focus:bg-white transition-all"
          />
        </div>

        {/* Role Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${roleColors[currentRole]}`}>
              <Shield className="w-3.5 h-3.5" />
              {roleLabels[currentRole]}
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-[#64748B]">Switch Role (Demo)</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ROLES.map(role => (
              <DropdownMenuItem key={role} onClick={() => setCurrentRole(role)} className="text-sm">
                <span className={`w-2 h-2 rounded-full mr-2 ${currentRole === role ? 'bg-[#0F766E]' : 'bg-[#DCE5EA]'}`} />
                {roleLabels[role]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Link to="/notifications" className="relative p-2 rounded-xl hover:bg-[#F4F7F9] transition-colors">
          <Bell className="w-5 h-5 text-[#64748B]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-[#DC2626] text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F4F7F9] transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#0F766E] flex items-center justify-center">
                <span className="text-white text-sm font-semibold">JS</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">James Smith</p>
              <p className="text-xs text-[#64748B]">james.smith@assetflow.com</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm">
              <User className="w-4 h-4 mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm text-[#DC2626]" onClick={() => navigate('/auth/login')}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
