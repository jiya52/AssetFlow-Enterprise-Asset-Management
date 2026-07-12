import React, { createContext, useContext, useState, useCallback } from 'react';
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

export function AppProvider({ children }) {
  const [currentRole, setCurrentRole] = useState('admin');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [departments, setDepartments] = useState(initDepts);
  const [categories, setCategories] = useState(initCats);
  const [employees, setEmployees] = useState(initEmps);
  const [assets, setAssets] = useState(initAssets);
  const [bookings, setBookings] = useState(initBookings);
  const [maintenance, setMaintenance] = useState(initMaint);
  const [audits, setAudits] = useState(initAudits);
  const [notifications, setNotifications] = useState(initNotifs);
  const [logs, setLogs] = useState(initLogs);
  const [transfers, setTransfers] = useState(initTransfers);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const addLog = useCallback((action, module, details) => {
    const newLog = {
      id: `log${Date.now()}`,
      user: 'Current User',
      userId: 'e1',
      action,
      module,
      details,
      timestamp: new Date().toISOString(),
    };
    setLogs(prev => [newLog, ...prev]);
  }, []);

  const addNotification = useCallback((type, message) => {
    const newNotif = {
      id: `n${Date.now()}`,
      type,
      message,
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  return (
    <AppContext.Provider value={{
      currentRole, setCurrentRole, ROLES,
      sidebarOpen, setSidebarOpen,
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
