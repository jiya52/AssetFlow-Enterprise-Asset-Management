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
import {
  Building2, Tags, Users, Plus, Pencil, Trash2, UserCog,
  ChevronUp, Shield, Eye
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

export default function Organization() {
  const { departments, setDepartments, categories, setCategories, employees, setEmployees, addLog } = useApp();
  const { toast } = useToast();
  const [deptDialog, setDeptDialog] = useState(false);
  const [catDialog, setCatDialog] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [editingCat, setEditingCat] = useState(null);
  const [deptForm, setDeptForm] = useState({ name: '', code: '', head: '', parent: '', status: 'active' });
  const [catForm, setCatForm] = useState({ name: '', icon: '', description: '', fields: '' });

  // Department handlers
  const openDeptDialog = (dept = null) => {
    if (dept) {
      setEditingDept(dept);
      setDeptForm({ name: dept.name, code: dept.code, head: dept.head || '', parent: dept.parent || '', status: dept.status });
    } else {
      setEditingDept(null);
      setDeptForm({ name: '', code: '', head: '', parent: '', status: 'active' });
    }
    setDeptDialog(true);
  };

  const saveDept = () => {
    if (!deptForm.name) return;
    if (editingDept) {
      setDepartments(prev => prev.map(d => d.id === editingDept.id ? { ...d, ...deptForm } : d));
      addLog('Updated', 'Department', `Updated ${deptForm.name}`);
      toast({ title: 'Department updated', description: deptForm.name });
    } else {
      const newDept = { id: `d${Date.now()}`, ...deptForm, employeeCount: 0 };
      setDepartments(prev => [...prev, newDept]);
      addLog('Created', 'Department', `Created ${deptForm.name}`);
      toast({ title: 'Department created', description: deptForm.name });
    }
    setDeptDialog(false);
  };

  // Category handlers
  const openCatDialog = (cat = null) => {
    if (cat) {
      setEditingCat(cat);
      setCatForm({ name: cat.name, icon: cat.icon, description: cat.description, fields: cat.fields.join(', ') });
    } else {
      setEditingCat(null);
      setCatForm({ name: '', icon: '', description: '', fields: '' });
    }
    setCatDialog(true);
  };

  const saveCat = () => {
    if (!catForm.name) return;
    const fields = catForm.fields.split(',').map(f => f.trim()).filter(Boolean);
    if (editingCat) {
      setCategories(prev => prev.map(c => c.id === editingCat.id ? { ...c, name: catForm.name, icon: catForm.icon, description: catForm.description, fields } : c));
      toast({ title: 'Category updated', description: catForm.name });
    } else {
      const newCat = { id: `c${Date.now()}`, name: catForm.name, icon: catForm.icon, description: catForm.description, fields, count: 0 };
      setCategories(prev => [...prev, newCat]);
      toast({ title: 'Category created', description: catForm.name });
    }
    setCatDialog(false);
  };

  const deleteCat = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    toast({ title: 'Category deleted' });
  };

  // Employee role handlers
  const changeRole = (empId, newRole) => {
    setEmployees(prev => prev.map(e => e.id === empId ? { ...e, role: newRole } : e));
    addLog('Updated', 'Employee', `Changed role to ${newRole}`);
    toast({ title: 'Role updated', description: `Employee promoted to ${newRole.replace('_', ' ')}` });
  };

  const toggleStatus = (empId) => {
    setEmployees(prev => prev.map(e => e.id === empId ? { ...e, status: e.status === 'active' ? 'inactive' : 'active' } : e));
    toast({ title: 'Status updated' });
  };

  const deptColumns = [
    { header: 'Department', accessor: 'name', cell: (row) => (
      <div>
        <p className="font-medium text-[#0F172A]">{row.name}</p>
        <p className="text-xs text-[#64748B]">{row.code}</p>
      </div>
    )},
    { header: 'Head', accessor: 'head', cell: (row) => {
      const head = employees.find(e => e.id === row.head);
      return head ? head.name : '—';
    }},
    { header: 'Parent', accessor: 'parent', cell: (row) => {
      const parent = departments.find(d => d.id === row.parent);
      return parent ? parent.name : '—';
    }},
    { header: 'Employees', accessor: 'employeeCount' },
    { header: 'Status', accessor: 'status', cell: (row) => <StatusBadge status={row.status} /> },
    { header: 'Actions', cell: (row) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); openDeptDialog(row); }} className="p-1.5 rounded-lg hover:bg-[#F4F7F9]">
          <Pencil className="w-4 h-4 text-[#64748B]" />
        </button>
      </div>
    )},
  ];

  const catColumns = [
    { header: 'Category', accessor: 'name', cell: (row) => (
      <div className="flex items-center gap-3">
        <span className="text-xl">{row.icon}</span>
        <div>
          <p className="font-medium text-[#0F172A]">{row.name}</p>
          <p className="text-xs text-[#64748B]">{row.description}</p>
        </div>
      </div>
    )},
    { header: 'Fields', accessor: 'fields', cell: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.fields.map((f, i) => (
          <span key={i} className="px-2 py-0.5 bg-[#F4F7F9] rounded text-xs text-[#64748B]">{f}</span>
        ))}
      </div>
    )},
    { header: 'Assets', accessor: 'count' },
    { header: 'Actions', cell: (row) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); openCatDialog(row); }} className="p-1.5 rounded-lg hover:bg-[#F4F7F9]">
          <Pencil className="w-4 h-4 text-[#64748B]" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); deleteCat(row.id); }} className="p-1.5 rounded-lg hover:bg-red-50">
          <Trash2 className="w-4 h-4 text-[#DC2626]" />
        </button>
      </div>
    )},
  ];

  const roleLabels = { admin: 'Admin', asset_manager: 'Asset Manager', department_head: 'Dept. Head', employee: 'Employee' };

  const empColumns = [
    { header: 'Employee', accessor: 'name', cell: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#0F766E] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-semibold">{row.name.split(' ').map(n => n[0]).join('')}</span>
        </div>
        <div>
          <p className="font-medium text-[#0F172A]">{row.name}</p>
          <p className="text-xs text-[#64748B]">{row.email}</p>
        </div>
      </div>
    )},
    { header: 'ID', accessor: 'employeeId' },
    { header: 'Department', accessor: 'departmentName' },
    { header: 'Role', accessor: 'role', cell: (row) => (
      <span className="text-sm">{roleLabels[row.role] || row.role}</span>
    )},
    { header: 'Status', accessor: 'status', cell: (row) => <StatusBadge status={row.status} /> },
    { header: 'Actions', cell: (row) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1.5 rounded-lg hover:bg-[#F4F7F9]">
            <UserCog className="w-4 h-4 text-[#64748B]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => changeRole(row.id, 'department_head')}>
            <ChevronUp className="w-4 h-4 mr-2" /> Promote to Dept. Head
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeRole(row.id, 'asset_manager')}>
            <Shield className="w-4 h-4 mr-2" /> Promote to Asset Manager
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => toggleStatus(row.id)}>
            {row.status === 'active' ? 'Deactivate' : 'Activate'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  return (
    <div>
      <PageHeader title="Organization Setup" description="Manage departments, categories, and employees" />

      <Tabs defaultValue="departments" className="space-y-4">
        <TabsList className="bg-white border border-[#DCE5EA] rounded-xl p-1">
          <TabsTrigger value="departments" className="rounded-lg data-[state=active]:bg-[#E6F7F6] data-[state=active]:text-[#0F766E]">
            <Building2 className="w-4 h-4 mr-2" /> Departments
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-lg data-[state=active]:bg-[#E6F7F6] data-[state=active]:text-[#0F766E]">
            <Tags className="w-4 h-4 mr-2" /> Asset Categories
          </TabsTrigger>
          <TabsTrigger value="employees" className="rounded-lg data-[state=active]:bg-[#E6F7F6] data-[state=active]:text-[#0F766E]">
            <Users className="w-4 h-4 mr-2" /> Employee Directory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="departments">
          <div className="flex justify-end mb-4">
            <Button onClick={() => openDeptDialog()} className="bg-[#0F766E] hover:bg-[#0E6B64] rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> Create Department
            </Button>
          </div>
          <DataTable data={departments} columns={deptColumns} searchPlaceholder="Search departments..." />
        </TabsContent>

        <TabsContent value="categories">
          <div className="flex justify-end mb-4">
            <Button onClick={() => openCatDialog()} className="bg-[#0F766E] hover:bg-[#0E6B64] rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> Create Category
            </Button>
          </div>
          <DataTable data={categories} columns={catColumns} searchPlaceholder="Search categories..." />
        </TabsContent>

        <TabsContent value="employees">
          <DataTable data={employees} columns={empColumns} searchPlaceholder="Search employees..." />
        </TabsContent>
      </Tabs>

      {/* Department Dialog */}
      <Dialog open={deptDialog} onOpenChange={setDeptDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingDept ? 'Edit Department' : 'Create Department'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name</Label><Input value={deptForm.name} onChange={e => setDeptForm(f => ({ ...f, name: e.target.value }))} className="rounded-xl mt-1" /></div>
              <div><Label>Code</Label><Input value={deptForm.code} onChange={e => setDeptForm(f => ({ ...f, code: e.target.value }))} className="rounded-xl mt-1" /></div>
            </div>
            <div>
              <Label>Department Head</Label>
              <Select value={deptForm.head} onValueChange={v => setDeptForm(f => ({ ...f, head: v }))}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Select head" /></SelectTrigger>
                <SelectContent>{employees.filter(e => e.role === 'department_head' || e.role === 'admin').map(e => (
                  <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                ))}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Parent Department</Label>
              <Select value={deptForm.parent} onValueChange={v => setDeptForm(f => ({ ...f, parent: v }))}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="None (top-level)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {departments.filter(d => d.id !== editingDept?.id).map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={deptForm.status} onValueChange={v => setDeptForm(f => ({ ...f, status: v }))}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeptDialog(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={saveDept} className="bg-[#0F766E] hover:bg-[#0E6B64] rounded-xl">
              {editingDept ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={catDialog} onOpenChange={setCatDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingCat ? 'Edit Category' : 'Create Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name</Label><Input value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} className="rounded-xl mt-1" /></div>
              <div><Label>Icon (emoji)</Label><Input value={catForm.icon} onChange={e => setCatForm(f => ({ ...f, icon: e.target.value }))} className="rounded-xl mt-1" /></div>
            </div>
            <div><Label>Description</Label><Input value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))} className="rounded-xl mt-1" /></div>
            <div><Label>Category Fields (comma-separated)</Label><Input value={catForm.fields} onChange={e => setCatForm(f => ({ ...f, fields: e.target.value }))} placeholder="e.g. Warranty Period, Model Number" className="rounded-xl mt-1" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatDialog(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={saveCat} className="bg-[#0F766E] hover:bg-[#0E6B64] rounded-xl">
              {editingCat ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
