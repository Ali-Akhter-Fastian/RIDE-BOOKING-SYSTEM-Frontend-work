import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RiderPortal } from './pages/rider/RiderPortal';
import { DriverPortal } from './pages/driver/DriverPortal';
import { AdminPortal } from './pages/admin/AdminPortal';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { useAuthContext } from './context/AuthContext';
import { ROLES } from './constants/roles';
import { ROUTES } from './routes/routeConfig';

type Portal = 'rider' | 'driver' | 'admin';

function PortalShell() {
  const { role } = useAuthContext();
  const [activePortal, setActivePortal] = useState<Portal>('rider');

  useEffect(() => {
    if (role === ROLES.DRIVER) {
      setActivePortal('driver');
      return;
    }

    if (role === ROLES.ADMIN) {
      setActivePortal('admin');
      return;
    }

    setActivePortal('rider');
  }, [role]);

  if (role === ROLES.DRIVER) {
    // keep the shell on the driver's portal by default, but still render the switcher below
  }

  return (
    <div className="size-full flex flex-col overflow-hidden bg-[#0A0C10]">
      {/* Portal Switcher (Dev Navigation) */}
      <div className="bg-[#12151C] border-b border-[#1E2433] px-6 py-3 flex gap-4 z-50">
        <button
          onClick={() => setActivePortal('rider')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activePortal === 'rider'
              ? 'bg-[#F5A623] text-[#0A0C10] font-medium'
              : 'bg-[#1A1E28] text-[#94A3B8] hover:bg-[#1E2433]'
          }`}
        >
          🚗 Rider Portal
        </button>
        <button
          onClick={() => setActivePortal('driver')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activePortal === 'driver'
              ? 'bg-[#3B82F6] text-white font-medium'
              : 'bg-[#1A1E28] text-[#94A3B8] hover:bg-[#1E2433]'
          }`}
        >
          🚙 Driver Dashboard
        </button>
        <button
          onClick={() => setActivePortal('admin')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activePortal === 'admin'
              ? 'bg-[#8B5CF6] text-white font-medium'
              : 'bg-[#1A1E28] text-[#94A3B8] hover:bg-[#1E2433]'
          }`}
        >
          🖥️ Admin Command Center
        </button>
      </div>

      {/* Active Portal */}
      <div className="flex-1 overflow-hidden">
        {activePortal === 'rider' && <RiderPortal />}
        {activePortal === 'driver' && <DriverPortal />}
        {activePortal === 'admin' && <AdminPortal />}
      </div>
    </div>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0C10] text-white flex items-center justify-center">
        <div className="text-sm text-[#94A3B8]">Loading authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}

function PublicOnly({ children }: { children: JSX.Element }) {
  const { loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0C10] text-white flex items-center justify-center">
        <div className="text-sm text-[#94A3B8]">Loading authentication...</div>
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route
        path={ROUTES.LOGIN}
        element={(
          <PublicOnly>
            <LoginPage />
          </PublicOnly>
        )}
      />
      <Route
        path={ROUTES.REGISTER}
        element={(
          <PublicOnly>
            <RegisterPage />
          </PublicOnly>
        )}
      />
      <Route
        path={ROUTES.APP_HOME}
        element={(
          <RequireAuth>
            <PortalShell />
          </RequireAuth>
        )}
      />
      <Route
        path={ROUTES.PROFILE}
        element={(
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        )}
      />
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
