import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import ImageUpload from '@/components/shared/ImageUpload';

export default function AssetRegister() {
  const { categories, departments, setAssets, addLog, addNotification } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '', category: '', serialNumber: '', acquisitionDate: '', acquisitionCost: '',
    condition: 'Excellent', location: '', department: '', isBookable: false, notes: '', photo: '',
  });

  const assetTag = `AF-${String(10000 + Math.floor(Math.random() * 90000)).padStart(6, '0')}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.category) return;

    const cat = categories.find(c => c.id === form.category);
    const dept = departments.find(d => d.id === form.department);
    const newAsset = {
      id: `a${Date.now()}`,
      name: form.name,
      category: form.category,
      categoryName: cat?.name || '',
      assetTag,
      serialNumber: form.serialNumber,
      acquisitionDate: form.acquisitionDate,
      acquisitionCost: Number(form.acquisitionCost) || 0,
      condition: form.condition,
      location: form.location,
      status: 'available',
      department: form.department,
      departmentName: dept?.name || '',
      allocatedTo: null,
      allocatedToName: null,
      isBookable: form.isBookable,
      photo: form.photo || null,
      documents: [],
    };

    setAssets(prev => [newAsset, ...prev]);
    addLog('Registered', 'Asset', `Registered ${form.name} (${assetTag})`);
    addNotification('asset_assigned', `New asset registered: ${form.name}`);
    toast({ title: 'Asset registered', description: `${form.name} — ${assetTag}` });
    navigate('/assets');
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/assets')} className="p-2 rounded-xl hover:bg-white transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#64748B]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Register Asset</h1>
          <p className="text-sm text-[#64748B]">Add a new asset to the directory</p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-[#DCE5EA] p-6 max-w-3xl"
      >
        <div className="space-y-5">
          <div className="p-4 bg-[#F4F7F9] rounded-xl">
            <p className="text-xs text-[#64748B]">Auto-generated Asset Tag</p>
            <p className="text-lg font-bold text-[#0F766E] font-mono">{assetTag}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Asset Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. MacBook Pro 16" className="rounded-xl mt-1" required />
            </div>
            <div>
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Serial Number</Label>
              <Input value={form.serialNumber} onChange={e => setForm(f => ({ ...f, serialNumber: e.target.value }))} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label>Acquisition Date</Label>
              <Input type="date" value={form.acquisitionDate} onChange={e => setForm(f => ({ ...f, acquisitionDate: e.target.value }))} className="rounded-xl mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Acquisition Cost ($)</Label>
              <Input type="number" value={form.acquisitionCost} onChange={e => setForm(f => ({ ...f, acquisitionCost: e.target.value }))} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label>Condition</Label>
              <Select value={form.condition} onValueChange={v => setForm(f => ({ ...f, condition: v }))}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Excellent', 'Good', 'Fair', 'Poor'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Location</Label>
              <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. HQ - Floor 2" className="rounded-xl mt-1" />
            </div>
            <div>
              <Label>Department</Label>
              <Select value={form.department} onValueChange={v => setForm(f => ({ ...f, department: v }))}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#F4F7F9] rounded-xl">
            <Switch checked={form.isBookable} onCheckedChange={v => setForm(f => ({ ...f, isBookable: v }))} />
            <div>
              <p className="text-sm font-medium text-[#0F172A]">Shared / Bookable</p>
              <p className="text-xs text-[#64748B]">Allow this asset to be booked by other employees</p>
            </div>
          </div>

          <ImageUpload
            label="Asset Photo"
            hint="PNG, JPG up to 5MB"
            value={form.photo}
            onChange={(val) => setForm(f => ({ ...f, photo: val }))}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#DCE5EA]">
          <Button type="button" variant="outline" onClick={() => navigate('/assets')} className="rounded-xl">Cancel</Button>
          <Button type="submit" className="bg-[#0F766E] hover:bg-[#0E6B64] rounded-xl">Register Asset</Button>
        </div>
      </motion.form>
    </div>
  );
}
