import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react';
import ImageUpload from '@/components/shared/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const deptOptions = [
  'Information Technology', 'Human Resources', 'Finance & Accounting', 'Operations',
  'Marketing', 'Sales', 'Research & Development', 'Quality Assurance',
  'Customer Support', 'Legal & Compliance', 'Procurement', 'Facilities Management',
  'Administration', 'Training & Development', 'Security',
];

export default function AuthSignup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', department: '', password: '', confirmPassword: '', profileImage: '',
  });

  const handleSignup = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast({ title: 'Account created', description: 'You have been registered as an Employee.' });
      navigate('/auth/login');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0F766E] to-[#059669] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="absolute rounded-full border border-white/30"
              style={{ width: 200 + i * 120, height: 200 + i * 120, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          ))}
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Layers className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">AssetFlow</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Join Your<br />Organization
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            Create your employee account to start managing and booking organizational resources.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F4F7F9]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#0F766E] flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0F172A]">AssetFlow</span>
          </div>

          <h2 className="text-2xl font-bold text-[#0F172A]">Create Account</h2>
          <p className="text-sm text-[#64748B] mt-1 mb-6">Sign up as an Employee</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <Input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="John Doe" className="pl-10 rounded-xl h-11" required />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@company.com" className="pl-10 rounded-xl h-11" required />
              </div>
            </div>

            <div>
              <Label>Phone Number</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 (555) 000-0000" className="pl-10 rounded-xl h-11" />
              </div>
            </div>

            <div>
              <Label>Department</Label>
              <Select value={form.department} onValueChange={v => setForm(f => ({ ...f, department: v }))}>
                <SelectTrigger className="rounded-xl h-11 mt-1"><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>{deptOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <Input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="pl-10 rounded-xl h-11" required />
                </div>
              </div>
              <div>
                <Label>Confirm</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <Input type={showPw ? 'text' : 'password'} value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} className="pl-10 rounded-xl h-11" required />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setShowPw(!showPw)} className="text-xs text-[#0F766E] hover:underline">
                {showPw ? 'Hide' : 'Show'} passwords
              </button>
            </div>

            <ImageUpload
              label="Profile Image (optional)"
              value={form.profileImage}
              onChange={(val) => setForm(f => ({ ...f, profileImage: val }))}
            />

            <Button type="submit" disabled={loading} className="w-full h-11 bg-[#0F766E] hover:bg-[#0E6B64] rounded-xl text-sm font-semibold">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-[#64748B] mt-6">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-[#0F766E] font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
