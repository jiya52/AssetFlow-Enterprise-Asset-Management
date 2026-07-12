import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Package, ArrowLeftRight, Wrench, CalendarDays, ClipboardCheck,
  Clock, CheckCheck, Trash2, Bell
} from 'lucide-react';

const typeIcons = {
  asset_assigned: Package,
  transfer_approved: ArrowLeftRight,
  maintenance_approved: Wrench,
  maintenance_rejected: Wrench,
  booking_confirmed: CalendarDays,
  booking_cancelled: CalendarDays,
  booking_reminder: Clock,
  overdue_return: Clock,
  audit_discrepancy: ClipboardCheck,
};

const typeColors = {
  asset_assigned: '#0F766E',
  transfer_approved: '#059669',
  maintenance_approved: '#16A34A',
  maintenance_rejected: '#DC2626',
  booking_confirmed: '#0F766E',
  booking_cancelled: '#DC2626',
  booking_reminder: '#D97706',
  overdue_return: '#DC2626',
  audit_discrepancy: '#D97706',
};

export default function NotificationsPage() {
  const { notifications, markAllRead, markRead, setNotifications } = useApp();

  const grouped = useMemo(() => {
    const now = new Date('2026-07-12T10:00:00');
    const today = [];
    const yesterday = [];
    const earlier = [];

    notifications.forEach(n => {
      const nDate = new Date(n.timestamp);
      const diff = (now.getTime() - nDate.getTime()) / (1000 * 60 * 60);
      if (diff < 24) today.push(n);
      else if (diff < 48) yesterday.push(n);
      else earlier.push(n);
    });

    return [
      { label: 'Today', items: today },
      { label: 'Yesterday', items: yesterday },
      { label: 'Earlier', items: earlier },
    ].filter(g => g.items.length > 0);
  }, [notifications]);

  const clearAll = () => setNotifications([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl" onClick={markAllRead}>
              <CheckCheck className="w-4 h-4 mr-2" /> Mark All Read
            </Button>
            <Button variant="outline" className="rounded-xl text-[#DC2626] hover:bg-red-50" onClick={clearAll}>
              <Trash2 className="w-4 h-4 mr-2" /> Clear All
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {grouped.map(group => (
          <div key={group.label}>
            <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">{group.label}</h3>
            <div className="space-y-2">
              {group.items.map((n, i) => {
                const Icon = typeIcons[n.type] || Bell;
                const color = typeColors[n.type] || '#64748B';
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => markRead(n.id)}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all
                      ${n.read ? 'bg-white border-[#DCE5EA]' : 'bg-[#E6F7F6] border-[#0F766E]/20'}`}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
                      <Icon className="w-4.5 h-4.5" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${n.read ? 'text-[#0F172A]' : 'text-[#0F172A] font-medium'}`}>{n.message}</p>
                      <p className="text-xs text-[#64748B] mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                    </div>
                    {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-[#0F766E] flex-shrink-0 mt-1.5" />}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-[#DCE5EA] mx-auto mb-3" />
            <p className="text-[#64748B]">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}
