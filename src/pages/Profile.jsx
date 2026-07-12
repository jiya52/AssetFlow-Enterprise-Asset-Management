import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useApp } from '@/contexts/AppContext';
import PageHeader from '@/components/shared/PageHeader';
import ImageUpload from '@/components/shared/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { User, Phone, Shield, Building2, Package, Calendar, Wrench } from 'lucide-react';

const deptOptions = [
  'Information Technology', 'Human Resources', 'Finance & Accounting', 'Operations',
  'Marketing', 'Sales', 'Research & Development', 'Quality Assurance',
  'Customer Support', 'Legal & Compliance', 'Procurement', 'Facilities Management',
  'Administration', 'Training & Development', 'Security',
];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { assets, bookings, maintenance } = useApp();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || '',
    avatar: user?.avatar || ''
  });

  // Filters for user's own items based on email
  const userAssets = assets.filter(a => a.allocatedTo?.toLowerCase() === user?.email?.toLowerCase());
  const userBookings = bookings.filter(b => b.bookedBy?.toLowerCase() === user?.email?.toLowerCase());
  const userMaintenance = maintenance.filter(m => m.reportedBy?.toLowerCase() === user?.email?.toLowerCase());

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateProfile(form);
    if (result.success) {
      toast({ title: 'Profile Updated', description: 'Your personal and organizational details have been updated.' });
    } else {
      toast({ title: 'Update Failed', description: result.message || 'An error occurred.', variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="Manage your personal information and track your allocated resources." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Overview & Settings */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Profile Overview Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[#DCE5EA] p-6 text-center"
          >
            <div className="flex flex-col items-center">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-[#0F766E]/20" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#0F766E] flex items-center justify-center border-4 border-[#0F766E]/20">
                  <span className="text-white text-3xl font-semibold">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </span>
                </div>
              )}
              <h3 className="text-lg font-bold text-[#0F172A] mt-4">{user?.name}</h3>
              <p className="text-sm text-[#64748B]">{user?.email}</p>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0F766E]/10 text-[#0F766E]">
                  <Shield className="w-3.5 h-3.5" />
                  {user?.role?.toUpperCase() || 'EMPLOYEE'}
                </span>
                {user?.department && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-[#475569]">
                    <Building2 className="w-3.5 h-3.5" />
                    {user.department}
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-[#DCE5EA] mt-6 pt-6 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{userAssets.length}</p>
                <p className="text-xs text-[#64748B]">Assets</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{userBookings.length}</p>
                <p className="text-xs text-[#64748B]">Bookings</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{userMaintenance.length}</p>
                <p className="text-xs text-[#64748B]">Tickets</p>
              </div>
            </div>
          </motion.div>

          {/* Edit Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-[#DCE5EA] p-6"
          >
            <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Edit Profile</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="pl-10 rounded-xl" required />
                </div>
              </div>

              <div>
                <Label>Phone Number</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="pl-10 rounded-xl" />
                </div>
              </div>

              <div>
                <Label>Department</Label>
                <Select value={form.department} onValueChange={v => setForm(f => ({ ...f, department: v }))}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>{deptOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <ImageUpload
                label="Profile Image"
                value={form.avatar}
                onChange={(val) => setForm(f => ({ ...f, avatar: val }))}
              />

              <Button type="submit" disabled={loading} className="w-full bg-[#0F766E] hover:bg-[#0E6B64] rounded-xl font-semibold">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Right Side: Tabular resources logs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Assets Allocated */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-[#DCE5EA] p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-[#0F766E]" />
              <h3 className="font-bold text-[#0F172A]">My Allocated Assets ({userAssets.length})</h3>
            </div>
            
            {userAssets.length === 0 ? (
              <div className="text-center py-8 text-sm text-[#64748B]">
                No assets currently allocated to you.
              </div>
            ) : (
              <div className="divide-y divide-[#DCE5EA]">
                {userAssets.map(asset => (
                  <div key={asset.id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{asset.name}</p>
                      <p className="text-xs text-[#64748B]">Tag: {asset.assetTag} | Location: {asset.location || 'N/A'}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                      asset.condition === 'new' ? 'bg-emerald-50 text-emerald-700' :
                      asset.condition === 'good' ? 'bg-blue-50 text-blue-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {asset.condition}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Resource Bookings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-[#DCE5EA] p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#0F766E]" />
              <h3 className="font-bold text-[#0F172A]">My Upcoming Bookings ({userBookings.length})</h3>
            </div>

            {userBookings.length === 0 ? (
              <div className="text-center py-8 text-sm text-[#64748B]">
                No active bookings found.
              </div>
            ) : (
              <div className="divide-y divide-[#DCE5EA]">
                {userBookings.map(booking => (
                  <div key={booking.id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{booking.resource}</p>
                      <p className="text-xs text-[#64748B]">Date: {booking.date} | Time: {booking.startTime} - {booking.endTime}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                      booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                      booking.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Maintenance Requests */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl border border-[#DCE5EA] p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-5 h-5 text-[#0F766E]" />
              <h3 className="font-bold text-[#0F172A]">My Maintenance Tickets ({userMaintenance.length})</h3>
            </div>

            {userMaintenance.length === 0 ? (
              <div className="text-center py-8 text-sm text-[#64748B]">
                No maintenance requests raised by you.
              </div>
            ) : (
              <div className="divide-y divide-[#DCE5EA]">
                {userMaintenance.map(req => (
                  <div key={req.id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{req.asset}</p>
                      <p className="text-xs text-[#64748B]">Issue: {req.issue} | Priority: <span className="capitalize font-semibold">{req.priority}</span></p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                      req.status === 'resolved' ? 'bg-emerald-50 text-emerald-700' :
                      req.status === 'in_progress' ? 'bg-blue-50 text-blue-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {req.status?.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </div>

      </div>
    </div>
  );
}
