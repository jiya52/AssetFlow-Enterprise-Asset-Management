import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';

export default function ActivityLogs() {
  const { logs } = useApp();
  const [moduleFilter, setModuleFilter] = useState('all');

  const filtered = moduleFilter === 'all' ? logs : logs.filter(l => l.module === moduleFilter);
  const modules = [...new Set(logs.map(l => l.module))];

  const columns = [
    { header: 'User', accessor: 'user', cell: (row) => (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[#0F766E] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[10px] font-semibold">{row.user.split(' ').map(n => n[0]).join('')}</span>
        </div>
        <span className="text-sm">{row.user}</span>
      </div>
    )},
    { header: 'Action', accessor: 'action', cell: (row) => (
      <span className="px-2 py-0.5 bg-[#F4F7F9] rounded text-xs font-medium text-[#0F172A]">{row.action}</span>
    )},
    { header: 'Module', accessor: 'module', cell: (row) => (
      <span className="px-2 py-0.5 bg-[#E6F7F6] rounded text-xs font-medium text-[#0F766E]">{row.module}</span>
    )},
    { header: 'Details', accessor: 'details' },
    { header: 'Timestamp', accessor: 'timestamp', cell: (row) => (
      <span className="text-xs text-[#64748B]">{new Date(row.timestamp).toLocaleString()}</span>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Activity Logs"
        description={`${logs.length} total log entries`}
        actions={
          <Button variant="outline" className="rounded-xl" onClick={() => alert('Exporting logs...')}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        }
      />

      <DataTable
        data={filtered}
        columns={columns}
        searchPlaceholder="Search logs..."
        pageSize={15}
        filters={
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-40 rounded-xl"><SelectValue placeholder="Module" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {modules.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        }
      />
    </div>
  );
}
