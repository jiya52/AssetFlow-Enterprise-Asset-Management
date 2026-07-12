import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import {
  departments as initDepts,
  assetCategories as initCats,
  employees as initEmps,
  assets as initAssets,
  bookings as initBookings,
  maintenanceRequests as initMaint,
  auditCycles as initAudits,
  notifications as initNotifs,
  activityLogs as initLogs,
  transferRequests as initTransfers,
} from '@/data/dummyData';

const AppContext = createContext();

const ROLES = ['admin', 'asset_manager', 'department_head', 'employee'];

const enrichData = (depts, cats, emps, asts, bks, maints, auds, notifs, logsList, trs) => {
  const deptsMap = new Map(depts.map(d => [d.id, d]));
  const catsMap = new Map(cats.map(c => [c.id, c]));
  const empsMap = new Map(emps.map(e => [e.id, e]));

  const enrichedEmps = emps.map(e => ({
    ...e,
    departmentName: deptsMap.get(e.department)?.name || '',
  }));
  const enrichedEmpsMap = new Map(enrichedEmps.map(e => [e.id, e]));

  const enrichedAssets = asts.map(a => ({
    ...a,
    categoryName: catsMap.get(a.category)?.name || '',
    departmentName: deptsMap.get(a.department)?.name || '',
    allocatedToName: enrichedEmpsMap.get(a.allocatedTo)?.name || '',
  }));
  const enrichedAssetsMap = new Map(enrichedAssets.map(a => [a.id, a]));

  const enrichedBookings = bks.map(b => {
    const asset = enrichedAssetsMap.get(b.resource);
    const emp = enrichedEmpsMap.get(b.bookedBy);
    return {
      ...b,
      resourceName: asset?.name || '',
      resourceCategory: asset?.categoryName || '',
      bookedByName: emp?.name || '',
      department: emp?.department || '',
      departmentName: emp?.departmentName || '',
    };
  });

  const enrichedMaintenance = maints.map(m => {
    const asset = enrichedAssetsMap.get(m.asset);
    const emp = enrichedEmpsMap.get(m.reportedBy);
    return {
      ...m,
      assetName: asset?.name || '',
      assetTag: asset?.assetTag || '',
      reportedByName: emp?.name || '',
    };
  });

  const enrichedAudits = auds.map(au => {
    const dept = deptsMap.get(au.department);
    const emp = enrichedEmpsMap.get(au.auditor);
    return {
      ...au,
      departmentName: dept?.name || '',
      auditor: emp?.name || '',
      auditorId: emp?.id || '',
    };
  });

  const enrichedLogs = logsList.map(l => {
    const emp = enrichedEmpsMap.get(l.userId);
    return {
      ...l,
      user: emp?.name || 'System',
    };
  });

  const enrichedTransfers = trs.map(t => {
    const asset = enrichedAssetsMap.get(t.asset);
    const fromEmp = enrichedEmpsMap.get(t.fromEmployee);
    const toEmp = enrichedEmpsMap.get(t.toEmployee);
    return {
      ...t,
      assetName: asset?.name || '',
      assetTag: asset?.assetTag || '',
      fromEmployee: fromEmp?.name || '',
      fromDepartment: fromEmp?.departmentName || '',
      toEmployee: toEmp?.name || '',
      toDepartment: toEmp?.departmentName || '',
    };
  });

  return {
    departments: depts,
    categories: cats,
    employees: enrichedEmps,
    assets: enrichedAssets,
    bookings: enrichedBookings,
    maintenance: enrichedMaintenance,
    audits: enrichedAudits,
    notifications: notifs,
    logs: enrichedLogs,
    transfers: enrichedTransfers,
  };
};

export function AppProvider({ children }) {
  const { user, isAuthenticated, authChecked } = useAuth();

  const [currentRole, setCurrentRole] = useState('admin');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  const [departments, setDepartmentsState] = useState([]);
  const [categories, setCategoriesState] = useState([]);
  const [employees, setEmployeesState] = useState([]);
  const [assets, setAssetsState] = useState([]);
  const [bookings, setBookingsState] = useState([]);
  const [maintenance, setMaintenanceState] = useState([]);
  const [audits, setAuditsState] = useState([]);
  const [notifications, setNotificationsState] = useState([]);
  const [logs, setLogsState] = useState([]);
  const [transfers, setTransfersState] = useState([]);

  const stateSetters = {
    departments: setDepartmentsState,
    categories: setCategoriesState,
    employees: setEmployeesState,
    assets: setAssetsState,
    bookings: setBookingsState,
    maintenance: setMaintenanceState,
    audits: setAuditsState,
    notifications: setNotificationsState,
    logs: setLogsState,
    transfers: setTransfersState,
  };

  const seedDatabase = async () => {
    console.log('[SQLite Seed] Database is empty. Seeding initial dummy data...');
    const oldIdToNewIdMap = {};

    const postItem = async (resource, item) => {
      const res = await fetch(`/api/${resource}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      return res.json();
    };

    const putItem = async (resource, id, item) => {
      await fetch(`/api/${resource}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
    };

    // 1. Seed Departments
    for (const d of initDepts.slice(0, 5)) {
      const cleaned = {
        name: d.name,
        head: '',
        parent: '',
        status: d.status,
        employeeCount: d.employeeCount,
        code: d.code,
      };
      const created = await postItem('departments', cleaned);
      oldIdToNewIdMap[d.id] = created.id;
    }

    // 2. Seed Categories
    for (const c of initCats) {
      const cleaned = {
        name: c.name,
        icon: c.icon,
        fields: c.fields,
        count: c.count,
        description: c.description,
      };
      const created = await postItem('categories', cleaned);
      oldIdToNewIdMap[c.id] = created.id;
    }

    // 3. Seed Employees
    for (const e of initEmps.slice(0, 15)) {
      const cleaned = {
        employeeId: e.employeeId,
        name: e.name,
        email: e.email,
        phone: e.phone,
        department: oldIdToNewIdMap[e.department] || '',
        role: e.role,
        status: e.status,
        joinDate: e.joinDate,
        avatar: e.avatar,
      };
      const created = await postItem('employees', cleaned);
      oldIdToNewIdMap[e.id] = created.id;
    }

    // Update Department Head relationship using mapped employee IDs
    const resDepts = await fetch('/api/departments');
    const deptsList = await resDepts.json();
    for (const d of deptsList) {
      const originalDept = initDepts.find(x => x.name === d.name);
      if (originalDept && originalDept.head) {
        const newHeadId = oldIdToNewIdMap[originalDept.head];
        if (newHeadId) {
          await putItem('departments', d.id, { head: newHeadId });
        }
      }
    }

    // 4. Seed Assets
    for (const a of initAssets.slice(0, 25)) {
      const cleaned = {
        name: a.name,
        category: oldIdToNewIdMap[a.category] || '',
        assetTag: a.assetTag,
        serialNumber: a.serialNumber,
        acquisitionDate: a.acquisitionDate,
        acquisitionCost: a.acquisitionCost,
        condition: a.condition,
        location: a.location,
        status: a.status,
        department: oldIdToNewIdMap[a.department] || '',
        allocatedTo: oldIdToNewIdMap[a.allocatedTo] || '',
        isBookable: a.isBookable,
        photo: a.photo,
        documents: a.documents,
      };
      const created = await postItem('assets', cleaned);
      oldIdToNewIdMap[a.id] = created.id;
    }

    // 5. Seed Bookings
    for (const b of initBookings.slice(0, 15)) {
      const cleaned = {
        resource: oldIdToNewIdMap[b.resource] || '',
        bookedBy: oldIdToNewIdMap[b.bookedBy] || '',
        date: b.date,
        startTime: b.startTime,
        endTime: b.endTime,
        duration: b.duration,
        purpose: b.purpose,
        status: b.status,
      };
      await postItem('bookings', cleaned);
    }

    // 6. Seed Maintenance Requests
    for (const m of initMaint.slice(0, 10)) {
      const cleaned = {
        asset: oldIdToNewIdMap[m.asset] || '',
        reportedBy: oldIdToNewIdMap[m.reportedBy] || '',
        issue: m.issue,
        priority: m.priority,
        status: m.status,
        technician: m.technician,
        createdDate: m.createdDate,
        resolvedDate: m.resolvedDate,
        notes: m.notes,
      };
      await postItem('maintenance', cleaned);
    }

    // 7. Seed Audit Cycles
    for (const au of initAudits.slice(0, 5)) {
      const cleaned = {
        name: au.name,
        department: oldIdToNewIdMap[au.department] || '',
        location: au.location,
        startDate: au.startDate,
        endDate: au.endDate,
        status: au.status,
        auditor: oldIdToNewIdMap[au.auditorId] || '',
        totalAssets: au.totalAssets,
        verified: au.verified,
        missing: au.missing,
        damaged: au.damaged,
        progress: au.progress,
        locked: au.locked,
      };
      await postItem('audits', cleaned);
    }

    // 8. Seed Notifications
    for (const n of initNotifs.slice(0, 10)) {
      const cleaned = {
        userId: oldIdToNewIdMap[n.relatedId] || 'system',
        type: n.type,
        message: n.message,
        read: n.read,
        timestamp: n.timestamp,
        relatedId: oldIdToNewIdMap[n.relatedId] || '',
      };
      await postItem('notifications', cleaned);
    }

    // 9. Seed Activity Logs
    for (const l of initLogs.slice(0, 15)) {
      const cleaned = {
        userId: oldIdToNewIdMap[l.userId] || 'system',
        action: l.action,
        module: l.module,
        details: l.details,
        timestamp: l.timestamp,
      };
      await postItem('logs', cleaned);
    }

    // 10. Seed Transfer Requests
    for (const t of initTransfers.slice(0, 5)) {
      const cleaned = {
        asset: oldIdToNewIdMap[t.asset] || '',
        fromEmployee: oldIdToNewIdMap[t.fromEmployee] || '',
        toEmployee: oldIdToNewIdMap[t.toEmployee] || '',
        status: t.status,
        requestDate: t.requestDate,
        notes: t.notes,
      };
      await postItem('transfers', cleaned);
    }

    console.log('[SQLite Seed] Seeding completed successfully!');
  };

  const syncEntityDelta = async (entityName, prevItems, nextItems, schemaFields) => {
    if (useFallback) return;

    const prevMap = new Map(prevItems.map(item => [item.id, item]));
    const nextMap = new Map(nextItems.map(item => [item.id, item]));

    // 1. Detect Deleted
    for (const [id] of prevMap.entries()) {
      if (!nextMap.has(id)) {
        try {
          await fetch(`/api/${entityName}/${id}`, { method: 'DELETE' });
        } catch (e) {
          console.error(`Failed to delete ${entityName} ${id}:`, e);
        }
      }
    }

    // 2. Detect Added & Updated
    for (const [id, item] of nextMap.entries()) {
      const prevItem = prevMap.get(id);

      const cleanedItem = {};
      schemaFields.forEach(field => {
        if (item[field] !== undefined) {
          cleanedItem[field] = item[field];
        }
      });

      if (!prevItem) {
        const isTempId = String(id).startsWith('a') || String(id).startsWith('b') ||
                         String(id).startsWith('m') || String(id).startsWith('au') ||
                         String(id).startsWith('n') || String(id).startsWith('log') ||
                         String(id).startsWith('tr') || String(id).startsWith('d') ||
                         String(id).startsWith('e') || String(id).startsWith('c');

        try {
          const res = await fetch(`/api/${entityName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cleanedItem)
          });
          const created = await res.json();
          if (isTempId) {
            const stateSetter = stateSetters[entityName];
            if (stateSetter) {
              stateSetter(prev => prev.map(x => x.id === id ? { ...x, id: created.id } : x));
            }
          }
        } catch (e) {
          console.error(`Failed to create ${entityName}:`, e);
        }
      } else {
        let hasChanged = false;
        for (const field of schemaFields) {
          if (JSON.stringify(item[field]) !== JSON.stringify(prevItem[field])) {
            hasChanged = true;
            break;
          }
        }

        if (hasChanged) {
          try {
            await fetch(`/api/${entityName}/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(cleanedItem)
            });
          } catch (e) {
            console.error(`Failed to update ${entityName} ${id}:`, e);
          }
        }
      }
    }
  };

  const loadData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const fetchResource = async (resource) => {
        const res = await fetch(`/api/${resource}`);
        if (!res.ok) throw new Error(`Failed to fetch ${resource}`);
        return res.json();
      };

      let depts = await fetchResource('departments');
      let cats = await fetchResource('categories');

      if (depts.length === 0 || cats.length === 0) {
        await seedDatabase();
        depts = await fetchResource('departments');
        cats = await fetchResource('categories');
      }

      const emps = await fetchResource('employees');
      const asts = await fetchResource('assets');
      const bks = await fetchResource('bookings');
      const maints = await fetchResource('maintenance');
      const auds = await fetchResource('audits');
      const notifs = await fetchResource('notifications');
      const logsList = await fetchResource('logs');
      const trs = await fetchResource('transfers');

      const enriched = enrichData(depts, cats, emps, asts, bks, maints, auds, notifs, logsList, trs);

      setDepartmentsState(enriched.departments);
      setCategoriesState(enriched.categories);
      setEmployeesState(enriched.employees);
      setAssetsState(enriched.assets);
      setBookingsState(enriched.bookings);
      setMaintenanceState(enriched.maintenance);
      setAuditsState(enriched.audits);
      setNotificationsState(enriched.notifications);
      setLogsState(enriched.logs);
      setTransfersState(enriched.transfers);
      setUseFallback(false);
    } catch (err) {
      console.warn('[SQL Express DB] Failed to connect to local SQL backend. Falling back to local state.', err);
      setDepartmentsState(initDepts);
      setCategoriesState(initCats);
      setEmployeesState(initEmps);
      setAssetsState(initAssets);
      setBookingsState(initBookings);
      setMaintenanceState(initMaint);
      setAuditsState(initAudits);
      setNotificationsState(initNotifs);
      setLogsState(initLogs);
      setTransfersState(initTransfers);
      setUseFallback(true);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (authChecked && isAuthenticated) {
      loadData();
    } else if (authChecked && !isAuthenticated) {
      setIsLoadingData(false);
    }
  }, [authChecked, isAuthenticated, loadData]);

  useEffect(() => {
    if (user && employees.length > 0) {
      const match = employees.find(e => e.email === user.email);
      if (match) {
        setCurrentRole(match.role);
      } else {
        const createEmp = async () => {
          const newEmp = {
            employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
            name: user.name || user.email.split('@')[0],
            email: user.email,
            phone: '',
            department: '',
            role: user.role || 'employee',
            status: 'active',
            joinDate: new Date().toISOString().split('T')[0],
            avatar: '',
          };
          try {
            const res = await fetch('/api/employees', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newEmp)
            });
            const created = await res.json();
            setEmployeesState(prev => [...prev, { ...created, departmentName: '' }]);
            setCurrentRole(created.role);
          } catch (e) {
            console.error('Failed to auto-register employee for user:', e);
          }
        };
        createEmp();
      }
    }
  }, [user, employees]);

  const makeProxy = (entityName, stateSetter, schemaFields) => {
    return (updater) => {
      stateSetter(prev => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        setTimeout(() => syncEntityDelta(entityName, prev, next, schemaFields), 0);
        return next;
      });
    };
  };

  const setDepartments = useCallback(makeProxy('departments', setDepartmentsState, ['name', 'head', 'parent', 'status', 'employeeCount', 'code']), [useFallback]);
  const setCategories = useCallback(makeProxy('categories', setCategoriesState, ['name', 'icon', 'fields', 'count', 'description']), [useFallback]);
  const setEmployees = useCallback(makeProxy('employees', setEmployeesState, ['employeeId', 'name', 'email', 'phone', 'department', 'role', 'status', 'joinDate', 'avatar']), [useFallback]);
  const setAssets = useCallback(makeProxy('assets', setAssetsState, ['name', 'category', 'assetTag', 'serialNumber', 'acquisitionDate', 'acquisitionCost', 'condition', 'location', 'status', 'department', 'allocatedTo', 'isBookable', 'photo', 'documents']), [useFallback]);
  const setBookings = useCallback(makeProxy('bookings', setBookingsState, ['resource', 'bookedBy', 'date', 'startTime', 'endTime', 'duration', 'purpose', 'status']), [useFallback]);
  const setMaintenance = useCallback(makeProxy('maintenance', setMaintenanceState, ['asset', 'reportedBy', 'issue', 'priority', 'status', 'technician', 'createdDate', 'resolvedDate', 'notes']), [useFallback]);
  const setAudits = useCallback(makeProxy('audits', setAuditsState, ['name', 'department', 'location', 'startDate', 'endDate', 'status', 'auditor', 'totalAssets', 'verified', 'missing', 'damaged', 'progress', 'locked']), [useFallback]);
  const setNotifications = useCallback(makeProxy('notifications', setNotificationsState, ['userId', 'type', 'message', 'read', 'timestamp', 'relatedId']), [useFallback]);
  const setLogs = useCallback(makeProxy('logs', setLogsState, ['userId', 'action', 'module', 'details', 'timestamp']), [useFallback]);
  const setTransfers = useCallback(makeProxy('transfers', setTransfersState, ['asset', 'fromEmployee', 'toEmployee', 'status', 'requestDate', 'notes']), [useFallback]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [setNotifications]);

  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, [setNotifications]);

  const addLog = useCallback((action, module, details) => {
    const currentEmp = employees.find(e => e.email === user?.email);
    const newLog = {
      id: `log${Date.now()}`,
      user: currentEmp?.name || 'System',
      userId: currentEmp?.id || 'system',
      action,
      module,
      details,
      timestamp: new Date().toISOString(),
    };
    setLogs(prev => [newLog, ...prev]);
  }, [user, employees, setLogs]);

  const addNotification = useCallback((type, message, relatedId = '') => {
    const currentEmp = employees.find(e => e.email === user?.email);
    const newNotif = {
      id: `n${Date.now()}`,
      userId: currentEmp?.id || 'system',
      type,
      message,
      read: false,
      timestamp: new Date().toISOString(),
      relatedId: relatedId || '',
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, [user, employees, setNotifications]);

  return (
    <AppContext.Provider value={{
      currentRole, setCurrentRole, ROLES,
      sidebarOpen, setSidebarOpen,
      isLoadingData,
      departments, setDepartments,
      categories, setCategories,
      employees, setEmployees,
      assets, setAssets,
      bookings, setBookings,
      maintenance, setMaintenance,
      audits, setAudits,
      notifications, setNotifications,
      logs, setLogs,
      transfers, setTransfers,
      unreadCount, markAllRead, markRead,
      addLog, addNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
