import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Link } from 'react-router-dom';
import KPICard from '@/components/shared/KPICard';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import {
  Package, Users, Wrench, CalendarDays, ArrowLeftRight, Clock,
  Plus, BookOpen, AlertTriangle, Activity
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

const COLORS = ['#0F766E', '#059669', '#475569', '#D97706', '#64748B', '#DC2626', '#94A3B8'];

export default function Dashboard() {
  const { assets, bookings, maintenance, transfers, notifications, departments } = useApp();

  const available = assets.filter(a => a.status === 'available').length;
  const allocated = assets.filter(a => a.status === 'allocated').length;
  const maintToday = maintenance.filter(m => m.status === 'in_progress' || m.status === 'technician_assigned').length;
  const activeBookings = bookings.filter(b => b.status === 'upcoming' || b.status === 'ongoing').length;
  const pendingTransfers = transfers.filter(t => t.status === 'requested').length;
  const overdueCount = 12;

  const statusDist = [
    { name: 'Available', value: assets.filter(a => a.status === 'available').length },
    { name: 'Allocated', value: assets.filter(a => a.status === 'allocated').length },
    { name: 'Reserved', value: assets.filter(a => a.status === 'reserved').length },
    { name: 'Maintenance', value: assets.filter(a => a.status === 'under_maintenance').length },
    { name: 'Lost', value: assets.filter(a => a.status === 'lost').length },
    { name: 'Retired', value: assets.filter(a => a.status === 'retired').length },
  ];

  const deptAlloc = departments.slice(0, 8).map(d => ({
    name: d.code,
    assets: assets.filter(a => a.department === d.id).length,
  }));

  const recentNotifs = notifications.slice(0, 5);

  const recentActivity = [
    { time: '2 min ago', action: 'Asset allocated', detail: 'MacBook Pro 16" → James Smith', color: '#0F766E' },
    { time: '15 min ago', action: 'Maintenance approved', detail: 'Dell XPS 15 — Screen flickering', color: '#059669' },
    { time: '1 hr ago', action: 'Booking confirmed', detail: 'Meeting Room A — Team Meeting', color: '#475569' },
    { time: '2 hr ago', action: 'Transfer completed', detail: 'HP EliteBook 840 → Marketing', color: '#D97706' },
    { time: '3 hr ago', action: 'Audit started', detail: 'IT Department Q3 Audit', color: '#64748B' },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Real-time operational overview" />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <KPICard title="Available" value={available} icon={Package} color="#0F766E" index={0} />
        <KPICard title="Allocated" value={allocated} icon={Users} color="#475569" index={1} />
        <KPICard title="Maintenance" value={maintToday} icon={Wrench} color="#D97706" index={2} />
        <KPICard title="Active Bookings" value={activeBookings} icon={CalendarDays} color="#059669" index={3} />
        <KPICard title="Pending Transfers" value={pendingTransfers} icon={ArrowLeftRight} color="#64748B" index={4} />
        <KPICard title="Overdue Returns" value={overdueCount} icon={Clock} color="#DC2626" index={5} />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link to="/assets/register">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0F766E] text-white rounded-xl text-sm font-medium hover:bg-[#0E6B64] transition-colors">
            <Plus className="w-4 h-4" /> Register Asset
          </motion.button>
        </Link>
        <Link to="/booking">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#DCE5EA] text-[#0F172A] rounded-xl text-sm font-medium hover:bg-[#F4F7F9] transition-colors">
            <BookOpen className="w-4 h-4" /> Book Resource
          </motion.button>
        </Link>
        <Link to="/maintenance">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#DCE5EA] text-[#0F172A] rounded-xl text-sm font-medium hover:bg-[#F4F7F9] transition-colors">
            <Wrench className="w-4 h-4" /> Raise Maintenance
          </motion.button>
        </Link>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Asset Status Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#DCE5EA] p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Asset Status Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={statusDist} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                {statusDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #DCE5EA', fontSize: 13 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department Allocation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-[#DCE5EA] p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Department Allocation</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={deptAlloc}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F7F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #DCE5EA', fontSize: 13 }} />
              <Bar dataKey="assets" fill="#0F766E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-[#DCE5EA] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#0F172A]">Recent Notifications</h3>
            <Link to="/notifications" className="text-xs text-[#0F766E] font-medium hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {recentNotifs.map(n => (
              <div key={n.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4F7F9] transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-[#DCE5EA]' : 'bg-[#0F766E]'}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#0F172A] truncate">{n.message}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{new Date(n.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-[#DCE5EA] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#0F172A]">Recent Activity</h3>
            <Link to="/activity" className="text-xs text-[#0F766E] font-medium hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                    <Activity className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  {i < recentActivity.length - 1 && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-6 bg-[#DCE5EA]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">{item.action}</p>
                  <p className="text-xs text-[#64748B]">{item.detail}</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
