import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import DataTable from '@/components/shared/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Plus, AlertTriangle, X } from 'lucide-react';

export default function Booking() {
  const { bookings, setBookings, assets, departments, addLog, addNotification } = useApp();
  const { toast } = useToast();
  const [bookDialog, setBookDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState({ resource: '', date: '', startTime: '', duration: '1', department: '', purpose: '' });

  const bookableAssets = assets.filter(a => a.isBookable);
  const filtered = statusFilter === 'all' ? bookings : bookings.filter(b => b.status === statusFilter);

  // Check overlap
  const hasOverlap = useMemo(() => {
    if (!form.resource || !form.date || !form.startTime) return false;
    const startHour = parseInt(form.startTime.split(':')[0]);
    const endHour = startHour + parseInt(form.duration);
    return bookings.some(b => {
      if (b.resource !== form.resource || b.date !== form.date || b.status === 'cancelled') return false;
      const bStart = parseInt(b.startTime.split(':')[0]);
      const bEnd = parseInt(b.endTime.split(':')[0]);
      return startHour < bEnd && endHour > bStart;
    });
  }, [form, bookings]);

  const handleBook = () => {
    if (hasOverlap) {
      toast({ title: 'Booking conflict', description: 'This time slot overlaps with an existing booking.', variant: 'destructive' });
      return;
    }
    const resource = bookableAssets.find(a => a.id === form.resource);
    const startHour = parseInt(form.startTime.split(':')[0]);
    const newBooking = {
      id: `b${Date.now()}`,
      resource: form.resource,
      resourceName: resource?.name || '',
      resourceCategory: resource?.categoryName || '',
      bookedBy: 'e1',
      bookedByName: 'James Smith',
      department: form.department,
      departmentName: departments.find(d => d.id === form.department)?.name || '',
      date: form.date,
      startTime: form.startTime,
      endTime: `${String(startHour + parseInt(form.duration)).padStart(2, '0')}:00`,
      duration: parseInt(form.duration),
      purpose: form.purpose,
      status: 'upcoming',
    };
    setBookings(prev => [newBooking, ...prev]);
    addLog('Booked', 'Booking', `Booked ${resource?.name}`);
    addNotification('booking_confirmed', `Booking confirmed: ${resource?.name}`);
    toast({ title: 'Booking confirmed', description: `${resource?.name} on ${form.date}` });
    setBookDialog(false);
    setForm({ resource: '', date: '', startTime: '', duration: '1', department: '', purpose: '' });
  };

  const cancelBooking = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    addLog('Cancelled', 'Booking', `Cancelled booking ${id}`);
    toast({ title: 'Booking cancelled' });
  };

  const columns = [
    { header: 'Resource', accessor: 'resourceName', cell: (row) => (
      <div>
        <p className="font-medium text-[#0F172A]">{row.resourceName}</p>
        <p className="text-xs text-[#64748B]">{row.resourceCategory}</p>
      </div>
    )},
    { header: 'Booked By', accessor: 'bookedByName' },
    { header: 'Date', accessor: 'date' },
    { header: 'Time', accessor: 'startTime', cell: (row) => `${row.startTime} — ${row.endTime}` },
    { header: 'Duration', accessor: 'duration', cell: (row) => `${row.duration}h` },
    { header: 'Purpose', accessor: 'purpose' },
    { header: 'Status', accessor: 'status', cell: (row) => (
      <div className="flex items-center gap-2">
        <StatusBadge status={row.status} />
        {row.status === 'upcoming' && <span className="text-xs text-[#D97706]">⏰</span>}
      </div>
    )},
    { header: 'Actions', cell: (row) => row.status === 'upcoming' || row.status === 'ongoing' ? (
      <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={(e) => { e.stopPropagation(); cancelBooking(row.id); }}>
        <X className="w-3 h-3 mr-1" /> Cancel
      </Button>
    ) : null },
  ];

  // Simple calendar view - current month days
  const daysInMonth = new Date(2026, 7, 0).getDate();
  const firstDayOfWeek = new Date(2026, 6, 1).getDay();
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDayOfWeek + 1;
    if (day < 1 || day > daysInMonth) return null;
    return day;
  });

  const getBookingsForDay = (day) => {
    const dateStr = `2026-07-${String(day).padStart(2, '0')}`;
    return bookings.filter(b => b.date === dateStr && b.status !== 'cancelled');
  };

  return (
    <div>
      <PageHeader
        title="Resource Booking"
        description={`${bookings.length} total bookings`}
        actions={
          <Button onClick={() => setBookDialog(true)} className="bg-[#0F766E] hover:bg-[#0E6B64] rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Book Resource
          </Button>
        }
      />

      {/* Mini Calendar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-[#DCE5EA] p-5 mb-6">
        <h3 className="text-sm font-semibold text-[#0F172A] mb-3">July 2026</h3>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-xs font-medium text-[#64748B] py-2">{d}</div>
          ))}
          {calendarDays.map((day, i) => {
            if (!day) return <div key={i} />;
            const dayBookings = getBookingsForDay(day);
            const isToday = day === 12;
            return (
              <div key={i} className={`p-1.5 rounded-xl text-sm transition-colors ${isToday ? 'bg-[#0F766E] text-white font-bold' : 'hover:bg-[#F4F7F9]'}`}>
                <span>{day}</span>
                {dayBookings.length > 0 && (
                  <div className="flex justify-center gap-0.5 mt-0.5">
                    {dayBookings.slice(0, 3).map((_, j) => (
                      <div key={j} className={`w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-[#0F766E]'}`} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      <DataTable
        data={filtered}
        columns={columns}
        searchPlaceholder="Search bookings..."
        filters={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* Booking Dialog */}
      <Dialog open={bookDialog} onOpenChange={setBookDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Book Resource</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Resource</Label>
              <Select value={form.resource} onValueChange={v => setForm(f => ({ ...f, resource: v }))}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Select resource" /></SelectTrigger>
                <SelectContent>{bookableAssets.slice(0, 30).map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label>Start Time</Label>
                <Input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} className="rounded-xl mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration (hours)</Label>
                <Select value={form.duration} onValueChange={v => setForm(f => ({ ...f, duration: v }))}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{[1, 2, 3, 4, 5, 6, 7, 8].map(h => <SelectItem key={h} value={String(h)}>{h}h</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Department</Label>
                <Select value={form.department} onValueChange={v => setForm(f => ({ ...f, department: v }))}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Purpose</Label>
              <Textarea value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} placeholder="Describe purpose of booking" className="rounded-xl mt-1" rows={2} />
            </div>
            {hasOverlap && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-800">This time slot overlaps with an existing booking.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookDialog(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleBook} disabled={hasOverlap || !form.resource || !form.date || !form.startTime} className="bg-[#0F766E] hover:bg-[#0E6B64] rounded-xl">
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
