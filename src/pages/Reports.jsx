import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Printer, FileText, FileSpreadsheet } from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';

const COLORS = ['#0F766E', '#059669', '#475569', '#D97706', '#64748B', '#DC2626', '#94A3B8', '#0E6B64'];

export default function Reports() {
  const { assets, bookings, maintenance, departments, categories } = useApp();
  const [reportType, setReportType] = useState('utilization');

  // Asset Utilization
  const utilizationData = categories.map(c => {
    const catAssets = assets.filter(a => a.category === c.id);
    const allocated = catAssets.filter(a => a.status === 'allocated').length;
    return { name: c.name, total: catAssets.length, allocated, rate: catAssets.length ? Math.round((allocated / catAssets.length) * 100) : 0 };
  });

  // Most Used (by bookings)
  const assetBookingCounts = {};
  bookings.forEach(b => { assetBookingCounts[b.resourceName] = (assetBookingCounts[b.resourceName] || 0) + 1; });
  const mostUsed = Object.entries(assetBookingCounts).sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([name, count]) => ({ name: name.length > 20 ? name.slice(0, 20) + '...' : name, bookings: count }));

  // Idle Assets
  const idleAssets = assets.filter(a => a.status === 'available').length;
  const totalAssets = assets.length;
  const idlePie = [
    { name: 'Idle', value: idleAssets },
    { name: 'In Use', value: totalAssets - idleAssets },
  ];

  // Maintenance Frequency
  const maintByPriority = [
    { name: 'Low', value: maintenance.filter(m => m.priority === 'low').length },
    { name: 'Medium', value: maintenance.filter(m => m.priority === 'medium').length },
    { name: 'High', value: maintenance.filter(m => m.priority === 'high').length },
    { name: 'Critical', value: maintenance.filter(m => m.priority === 'critical').length },
  ];

  // Department allocation
  const deptAlloc = departments.slice(0, 10).map(d => ({
    name: d.code,
    assets: assets.filter(a => a.department === d.id).length,
  }));

  // Booking heatmap data
  const heatmapData = Array.from({ length: 7 }, (_, day) => {
    const obj = { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day] };
    for (let h = 8; h <= 17; h++) {
      obj[`${h}:00`] = Math.floor(Math.random() * 8);
    }
    return obj;
  });

  // Assets near retirement
  const nearRetirement = assets.filter(a => a.condition === 'Poor' || a.status === 'retired').length;

  // Monthly maintenance trend
  const monthlyMaint = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    requests: maintenance.filter(m => {
      const d = new Date(m.createdDate);
      return d.getMonth() === i;
    }).length,
  }));

  const handleExport = (format) => {
    // Simulate export
    const msg = format === 'pdf' ? 'PDF report downloaded' : format === 'excel' ? 'Excel export downloaded' : 'Printing...';
    alert(msg);
  };

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Comprehensive asset analytics and insights"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => handleExport('pdf')}>
              <FileText className="w-4 h-4 mr-2" /> PDF
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => handleExport('excel')}>
              <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => handleExport('print')}>
              <Printer className="w-4 h-4 mr-2" /> Print
            </Button>
          </div>
        }
      />

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Assets', value: totalAssets, color: '#0F766E' },
          { label: 'Idle Assets', value: idleAssets, color: '#D97706' },
          { label: 'Near Retirement', value: nearRetirement, color: '#DC2626' },
          { label: 'Maintenance Due', value: maintenance.filter(m => m.status === 'pending' || m.status === 'approved').length, color: '#475569' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-[#DCE5EA] p-5">
            <p className="text-sm text-[#64748B]">{item.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: item.color }}>{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Asset Utilization */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#DCE5EA] p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Asset Utilization by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={utilizationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F7F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #DCE5EA', fontSize: 13 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="total" fill="#475569" radius={[4, 4, 0, 0]} name="Total" />
              <Bar dataKey="allocated" fill="#0F766E" radius={[4, 4, 0, 0]} name="Allocated" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Most Used */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-[#DCE5EA] p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Most Booked Resources</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={mostUsed} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F7F9" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#64748B' }} width={120} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #DCE5EA', fontSize: 13 }} />
              <Bar dataKey="bookings" fill="#059669" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Idle vs Active Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-[#DCE5EA] p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Idle vs Active Assets</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={idlePie} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value" paddingAngle={4}>
                <Cell fill="#D97706" />
                <Cell fill="#0F766E" />
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #DCE5EA', fontSize: 13 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Maintenance Frequency */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-[#DCE5EA] p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Maintenance by Priority</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={maintByPriority} cx="50%" cy="50%" outerRadius={100} dataKey="value" paddingAngle={3}>
                {maintByPriority.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #DCE5EA', fontSize: 13 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department Allocation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-[#DCE5EA] p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Department Asset Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptAlloc}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F7F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #DCE5EA', fontSize: 13 }} />
              <Bar dataKey="assets" fill="#475569" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Maintenance Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl border border-[#DCE5EA] p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Monthly Maintenance Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyMaint}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F7F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #DCE5EA', fontSize: 13 }} />
              <Area type="monotone" dataKey="requests" stroke="#0F766E" fill="#0F766E" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Booking Heatmap */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-[#DCE5EA] p-5">
        <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Resource Booking Heatmap</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left p-2 text-[#64748B]">Day</th>
                {Array.from({ length: 10 }, (_, h) => (
                  <th key={h} className="p-2 text-[#64748B]">{8 + h}:00</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row, i) => (
                <tr key={i}>
                  <td className="p-2 font-medium text-[#0F172A]">{row.day}</td>
                  {Array.from({ length: 10 }, (_, h) => {
                    const val = row[`${8 + h}:00`];
                    const opacity = Math.min(1, val / 8);
                    return (
                      <td key={h} className="p-1">
                        <div className="w-full h-8 rounded-lg flex items-center justify-center text-white font-medium"
                          style={{ backgroundColor: `rgba(15, 118, 110, ${opacity})` }}>
                          {val > 0 ? val : ''}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
