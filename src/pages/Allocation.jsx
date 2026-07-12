import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import DataTable from '@/components/shared/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Plus, ArrowLeftRight, RotateCcw, AlertCircle } from 'lucide-react';

export default function Allocation() {
  const { assets, setAssets, employees, departments, transfers, setTransfers, addLog, addNotification } = useApp();
  const { toast } = useToast();
  const [allocDialog, setAllocDialog] = useState(false);
  const [returnDialog, setReturnDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [allocForm, setAllocForm] = useState({ asset: '', employee: '', department: '', returnDate: '', notes: '' });
  const [returnNotes, setReturnNotes] = useState('');

  const allocatedAssets = assets.filter(a => a.status === 'allocated');
  const availableAssets = assets.filter(a => a.status === 'available');

  const handleAllocate = () => {
    const asset = assets.find(a => a.id === allocForm.asset);
    if (!asset || asset.status !== 'available') return;
    const emp = employees.find(e => e.id === allocForm.employee);
    setAssets(prev => prev.map(a => a.id === allocForm.asset ? { ...a, status: 'allocated', allocatedTo: emp.id, allocatedToName: emp.name } : a));
    addLog('Allocated', 'Asset', `Allocated ${asset.name} to ${emp.name}`);
    addNotification('asset_assigned', `${asset.name} allocated to ${emp.name}`);
    toast({ title: 'Asset allocated', description: `${asset.name} → ${emp.name}` });
    setAllocDialog(false);
    setAllocForm({ asset: '', employee: '', department: '', returnDate: '', notes: '' });
  };

  const handleReturn = () => {
    if (!selectedAsset) return;
    setAssets(prev => prev.map(a => a.id === selectedAsset.id ? { ...a, status: 'available', allocatedTo: null, allocatedToName: null } : a));
    addLog('Returned', 'Asset', `${selectedAsset.name} returned`);
    toast({ title: 'Asset returned', description: selectedAsset.name });
    setReturnDialog(false);
    setSelectedAsset(null);
    setReturnNotes('');
  };

  const handleTransferAction = (id, action) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: action } : t));
    addLog(action === 'approved' ? 'Approved' : 'Rejected', 'Transfer', `Transfer ${id} ${action}`);
    toast({ title: `Transfer ${action}` });
  };

  const selectedAllocAsset = assets.find(a => a.id === allocForm.asset);
  const isConflict = selectedAllocAsset && selectedAllocAsset.status !== 'available';

  const allocColumns = [
    { header: 'Asset', accessor: 'name', cell: (row) => (
      <div>
        <p className="font-medium text-[#0F172A]">{row.name}</p>
        <p className="text-xs text-[#64748B]">{row.assetTag}</p>
      </div>
    )},
    { header: 'Allocated To', accessor: 'allocatedToName' },
    { header: 'Department', accessor: 'departmentName' },
    { header: 'Status', accessor: 'status', cell: (row) => <StatusBadge status={row.status} /> },
    { header: 'Actions', cell: (row) => (
      <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={(e) => { e.stopPropagation(); setSelectedAsset(row); setReturnDialog(true); }}>
        <RotateCcw className="w-3 h-3 mr-1" /> Return
      </Button>
    )},
  ];

  const transferColumns = [
    { header: 'Asset', accessor: 'assetName', cell: (row) => (
      <div>
        <p className="font-medium text-[#0F172A]">{row.assetName}</p>
        <p className="text-xs text-[#64748B]">{row.assetTag}</p>
      </div>
    )},
    { header: 'From', accessor: 'fromEmployee', cell: (row) => (
      <div>
        <p className="text-sm">{row.fromEmployee}</p>
        <p className="text-xs text-[#64748B]">{row.fromDepartment}</p>
      </div>
    )},
    { header: 'To', accessor: 'toEmployee', cell: (row) => (
      <div>
        <p className="text-sm">{row.toEmployee}</p>
        <p className="text-xs text-[#64748B]">{row.toDepartment}</p>
      </div>
    )},
    { header: 'Status', accessor: 'status', cell: (row) => <StatusBadge status={row.status} /> },
    { header: 'Date', accessor: 'requestDate' },
    { header: 'Actions', cell: (row) => row.status === 'requested' ? (
      <div className="flex gap-1">
        <Button size="sm" className="rounded-lg text-xs bg-[#0F766E] hover:bg-[#0E6B64]" onClick={(e) => { e.stopPropagation(); handleTransferAction(row.id, 'approved'); }}>Approve</Button>
        <Button size="sm" variant="outline" className="rounded-lg text-xs" onClick={(e) => { e.stopPropagation(); handleTransferAction(row.id, 'rejected'); }}>Reject</Button>
      </div>
    ) : null },
  ];

  return (
    <div>
      <PageHeader
        title="Asset Allocation & Transfer"
        description="Manage asset ownership and transfers"
        actions={
          <Button onClick={() => setAllocDialog(true)} className="bg-[#0F766E] hover:bg-[#0E6B64] rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Allocate Asset
          </Button>
        }
      />

      <Tabs defaultValue="allocated">
        <TabsList className="bg-white border border-[#DCE5EA] rounded-xl p-1 mb-4">
          <TabsTrigger value="allocated" className="rounded-lg data-[state=active]:bg-[#E6F7F6] data-[state=active]:text-[#0F766E]">
            Allocated Assets ({allocatedAssets.length})
          </TabsTrigger>
          <TabsTrigger value="transfers" className="rounded-lg data-[state=active]:bg-[#E6F7F6] data-[state=active]:text-[#0F766E]">
            <ArrowLeftRight className="w-4 h-4 mr-1" /> Transfers ({transfers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="allocated">
          <DataTable data={allocatedAssets} columns={allocColumns} searchPlaceholder="Search allocated assets..." />
        </TabsContent>
        <TabsContent value="transfers">
          <DataTable data={transfers} columns={transferColumns} searchPlaceholder="Search transfers..." />
        </TabsContent>
      </Tabs>

      {/* Allocate Dialog */}
      <Dialog open={allocDialog} onOpenChange={setAllocDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Allocate Asset</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Select Asset</Label>
              <Select value={allocForm.asset} onValueChange={v => setAllocForm(f => ({ ...f, asset: v }))}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Choose an asset" /></SelectTrigger>
                <SelectContent>{assets.slice(0, 50).map(a => <SelectItem key={a.id} value={a.id}>{a.name} ({a.assetTag})</SelectItem>)}</SelectContent>
              </Select>
            </div>

            {isConflict && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-800">Currently allocated to another employee.</p>
              </div>
            )}

            <div>
              <Label>Select Employee</Label>
              <Select value={allocForm.employee} onValueChange={v => setAllocForm(f => ({ ...f, employee: v }))}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Choose an employee" /></SelectTrigger>
                <SelectContent>{employees.filter(e => e.status === 'active').slice(0, 30).map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Expected Return Date</Label>
              <Input type="date" value={allocForm.returnDate} onChange={e => setAllocForm(f => ({ ...f, returnDate: e.target.value }))} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={allocForm.notes} onChange={e => setAllocForm(f => ({ ...f, notes: e.target.value }))} className="rounded-xl mt-1" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAllocDialog(false)} className="rounded-xl">Cancel</Button>
            {isConflict ? (
              <Button className="bg-[#D97706] hover:bg-[#B45309] rounded-xl">Request Transfer</Button>
            ) : (
              <Button onClick={handleAllocate} disabled={!allocForm.asset || !allocForm.employee} className="bg-[#0F766E] hover:bg-[#0E6B64] rounded-xl">Allocate</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={returnDialog} onOpenChange={setReturnDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Return Asset</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {selectedAsset && (
              <div className="p-3 bg-[#F4F7F9] rounded-xl">
                <p className="font-medium text-[#0F172A]">{selectedAsset.name}</p>
                <p className="text-xs text-[#64748B]">{selectedAsset.assetTag} • Allocated to {selectedAsset.allocatedToName}</p>
              </div>
            )}
            <div>
              <Label>Condition Notes</Label>
              <Textarea value={returnNotes} onChange={e => setReturnNotes(e.target.value)} placeholder="Describe the condition of the asset" className="rounded-xl mt-1" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReturnDialog(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleReturn} className="bg-[#0F766E] hover:bg-[#0E6B64] rounded-xl">Confirm Return</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
