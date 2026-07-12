import React, { useState } from 'react';
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
import { Plus, Upload, CheckCircle, XCircle, UserPlus, Play, Wrench } from 'lucide-react';

const STATUSES = ['pending', 'approved', 'rejected', 'technician_assigned', 'in_progress', 'resolved'];
const WORKFLOW_ACTIONS = {
  pending: [
    { label: 'Approve', next: 'approved', icon: CheckCircle, color: 'bg-[#0F766E]' },
    { label: 'Reject', next: 'rejected', icon: XCircle, color: 'bg-[#DC2626]' },
  ],
  approved: [
    { label: 'Assign Technician', next: 'technician_assigned', icon: UserPlus, color: 'bg-[#475569]' },
  ],
  technician_assigned: [
    { label: 'Start Work', next: 'in_progress', icon: Play, color: 'bg-[#D97706]' },
  ],
  in_progress: [
    { label: 'Mark Resolved', next: 'resolved', icon: CheckCircle, color: 'bg-[#16A34A]' },
  ],
};

export default function MaintenancePage() {
  const { maintenance, setMaintenance, assets, setAssets, employees, addLog, addNotification } = useApp();
  const { toast } = useToast();
  const [reqDialog, setReqDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState({ asset: '', issue: '', priority: 'medium' });

  const filtered = statusFilter === 'all' ? maintenance : maintenance.filter(m => m.status === statusFilter);

  const handleCreate = () => {
    const asset = assets.find(a => a.id === form.asset);
    if (!asset) return;
    const newReq = {
      id: `m${Date.now()}`,
      asset: form.asset,
      assetName: asset.name,
      assetTag: asset.assetTag,
      reportedBy: 'e1',
      reportedByName: 'James Smith',
      issue: form.issue,
      priority: form.priority,
      status: 'pending',
      technician: null,
      createdDate: new Date().toISOString().split('T')[0],
      resolvedDate: null,
      notes: '',
    };
    setMaintenance(prev => [newReq, ...prev]);
    addLog('Created', 'Maintenance', `Maintenance request for ${asset.name}`);
    toast({ title: 'Request submitted', description: asset.name });
    setReqDialog(false);
    setForm({ asset: '', issue: '', priority: 'medium' });
  };

  const handleAction = (id, nextStatus) => {
    setMaintenance(prev => prev.map(m => {
      if (m.id !== id) return m;
      const updated = { ...m, status: nextStatus };
      if (nextStatus === 'technician_assigned') updated.technician = employees[20].name;
      if (nextStatus === 'resolved') updated.resolvedDate = new Date().toISOString().split('T')[0];
      return updated;
    }));

    // Update asset status
    const req = maintenance.find(m => m.id === id);
    if (req) {
      if (nextStatus === 'in_progress' || nextStatus === 'technician_assigned' || nextStatus === 'approved') {
        setAssets(prev => prev.map(a => a.id === req.asset ? { ...a, status: 'under_maintenance' } : a));
      }
      if (nextStatus === 'resolved') {
        setAssets(prev => prev.map(a => a.id === req.asset ? { ...a, status: 'available' } : a));
      }
    }

    const notifType = nextStatus === 'approved' ? 'maintenance_approved' : nextStatus === 'rejected' ? 'maintenance_rejected' : null;
    if (notifType) addNotification(notifType, `Maintenance ${nextStatus}: ${req?.assetName}`);
    addLog(nextStatus === 'approved' ? 'Approved' : 'Updated', 'Maintenance', `Updated to ${nextStatus}`);
    toast({ title: `Status updated to ${nextStatus.replace('_', ' ')}` });
  };

  // Pipeline view counts
  const pipelineCounts = STATUSES.map(s => ({ status: s, count: maintenance.filter(m => m.status === s).length }));

  const columns = [
    { header: 'Asset', accessor: 'assetName', cell: (row) => (
      <div>
        <p className="font-medium text-[#0F172A]">{row.assetName}</p>
        <p className="text-xs text-[#64748B]">{row.assetTag}</p>
      </div>
    )},
    { header: 'Issue', accessor: 'issue' },
    { header: 'Priority', accessor: 'priority', cell: (row) => <StatusBadge status={row.priority} /> },
    { header: 'Status', accessor: 'status', cell: (row) => <StatusBadge status={row.status} /> },
    { header: 'Reported By', accessor: 'reportedByName' },
    { header: 'Technician', accessor: 'technician', cell: (row) => row.technician || '—' },
    { header: 'Date', accessor: 'createdDate' },
    { header: 'Actions', cell: (row) => {
      const actions = WORKFLOW_ACTIONS[row.status];
      if (!actions) return null;
      return (
        <div className="flex gap-1">
          {actions.map(action => (
            <Button key={action.next} size="sm" className={`rounded-lg text-xs text-white ${action.color}`}
              onClick={(e) => { e.stopPropagation(); handleAction(row.id, action.next); }}>
              <action.icon className="w-3 h-3 mr-1" /> {action.label}
            </Button>
          ))}
        </div>
      );
    }},
  ];

  return (
    <div>
      <PageHeader
        title="Maintenance Management"
        description="Manage maintenance requests and approvals"
        actions={
          <Button onClick={() => setReqDialog(true)} className="bg-[#0F766E] hover:bg-[#0E6B64] rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Raise Request
          </Button>
        }
      />

      {/* Pipeline */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {pipelineCounts.map(({ status, count }, i) => (
          <motion.div
            key={status}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
            className={`p-3 rounded-2xl border cursor-pointer transition-all text-center
              ${statusFilter === status ? 'border-[#0F766E] bg-[#E6F7F6]' : 'border-[#DCE5EA] bg-white hover:bg-[#F4F7F9]'}`}
          >
            <p className="text-2xl font-bold text-[#0F172A]">{count}</p>
            <p className="text-xs text-[#64748B] capitalize mt-0.5">{status.replace('_', ' ')}</p>
          </motion.div>
        ))}
      </div>

      <DataTable data={filtered} columns={columns} searchPlaceholder="Search maintenance requests..." />

      {/* Create Request Dialog */}
      <Dialog open={reqDialog} onOpenChange={setReqDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Raise Maintenance Request</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Asset</Label>
              <Select value={form.asset} onValueChange={v => setForm(f => ({ ...f, asset: v }))}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Select asset" /></SelectTrigger>
                <SelectContent>{assets.slice(0, 50).map(a => <SelectItem key={a.id} value={a.id}>{a.name} ({a.assetTag})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Issue Description</Label>
              <Textarea value={form.issue} onChange={e => setForm(f => ({ ...f, issue: e.target.value }))} placeholder="Describe the issue in detail" className="rounded-xl mt-1" rows={3} />
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['low', 'medium', 'high', 'critical'].map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 border-2 border-dashed border-[#DCE5EA] rounded-xl text-center cursor-pointer hover:border-[#0F766E] transition-colors">
              <Upload className="w-6 h-6 text-[#64748B] mx-auto mb-1" />
              <p className="text-xs text-[#64748B]">Upload photo of the issue</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReqDialog(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.asset || !form.issue} className="bg-[#0F766E] hover:bg-[#0E6B64] rounded-xl">Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
