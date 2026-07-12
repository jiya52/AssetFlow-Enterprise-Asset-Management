import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { AppProvider } from '@/contexts/AppContext';

import AppLayout from '@/components/layout/AppLayout';
import AuthLogin from '@/pages/AuthLogin';
import AuthSignup from '@/pages/AuthSignup';
import Dashboard from '@/pages/Dashboard';
import Organization from '@/pages/Organization';
import Assets from '@/pages/Assets';
import AssetRegister from '@/pages/AssetRegister';
import Allocation from '@/pages/Allocation';
import Booking from '@/pages/Booking';
import MaintenancePage from '@/pages/Maintenance';
import Audit from '@/pages/Audit';
import Reports from '@/pages/Reports';
import ActivityLogs from '@/pages/ActivityLogs';
import NotificationsPage from '@/pages/Notifications';
import Profile from '@/pages/Profile';

const AuthenticatedApp = () => {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#F4F7F9]">
        <div className="w-8 h-8 border-4 border-[#DCE5EA] border-t-[#0F766E] rounded-full animate-spin"></div>
      </div>
    );
  }

  const isAuthPage = location.pathname === '/auth/login' || location.pathname === '/signup';

  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/auth/login" element={<AuthLogin />} />
      <Route path="/signup" element={<AuthSignup />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/organization" element={<Organization />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/assets/register" element={<AssetRegister />} />
        <Route path="/allocation" element={<Allocation />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/activity" element={<ActivityLogs />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AppProvider>
    </AuthProvider>
  )
}

export default App
