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
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Lock, CheckCircle, AlertTriangle, XCircle, FileText, Eye } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function Audit() {
  const { audits, setAudits, departments, employees, assets, addLog } = useApp();
  const { toast } = useToast();
  const [createDialog, setCreateDialog] = useState(false);
  const [detailSheet, setDetailSheet] = useState(null);
  const [form, setForm] = useState({ name: '', department: '', location: '', startDate: '', endDate: '', auditor: '' });

  const handleCreate = () => {
    if (!form.name || !form.department) return;
    const dept = departments.find(d => d.id === form.department);
    const auditor = employees.find(e => e.id === form.auditor);
    const deptAssets = assets.filter(a => a.department === form.department);
    const newAudit = {
      id: `au${Date.now()}`,
      name: form.name,
      department: form.department,
      departmentName: dept?.name || '',
      location: form.location,
      startDate: form.startDate,
      endDate: form.endDate,
      status: 'planned',
      auditor: auditor?.name || '',
      auditorId: form.auditor,
      totalAssets: deptAssets.length,
      verified: 0,
      missing: 0,
      damaged: 0,
      progress: 0,
      locked: false,
    };
    setAudits(prev => [newAudit, ...prev]);
    addLog('Created', 'Audit', `Created audit: ${form.name}`);
    toast({ title: 'Audit cycle created', description: form.name });
    setCreateDialog(false);
    setForm({ name: '', department: '', location: '', startDate: '', endDate: '', auditor: '' });
  };

  const updateAuditStatus = (id, status) => {
    setAudits(prev => prev.map(a => {
      if (a.id !== id) return a;
      const updates = { status };
      if (status === 'completed') {
        updates.progress = 100;
        updates.verified = a.totalAssets - 2;
        updates.missing = 1;
        updates.damaged = 1;
      }
      if (status === 'closed') updates.locked = true;
      if (status === 'in_progress') updates.progress = 35;
      return { ...a, ...updates };
    }));
    addLog('Updated', 'Audit', `Audit status changed to ${status}`);
    toast({ title: `Audit ${status.replace('_', ' ')}` });
  };

  const markAsset = (auditId, result) => {
    setAudits(prev => prev.map(a => {
      if (a.id !== auditId) return a;
      const updates = { ...a };
      if (result === 'verified') updates.verified += 1;
      else if (result === 'missing') updates.missing += 1;
      else if (result === 'damaged') updates.damaged += 1;
      updates.progress = Math.min(100, Math.round(((updates.verified + updates.missing + updates.damaged) / updates.totalAssets) * 100));
      return updates;
    }));
    toast({ title: `Asset marked as ${result}` });
  };

  const columns = [
    { header: 'Audit Cycle', accessor: 'name', cell: (row) => (
      <div className="flex items-center gap-2">
        {row.locked && <Lock className="w-3.5 h-3.5 text-[#64748B]" />}
        <div>
          <p className="font-medium text-[#0F172A]">{row.name}</p>
          <p className="text-xs text-[#64748B]">{row.departmentName}</p>
        </div>
      </div>
    )},
    { header: 'Location', accessor: 'location' },
    { header: 'Period', accessor: 'startDate', cell: (row) => `${row.startDate} → ${row.endDate}` },
    { header: 'Auditor', accessor: 'auditor' },
    { header: 'Progress', accessor: 'progress', cell: (row) => (
      <div className="w-32">
        <div className="flex justify-between text-xs text-[#64748B] mb-1">
          <span>{row.progress}%</span>
          <span>{row.verified + row.missing + row.damaged}/{row.totalAssets}</span>
        </div>
        <Progress value={row.progress} className="h-1.5" />
      </div>
    )},
    { header: 'Results', cell: (row) => (
      <div className="flex gap-2 text-xs">
        <span className="text-emerald-600">✓ {row.verified}</span>
        <span className="text-red-600">✕ {row.missing}</span>
        <span className="text-orange-600">⚠ {row.damaged}</span>
      </div>
    )},
    { header: 'Status', accessor: 'status', cell: (row) => <StatusBadge status={row.status} /> },
    { header: 'Actions', cell: (row) => (
      <div className="flex gap-1">
        <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={(e) => { e.stopPropagation(); setDetailSheet(row); }}>
          <Eye className="w-3 h-3 mr-1" /> View
        </Button>
        {row.status === 'planned' && (
          <Button size="sm" className="rounded-lg text-xs bg-[#0F766E] hover:bg-[#0E6B64]" onClick={(e) => { e.stopPropagation(); updateAuditStatus(row.id, 'in_progress'); }}>
            Start
          </Button>
        )}
        {row.status === 'in_progress' && (
          <Button size="sm" className="rounded-lg text-xs bg-[#059669] hover:bg-[#047857]" onClick={(e) => { e.stopPropagation(); updateAuditStatus(row.id, 'completed'); }}>
            Complete
          </Button>
        )}
        {row.status === 'completed' && !row.locked && (
          <Button size="sm" className="rounded-lg text-xs bg-[#475569] hover:bg-[#374151]" onClick={(e) => { e.stopPropagation(); updateAuditStatus(row.id, 'closed'); }}>
            <Lock className="w-3 h-3 mr-1" /> Close
          </Button>
        )}
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Asset Audit"
        description="Manage structured audit cycles"
        actions={
          <Button onClick={() => setCreateDialog(true)} className="bg-[#0F766E] hover:bg-[#0E6B64] rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Create Audit Cycle
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Planned', count: audits.filter(a => a.status === 'planned').length, color: '#475569' },
          { label: 'In Progress', count: audits.filter(a => a.status === 'in_progress').length, color: '#D97706' },
          { label: 'Completed', count: audits.filter(a => a.status === 'completed').length, color: '#059669' },
          { label: 'Closed', count: audits.filter(a => a.status === 'closed').length, color: '#64748B' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-[#DCE5EA] p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: item.color }}>{item.count}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{item.label}</p>
          </motion.div>
        ))}
      </div>

      <DataTable data={audits} columns={columns} searchPlaceholder="Search audits..." />

      {/* Create Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Create Audit Cycle</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Audit Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. IT Dept Q3 Audit" className="rounded-xl mt-1" /></div>
            <div>
              <Label>Department Scope</Label>
              <Select value={form.department} onValueChange={v => setForm(f => ({ ...f, department: v }))}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Location Scope</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. HQ - Floor 2" className="rounded-xl mt-1" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Start Date</Label><Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="rounded-xl mt-1" /></div>
              <div><Label>End Date</Label><Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="rounded-xl mt-1" /></div>
            </div>
            <div>
              <Label>Assign Auditor</Label>
              <Select value={form.auditor} onValueChange={v => setForm(f => ({ ...f, auditor: v }))}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Select auditor" /></SelectTrigger>
                <SelectContent>{employees.filter(e => e.role === 'asset_manager' || e.role === 'admin').map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialog(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleCreate} className="bg-[#0F766E] hover:bg-[#0E6B64] rounded-xl">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Sheet */}
      <Sheet open={!!detailSheet} onOpenChange={() => setDetailSheet(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {detailSheet && (
            <>
              <SheetHeader>
                <SheetTitle>{detailSheet.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="flex justify-between items-center">
                  <StatusBadge status={detailSheet.status} />
                  {detailSheet.locked && <span className="flex items-center gap-1 text-xs text-[#64748B]"><Lock className="w-3 h-3" /> Locked</span>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Department', value: detailSheet.departmentName },
                    { label: 'Location', value: detailSheet.location },
                    { label: 'Auditor', value: detailSheet.auditor },
                    { label: 'Period', value: `${detailSheet.startDate} → ${detailSheet.endDate}` },
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-[#F4F7F9] rounded-xl">
                      <p className="text-xs text-[#64748B]">{item.label}</p>
                      <p className="text-sm font-medium text-[#0F172A] mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#0F172A] mb-2">Progress</p>
                  <Progress value={detailSheet.progress} className="h-2 mb-2" />
                  <p className="text-xs text-[#64748B]">{detailSheet.progress}% complete</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-emerald-50 rounded-xl text-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-emerald-700">{detailSheet.verified}</p>
                    <p className="text-xs text-emerald-600">Verified</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-xl text-center">
                    <XCircle className="w-5 h-5 text-red-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-red-700">{detailSheet.missing}</p>
                    <p className="text-xs text-red-600">Missing</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-xl text-center">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-orange-700">{detailSheet.damaged}</p>
                    <p className="text-xs text-orange-600">Damaged</p>
                  </div>
                </div>

                {detailSheet.status === 'in_progress' && !detailSheet.locked && (
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A] mb-3">Mark Assets</p>
                    <div className="space-y-2">
                      {assets.filter(a => a.department === detailSheet.department).slice(0, 5).map(asset => (
                        <div key={asset.id} className="flex items-center justify-between p-3 border border-[#DCE5EA] rounded-xl">
                          <div>
                            <p className="text-sm font-medium">{asset.name}</p>
                            <p className="text-xs text-[#64748B]">{asset.assetTag}</p>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => markAsset(detailSheet.id, 'verified')} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs hover:bg-emerald-100">✓</button>
                            <button onClick={() => markAsset(detailSheet.id, 'missing')} className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs hover:bg-red-100">✕</button>
                            <button onClick={() => markAsset(detailSheet.id, 'damaged')} className="px-2 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs hover:bg-orange-100">⚠</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(detailSheet.missing > 0 || detailSheet.damaged > 0) && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <p className="text-sm font-semibold text-amber-800">Discrepancy Report</p>
                    </div>
                    <p className="text-xs text-amber-700">{detailSheet.missing} missing, {detailSheet.damaged} damaged asset(s) found during audit.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
