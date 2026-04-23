import { useState } from 'react';
import { RiderPortal } from './pages/rider/RiderPortal';
import { DriverPortal } from './pages/driver/DriverPortal';
import { AdminPortal } from './pages/admin/AdminPortal';

type Portal = 'rider' | 'driver' | 'admin';

export default function App() {
  const [activePortal, setActivePortal] = useState<Portal>('rider');

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
