import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function AuthLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@assetflow.com');
  const [password, setPassword] = useState('admin123');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (email && password) {
        navigate('/');
      } else {
        setError('Invalid credentials');
      }
      setLoading(false);
    }, 800);
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
            Enterprise Asset<br />& Resource Management
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            Streamline asset tracking, resource booking, maintenance workflows, and audits across your entire organization.
          </p>
          <div className="flex gap-6 mt-10">
            {[
              { val: '300+', label: 'Assets Tracked' },
              { val: '120', label: 'Employees' },
              { val: '15', label: 'Departments' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-2xl font-bold text-white">{stat.val}</p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F4F7F9]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#0F766E] flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0F172A]">AssetFlow</span>
          </div>

          <h2 className="text-2xl font-bold text-[#0F172A]">Welcome back</h2>
          <p className="text-sm text-[#64748B] mt-1 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label>Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="admin@assetflow.com"
                  className="pl-10 rounded-xl h-11" />
              </div>
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <Input value={password} onChange={e => setPassword(e.target.value)} type={showPw ? 'text' : 'password'}
                  placeholder="••••••••" className="pl-10 pr-10 rounded-xl h-11" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" checked={remember} onCheckedChange={setRemember} />
                <label htmlFor="remember" className="text-sm text-[#64748B] cursor-pointer">Remember me</label>
              </div>
              <Link to="/forgot-password" className="text-sm text-[#0F766E] hover:underline font-medium">Forgot password?</Link>
            </div>

            {error && <p className="text-sm text-[#DC2626]">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full h-11 bg-[#0F766E] hover:bg-[#0E6B64] rounded-xl text-sm font-semibold">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-[#64748B] mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#0F766E] font-medium hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
