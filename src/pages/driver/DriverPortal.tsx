import { useEffect, useState } from 'react';
import { Car, DollarSign, TrendingUp, Phone, MessageSquare, Navigation, CheckCircle, XCircle, Clock, Star, User, FileText } from 'lucide-react';
import ProfilePage from '../ProfilePage';
import { MapView } from '../../components/map/RideMap';
import { useDriverLocation } from '../../hooks/useDriverLocation';
import { driverApi } from '../../api/driverApi';
import { matchingApi } from '../../api/matchingApi';
import { rideApi } from '../../api/rideApi';

type DriverScreen = 'home' | 'incoming' | 'active' | 'earnings' | 'profile';

export function DriverPortal() {
  const [screen, setScreen] = useState<DriverScreen>('home');
  const [isOnline, setIsOnline] = useState(false);
  const [incomingRide, setIncomingRide] = useState<any>(null);
  const [activeRide, setActiveRide] = useState<any>(null);
  const [loadingIncomingRide, setLoadingIncomingRide] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setIncomingRide(null);
      setActiveRide(null);
      setLoadingIncomingRide(false);
      return;
    }

    if (activeRide) {
      setLoadingIncomingRide(false);
      return;
    }

    let cancelled = false;

    const loadIncomingRide = async () => {
      setLoadingIncomingRide(true);
      try {
        const { data } = await driverApi.activeRequest();
        if (cancelled) return;

        const ride = data?.ride ?? null;
        setIncomingRide(ride);
      } catch {
        if (!cancelled) setIncomingRide(null);
      } finally {
        if (!cancelled) setLoadingIncomingRide(false);
      }
    };

    loadIncomingRide();
    const interval = window.setInterval(loadIncomingRide, 3000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [isOnline, screen, activeRide]);

  return (
    <div className="size-full flex flex-col overflow-hidden">
      <Header screen={screen} setScreen={setScreen} />

      <div className="flex-1 relative overflow-hidden">
        {screen === 'home' && <HomeScreen isOnline={isOnline} setIsOnline={setIsOnline} setScreen={setScreen} />}
        {screen === 'active' && (
          <ActiveRideScreen
            setScreen={setScreen}
            ride={activeRide ?? incomingRide}
            setActiveRide={setActiveRide}
            setIncomingRide={setIncomingRide}
          />
        )}
        {screen === 'earnings' && <EarningsScreen setScreen={setScreen} />}
        {screen === 'profile' && <ProfileScreen setScreen={setScreen} />}

        {isOnline && (incomingRide || loadingIncomingRide) && (
          <IncomingRequestOverlay
            setScreen={setScreen}
            incomingRide={incomingRide}
            loadingIncomingRide={loadingIncomingRide}
            setIncomingRide={setIncomingRide}
            setActiveRide={setActiveRide}
          />
        )}
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
  const { coords, error } = useDriverLocation(isOnline);

  useEffect(() => {
    if (isOnline && coords) {
      // The hook already pings while online; this keeps the UI aware that coordinates exist.
    }
  }, [isOnline, coords]);

  return (
    <>
      <MapView />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="bg-[#12151C] border border-[#1E2433] rounded-2xl p-8 max-w-md w-full shadow-2xl pointer-events-auto">
          <div className="text-center mb-8">
            <button
                onClick={async () => {
                const { driverApi } = await import('../../api/driverApi');
                if (!isOnline && navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    async (position) => {
                      try {
                        // Save immediate location and mark driver online on the server
                        await driverApi.updateLocation(position.coords.latitude, position.coords.longitude);
                        await driverApi.setAvailability(true);
                      } catch {
                        // Ignore failures here; the background hook will retry while online.
                      }
                      setIsOnline(true);
                      setScreen('home');
                    },
                    async () => {
                      try {
                        await driverApi.setAvailability(true);
                      } catch {}
                      setIsOnline(true);
                      setScreen('home');
                    },
                    { enableHighAccuracy: true, timeout: 10000 }
                  );
                  return;
                }

                // Going offline: set availability then clear stored locations
                try {
                  await driverApi.setAvailability(false);
                  await driverApi.deleteLocations();
                } catch {
                  // ignore server errors — still update UI
                }
                setIsOnline(!isOnline);
                setScreen('home');
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
                {error ? <div className="mt-2 text-xs text-red-300">{error}</div> : null}
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

function IncomingRequestOverlay({
  setScreen,
  incomingRide,
  loadingIncomingRide,
  setIncomingRide,
  setActiveRide,
}: any) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0A0C10]/95 z-20 animate-in fade-in duration-300">
      <div className="bg-[#12151C] border-2 border-[#F59E0B] rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-[#F59E0B]/20 animate-pulse">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {incomingRide ? 'New Ride Request!' : 'Waiting for ride requests...'}
          </h2>
          {loadingIncomingRide && <p className="text-[#94A3B8] text-sm">Checking for live requests...</p>}
        </div>

        {incomingRide ? (
          <div className="space-y-4 mb-6">
            <div className="bg-[#1A1E28] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#F5A623] to-[#F59E0B] rounded-full flex items-center justify-center text-sm font-bold">
                    {String(incomingRide.rider_id ?? 'R').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">Ride #{String(incomingRide.id).slice(0, 8)}</div>
                    <div className="text-sm text-[#94A3B8] flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                      {incomingRide.rating ?? 'New'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#3B82F6]" style={{ fontFamily: 'var(--font-mono)' }}>
                    {incomingRide.fare ? `$${Number(incomingRide.fare).toFixed(2)}` : 'Pending'}
                  </div>
                  <div className="text-xs text-[#94A3B8]">Live request</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center text-xs mt-0.5">
                    P
                  </div>
                  <div className="flex-1">
                    <div className="text-[#94A3B8]">Pickup</div>
                    <div>{incomingRide.origin}</div>
                    {incomingRide.pickup_latitude != null && incomingRide.pickup_longitude != null && (
                      <div className="text-xs text-[#64748B] mt-1">
                        {Number(incomingRide.pickup_latitude).toFixed(4)}, {Number(incomingRide.pickup_longitude).toFixed(4)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#EF4444] flex items-center justify-center text-xs mt-0.5">
                    D
                  </div>
                  <div className="flex-1">
                    <div className="text-[#94A3B8]">Dropoff</div>
                    <div>{incomingRide.destination}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <div className="bg-[#1A1E28] rounded-lg p-4 text-center text-[#94A3B8]">
              {loadingIncomingRide ? 'Refreshing live request...' : 'Waiting for the assigned ride to arrive...'}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={async () => {
              if (incomingRide?.id && incomingRide?.driver_id) {
                  await matchingApi.reject(incomingRide.id, incomingRide.driver_id);
              }
                setIncomingRide(null);
              setScreen('home');
            }}
            className="flex items-center justify-center gap-2 bg-[#1A1E28] hover:bg-[#EF4444]/20 border-2 border-[#EF4444] text-[#EF4444] py-4 rounded-xl font-medium transition-all"
          >
            <XCircle className="w-5 h-5" />
            DECLINE
          </button>
          <button
            onClick={async () => {
                if (incomingRide?.id && incomingRide?.driver_id) {
                  const { data } = await matchingApi.accept(incomingRide.id, incomingRide.driver_id);
                  setActiveRide(data ?? incomingRide);
              }
                setIncomingRide(null);
              setScreen('active');
            }}
            className="flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white py-4 rounded-xl font-medium transition-all shadow-lg shadow-[#10B981]/30"
            disabled={!incomingRide}
          >
            <CheckCircle className="w-5 h-5" />
            ACCEPT
          </button>
        </div>

        <div className="mt-4 h-1 bg-[#1E2433] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#10B981] via-[#F59E0B] to-[#EF4444] transition-all duration-1000"
            style={{ width: incomingRide ? '100%' : '35%' }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function ActiveRideScreen({ setScreen, ride, setActiveRide, setIncomingRide }: any) {
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
            {String(ride?.rider_id ?? 'R').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{ride ? `Ride ${String(ride.id).slice(0, 8)}` : 'Active Ride'}</h3>
            <p className="text-sm text-[#94A3B8]">Pickup: {ride?.origin ?? 'Unknown'}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-[#3B82F6]" style={{ fontFamily: 'var(--font-mono)' }}>
              {ride?.fare ? `$${Number(ride.fare).toFixed(2)}` : '—'}
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
          onClick={async () => {
            if (ride?.id) {
              try {
                await rideApi.complete(ride.id);
              } catch {
                // keep the UI moving even if the backend completion call fails
              }
            }
            setActiveRide(null);
            setIncomingRide(null);
            setScreen('home');
          }}
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
  // Reuse the shared ProfilePage so drivers see the same account UI as riders.
  return <ProfilePage />;
}
