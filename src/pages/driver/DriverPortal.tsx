import { useState } from 'react';
import { Car, DollarSign, TrendingUp, Phone, MessageSquare, Navigation, CheckCircle, XCircle, Clock, Star, User, FileText } from 'lucide-react';
import { MapView } from '../../components/map/RideMap';

type DriverScreen = 'home' | 'incoming' | 'active' | 'earnings' | 'profile';

export function DriverPortal() {
  const [screen, setScreen] = useState<DriverScreen>('home');
  const [isOnline, setIsOnline] = useState(false);

  return (
    <div className="size-full flex flex-col overflow-hidden">
      <Header screen={screen} setScreen={setScreen} />

      <div className="flex-1 relative overflow-hidden">
        {screen === 'home' && <HomeScreen isOnline={isOnline} setIsOnline={setIsOnline} setScreen={setScreen} />}
        {screen === 'incoming' && <IncomingRequestScreen setScreen={setScreen} />}
        {screen === 'active' && <ActiveRideScreen setScreen={setScreen} />}
        {screen === 'earnings' && <EarningsScreen setScreen={setScreen} />}
        {screen === 'profile' && <ProfileScreen setScreen={setScreen} />}
      </div>
    </div>
  );
}

function Header({ screen, setScreen }: any) {
  return (
    <header className="h-16 bg-gradient-to-r from-[#12151C] via-[#1A1E28] to-[#12151C] border-b border-[#3B82F6]/20 flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setScreen('home')}>
          <Car className="w-6 h-6 text-[#3B82F6]" />
          <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            RideFlow Driver
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => setScreen('earnings')} className="p-2 hover:bg-[#1A1E28] rounded-lg transition-colors">
          <DollarSign className="w-5 h-5 text-[#94A3B8]" />
        </button>
        <button onClick={() => setScreen('profile')} className="p-2 hover:bg-[#1A1E28] rounded-lg transition-colors">
          <User className="w-5 h-5 text-[#94A3B8]" />
        </button>
      </div>
    </header>
  );
}

function HomeScreen({ isOnline, setIsOnline, setScreen }: any) {
  return (
    <>
      <MapView />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="bg-[#12151C] border border-[#1E2433] rounded-2xl p-8 max-w-md w-full shadow-2xl pointer-events-auto">
          <div className="text-center mb-8">
            <button
              onClick={() => {
                setIsOnline(!isOnline);
                if (!isOnline) {
                  setTimeout(() => setScreen('incoming'), 2000);
                }
              }}
              className={`relative w-48 h-48 mx-auto rounded-full transition-all duration-500 ${
                isOnline
                  ? 'bg-gradient-to-br from-[#10B981] to-[#059669] shadow-2xl shadow-[#10B981]/50'
                  : 'bg-[#1A1E28] border-4 border-[#1E2433]'
              }`}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {isOnline && (
                  <div className="absolute inset-0 rounded-full bg-[#10B981] opacity-30 animate-ping"></div>
                )}
                <div className={`text-3xl font-bold mb-2 ${isOnline ? 'text-white' : 'text-[#94A3B8]'}`} style={{ fontFamily: 'var(--font-display)' }}>
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </div>
                <div className={`text-sm ${isOnline ? 'text-white/80' : 'text-[#94A3B8]'}`}>
                  {isOnline ? 'Ready for rides' : 'Tap to go online'}
                </div>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A1E28] rounded-xl p-4 border border-[#1E2433]">
              <div className="text-sm text-[#94A3B8] mb-1">Today's Earnings</div>
              <div className="text-2xl font-bold text-[#3B82F6]" style={{ fontFamily: 'var(--font-mono)' }}>
                $48.20
              </div>
            </div>
            <div className="bg-[#1A1E28] rounded-xl p-4 border border-[#1E2433]">
              <div className="text-sm text-[#94A3B8] mb-1">Rides Today</div>
              <div className="text-2xl font-bold text-[#3B82F6]" style={{ fontFamily: 'var(--font-mono)' }}>
                6 trips
              </div>
            </div>
          </div>

          {isOnline && (
            <div className="mt-4 p-4 bg-gradient-to-r from-[#3B82F6]/20 to-[#8B5CF6]/20 border border-[#3B82F6]/30 rounded-xl">
              <div className="text-sm text-[#3B82F6] font-medium">
                🎯 Complete 3 more rides for a $5 bonus!
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function IncomingRequestScreen({ setScreen }: any) {
  const [countdown, setCountdown] = useState(15);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0A0C10]/95 z-20 animate-in fade-in duration-300">
      <div className="bg-[#12151C] border-2 border-[#F59E0B] rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-[#F59E0B]/20 animate-pulse">
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-[#F59E0B] flex items-center justify-center">
              <div className="text-3xl font-bold text-[#F59E0B]" style={{ fontFamily: 'var(--font-mono)' }}>
                {countdown}
              </div>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-[#F59E0B] animate-ping opacity-30"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            New Ride Request!
          </h2>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-[#1A1E28] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F5A623] to-[#F59E0B] rounded-full flex items-center justify-center text-sm font-bold">
                  SM
                </div>
                <div>
                  <div className="font-medium">Sara M.</div>
                  <div className="text-sm text-[#94A3B8] flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                    4.6
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#3B82F6]" style={{ fontFamily: 'var(--font-mono)' }}>
                  $6.40
                </div>
                <div className="text-xs text-[#94A3B8]">Est. fare</div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center text-xs mt-0.5">
                  P
                </div>
                <div className="flex-1">
                  <div className="text-[#94A3B8]">Pickup</div>
                  <div>Downtown Plaza • 0.8 km away</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[#EF4444] flex items-center justify-center text-xs mt-0.5">
                  D
                </div>
                <div className="flex-1">
                  <div className="text-[#94A3B8]">Dropoff</div>
                  <div>Airport Terminal 2 • 7.2 km trip</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setScreen('home')}
            className="flex items-center justify-center gap-2 bg-[#1A1E28] hover:bg-[#EF4444]/20 border-2 border-[#EF4444] text-[#EF4444] py-4 rounded-xl font-medium transition-all"
          >
            <XCircle className="w-5 h-5" />
            DECLINE
          </button>
          <button
            onClick={() => setScreen('active')}
            className="flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white py-4 rounded-xl font-medium transition-all shadow-lg shadow-[#10B981]/30"
          >
            <CheckCircle className="w-5 h-5" />
            ACCEPT
          </button>
        </div>

        <div className="mt-4 h-1 bg-[#1E2433] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#10B981] via-[#F59E0B] to-[#EF4444] transition-all duration-1000"
            style={{ width: `${(countdown / 15) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function ActiveRideScreen({ setScreen }: any) {
  return (
    <>
      <MapView />
      <div className="absolute top-0 left-0 right-0 bg-[#12151C] border-b border-[#1E2433] p-4 z-10 shadow-lg">
        <div className="flex items-center gap-3 bg-[#1A1E28] rounded-lg p-3 border border-[#3B82F6]/30">
          <Navigation className="w-5 h-5 text-[#3B82F6]" />
          <div className="flex-1">
            <div className="text-sm font-medium">Turn right on Shahrah-e-Faisal</div>
            <div className="text-xs text-[#94A3B8]">in 200 meters</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-[#3B82F6]" style={{ fontFamily: 'var(--font-mono)' }}>
              12 min
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-[#12151C] border-t border-[#1E2433] p-6 z-10 shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#F5A623] to-[#F59E0B] rounded-full flex items-center justify-center text-lg font-bold">
            SM
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Sara M.</h3>
            <p className="text-sm text-[#94A3B8]">Pickup: Downtown Plaza</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-[#3B82F6]" style={{ fontFamily: 'var(--font-mono)' }}>
              $6.40
            </div>
            <div className="text-xs text-[#94A3B8]">Running</div>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <button className="flex-1 bg-[#1A1E28] hover:bg-[#1E2433] border border-[#1E2433] py-3 rounded-lg flex items-center justify-center gap-2">
            <Phone className="w-5 h-5 text-[#3B82F6]" />
            Call
          </button>
          <button className="flex-1 bg-[#1A1E28] hover:bg-[#1E2433] border border-[#1E2433] py-3 rounded-lg flex items-center justify-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#3B82F6]" />
            Message
          </button>
        </div>

        <button
          onClick={() => setScreen('home')}
          className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-4 rounded-lg font-medium shadow-lg"
        >
          Complete Trip
        </button>
      </div>
    </>
  );
}

function EarningsScreen({ setScreen }: any) {
  const earnings = [
    { time: '14:32', route: 'Downtown → Airport', fare: '$18.50', rating: 5 },
    { time: '12:15', route: 'Mall → Office District', fare: '$12.30', rating: 5 },
    { time: '10:45', route: 'Home Area → Shopping Center', fare: '$8.20', rating: 4 },
    { time: '09:20', route: 'Station → University', fare: '$6.40', rating: 5 },
  ];

  return (
    <div className="size-full bg-[#0A0C10] p-6 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>Earnings Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Earnings', value: '$248.50', color: 'text-[#3B82F6]' },
            { label: 'Total Trips', value: '34', color: 'text-[#10B981]' },
            { label: 'Online Hours', value: '22h 14m', color: 'text-[#F59E0B]' },
            { label: 'Avg. Rating', value: '4.91', color: 'text-[#F5A623]' },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#12151C] border border-[#1E2433] rounded-xl p-4">
              <div className="text-sm text-[#94A3B8] mb-2">{stat.label}</div>
              <div className={`text-2xl font-bold ${stat.color}`} style={{ fontFamily: 'var(--font-mono)' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#12151C] border border-[#1E2433] rounded-xl p-6 mb-6">
          <h3 className="text-lg mb-4">Today's Trips</h3>
          <div className="space-y-3">
            {earnings.map((trip, i) => (
              <div key={i} className="bg-[#1A1E28] rounded-lg p-4 flex items-center justify-between hover:border-l-4 hover:border-[#3B82F6] transition-all">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-[#94A3B8]" style={{ fontFamily: 'var(--font-mono)' }}>
                    {trip.time}
                  </div>
                  <div>
                    <div className="font-medium">{trip.route}</div>
                    <div className="text-sm text-[#94A3B8] flex items-center gap-1">
                      {Array.from({ length: trip.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-[#3B82F6]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {trip.fare}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setScreen('home')}
          className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white px-6 py-3 rounded-lg"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

function ProfileScreen({ setScreen }: any) {
  return (
    <div className="size-full bg-[#0A0C10] p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>Driver Profile</h2>

        <div className="bg-[#12151C] border border-[#1E2433] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-full flex items-center justify-center text-3xl font-bold">
              AK
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">Ahmad K.</h3>
              <div className="flex items-center gap-2 text-[#F59E0B] mb-2">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-lg" style={{ fontFamily: 'var(--font-mono)' }}>4.91</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#10B981]/20 border border-[#10B981] rounded-full">
                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                <span className="text-sm text-[#10B981]">Verified Driver</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Acceptance Rate', value: '94%' },
              { label: 'Completion Rate', value: '98%' },
              { label: 'Cancellation Rate', value: '2%' },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#1A1E28] rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-[#3B82F6]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {stat.value}
                </div>
                <div className="text-xs text-[#94A3B8] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm text-[#94A3B8] mb-3">Documents</h4>
            {[
              { name: 'Driver License', status: 'Verified', color: 'text-[#10B981]' },
              { name: 'Vehicle Registration', status: 'Verified', color: 'text-[#10B981]' },
              { name: 'Insurance', status: 'Verified', color: 'text-[#10B981]' },
            ].map((doc) => (
              <div key={doc.name} className="flex items-center justify-between bg-[#1A1E28] rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#3B82F6]" />
                  <span>{doc.name}</span>
                </div>
                <div className={`text-sm ${doc.color} flex items-center gap-1`}>
                  <CheckCircle className="w-4 h-4" />
                  {doc.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setScreen('home')}
          className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white px-6 py-3 rounded-lg"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
