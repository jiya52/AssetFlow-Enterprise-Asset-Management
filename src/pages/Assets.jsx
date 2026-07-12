import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X, Package, MapPin, Calendar, DollarSign, FileText, Clock } from 'lucide-react';

export default function Assets() {
  const { assets, categories, departments, maintenance } = useApp();
  const [statusFilter, setStatusFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState(null);

  const filtered = assets.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (catFilter !== 'all' && a.category !== catFilter) return false;
    return true;
  });

  const assetMaint = selectedAsset ? maintenance.filter(m => m.asset === selectedAsset.id) : [];

  const columns = [
    { header: 'Asset', accessor: 'name', cell: (row) => (
      <div>
        <p className="font-medium text-[#0F172A]">{row.name}</p>
        <p className="text-xs text-[#64748B]">{row.assetTag}</p>
      </div>
    )},
    { header: 'Category', accessor: 'categoryName' },
    { header: 'Location', accessor: 'location' },
    { header: 'Department', accessor: 'departmentName' },
    { header: 'Condition', accessor: 'condition' },
    { header: 'Status', accessor: 'status', cell: (row) => <StatusBadge status={row.status} /> },
    { header: 'Allocated To', accessor: 'allocatedToName', cell: (row) => row.allocatedToName || '—' },
  ];

  return (
    <div>
      <PageHeader
        title="Asset Directory"
        description={`${assets.length} assets registered`}
        actions={
          <Link to="/assets/register">
            <Button className="bg-[#0F766E] hover:bg-[#0E6B64] rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> Register Asset
            </Button>
          </Link>
        }
      />

      <DataTable
        data={filtered}
        columns={columns}
        searchPlaceholder="Search by asset tag, serial number, name..."
        onRowClick={setSelectedAsset}
        filters={
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="allocated">Allocated</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
                <SelectItem value="disposed">Disposed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger className="w-40 rounded-xl"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        }
      />

      {/* Asset Detail Drawer */}
      <Sheet open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedAsset && (
            <>
              <SheetHeader>
                <SheetTitle className="text-xl">{selectedAsset.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <Tabs defaultValue="info">
                  <TabsList className="w-full bg-[#F4F7F9] rounded-xl p-1">
                    <TabsTrigger value="info" className="flex-1 rounded-lg text-xs">Info</TabsTrigger>
                    <TabsTrigger value="history" className="flex-1 rounded-lg text-xs">Allocation</TabsTrigger>
                    <TabsTrigger value="maintenance" className="flex-1 rounded-lg text-xs">Maintenance</TabsTrigger>
                    <TabsTrigger value="lifecycle" className="flex-1 rounded-lg text-xs">Lifecycle</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="mt-4 space-y-4">
                    <div className="flex items-center justify-between p-3 bg-[#F4F7F9] rounded-xl">
                      <span className="text-sm text-[#64748B]">Status</span>
                      <StatusBadge status={selectedAsset.status} />
                    </div>
                    {[
                      { icon: Package, label: 'Asset Tag', value: selectedAsset.assetTag },
                      { icon: FileText, label: 'Serial Number', value: selectedAsset.serialNumber },
                      { icon: MapPin, label: 'Location', value: selectedAsset.location },
                      { icon: Calendar, label: 'Acquired', value: selectedAsset.acquisitionDate },
                      { icon: DollarSign, label: 'Cost', value: `$${selectedAsset.acquisitionCost.toLocaleString()}` },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3">
                        <item.icon className="w-4 h-4 text-[#64748B]" />
                        <div className="flex-1">
                          <p className="text-xs text-[#64748B]">{item.label}</p>
                          <p className="text-sm font-medium text-[#0F172A]">{item.value}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-3 p-3">
                      <Package className="w-4 h-4 text-[#64748B]" />
                      <div className="flex-1">
                        <p className="text-xs text-[#64748B]">Category</p>
                        <p className="text-sm font-medium">{selectedAsset.categoryName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3">
                      <Package className="w-4 h-4 text-[#64748B]" />
                      <div className="flex-1">
                        <p className="text-xs text-[#64748B]">Condition</p>
                        <p className="text-sm font-medium">{selectedAsset.condition}</p>
                      </div>
                    </div>
                    {selectedAsset.isBookable && (
                      <div className="p-3 bg-[#E6F7F6] rounded-xl text-sm text-[#0F766E] font-medium">
                        ✓ This asset is bookable
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="history" className="mt-4">
                    <div className="space-y-3">
                      {selectedAsset.allocatedTo ? (
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <p className="text-sm font-medium text-blue-800">Currently Allocated</p>
                          <p className="text-sm text-blue-700 mt-1">To: {selectedAsset.allocatedToName}</p>
                          <p className="text-xs text-blue-600 mt-1">Since: 2026-05-15</p>
                        </div>
                      ) : (
                        <p className="text-sm text-[#64748B] text-center py-8">No active allocation</p>
                      )}
                      {[
                        { emp: 'Sarah Johnson', from: '2026-01-10', to: '2026-03-20' },
                        { emp: 'Michael Davis', from: '2025-08-01', to: '2025-12-30' },
                      ].map((h, i) => (
                        <div key={i} className="p-3 border border-[#DCE5EA] rounded-xl">
                          <p className="text-sm font-medium text-[#0F172A]">{h.emp}</p>
                          <p className="text-xs text-[#64748B]">{h.from} → {h.to}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="maintenance" className="mt-4">
                    {assetMaint.length === 0 ? (
                      <p className="text-sm text-[#64748B] text-center py-8">No maintenance records</p>
                    ) : (
                      <div className="space-y-3">
                        {assetMaint.map(m => (
                          <div key={m.id} className="p-3 border border-[#DCE5EA] rounded-xl">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium text-[#0F172A]">{m.issue}</p>
                              <StatusBadge status={m.status} />
                            </div>
                            <p className="text-xs text-[#64748B] mt-1">Priority: {m.priority} • {m.createdDate}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="lifecycle" className="mt-4">
                    <div className="space-y-4">
                      {[
                        { label: 'Acquired', date: selectedAsset.acquisitionDate, color: '#0F766E' },
                        { label: 'Deployed', date: '2026-02-01', color: '#059669' },
                        { label: 'First Maintenance', date: '2026-04-15', color: '#D97706' },
                        { label: 'Current Status', date: 'Now', color: '#475569' },
                      ].map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="relative">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: step.color }} />
                            {i < 3 && <div className="absolute top-3 left-1.5 -translate-x-1/2 w-px h-8 bg-[#DCE5EA]" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#0F172A]">{step.label}</p>
                            <p className="text-xs text-[#64748B]">{step.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
