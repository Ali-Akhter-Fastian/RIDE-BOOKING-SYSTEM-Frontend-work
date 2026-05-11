import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gauge, Bell, User, MapPin, Search, Mic, Home, Briefcase, Ticket, CreditCard, Clock, Users, X, Star, DollarSign, History, Navigation } from 'lucide-react';
import { MapView } from '../../components/map/RideMap';
import { useRide } from '../../hooks/useRide';
import { useGeolocation } from '../../hooks/useGeolocation';
import { ROUTES } from '../../routes/routeConfig';
import { driverApi } from '../../api/driverApi';
import { rideApi } from '../../api/rideApi';
import { matchingApi } from '../../api/matchingApi';
import { paymentApi } from '../../api/paymentApi';

const RIDE_TYPE_PRICING: Record<string, { name: string; subtitle: string; eta: string; price: number; seats: number; image: string }> = {
  ridex: { name: 'RideX', subtitle: 'Standard', eta: '3 min away', price: 4.2, seats: 4, image: '🚗' },
  ridexl: { name: 'RideXL', subtitle: 'Larger vehicle', eta: '5 min away', price: 6.8, seats: 6, image: '🚙' },
  comfort: { name: 'Comfort', subtitle: 'Premium ride', eta: '8 min away', price: 9.5, seats: 4, image: '✨' },
};

type RiderScreen = 'home' | 'finding' | 'active' | 'completed' | 'history' | 'payment';

export function RiderPortal() {
  const [screen, setScreen] = useState<RiderScreen>('home');
  const [pickupLocation, setPickupLocation] = useState('Current Location');
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [destination, setDestination] = useState('');
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const { requestRide, loading, error } = useRide();
  const [rideId, setRideId] = useState<string | null>(null);
  const [matchedRide, setMatchedRide] = useState<any>(null);
  const [matchedDriver, setMatchedDriver] = useState<any>(null);
  const { coords: geolocationCoords, error: geolocationError } = useGeolocation(false);

  // Auto-set pickup from geolocation on mount
  useEffect(() => {
    if (geolocationCoords && !pickupCoords) {
      setPickupCoords(geolocationCoords);
    }
  }, [geolocationCoords, pickupCoords]);

  return (
    <div className="size-full flex flex-col overflow-hidden">
      <Header screen={screen} setScreen={setScreen} />

      <div className="flex-1 relative overflow-hidden">
        {screen === 'home' && (
          <HomeScreen
            pickupLocation={pickupLocation}
            setPickupLocation={setPickupLocation}
            pickupCoords={pickupCoords}
            setPickupCoords={setPickupCoords}
            destination={destination}
            setDestination={setDestination}
            selectedRide={selectedRide}
            setSelectedRide={setSelectedRide}
            setScreen={setScreen}
            onConfirmRide={async () => {
              try {
                if (!pickupCoords) {
                  alert('Please enable geolocation or select a pickup location');
                  return;
                }
                const res = await requestRide({
                  origin: pickupLocation,
                  destination,
                  ride_type: selectedRide ?? 'ridex',
                  pickup_latitude: pickupCoords.lat,
                  pickup_longitude: pickupCoords.lng,
                });
                // store ride id so downstream screens can call APIs
                if (res && (res as any).id) {
                  setRideId((res as any).id);
                  await matchingApi.find((res as any).id);
                }
                setScreen('finding');
              } catch (e) {
                console.error('Failed to create ride', e);
              }
            }}
            loading={loading}
            error={error}
            geolocationError={geolocationError}
          />
        )}
        {screen === 'finding' && (
          <FindingDriverScreen
            rideId={rideId}
            setScreen={setScreen}
            setMatchedRide={setMatchedRide}
            setMatchedDriver={setMatchedDriver}
          />
        )}
        {screen === 'active' && (
          <ActiveRideScreen
            setScreen={setScreen}
            ride={matchedRide}
            driver={matchedDriver}
            setMatchedRide={setMatchedRide}
          />
        )}
        {screen === 'completed' && (
          <CompletedScreen setScreen={setScreen} ride={matchedRide} driver={matchedDriver} rideId={rideId} />
        )}
        {screen === 'history' && <HistoryScreen setScreen={setScreen} />}
        {screen === 'payment' && (
          <PaymentScreen
            setScreen={setScreen}
            rideId={rideId}
            ride={matchedRide}
            selectedRideType={selectedRide}
          />
        )}
      </div>
    </div>
    );
  }

function Header({ screen, setScreen }: { screen: RiderScreen; setScreen: (s: RiderScreen) => void }) {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-[#12151C] border-b border-[#1E2433] flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setScreen('home')}>
          <Gauge className="w-6 h-6 text-[#F5A623]" />
          <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            RideFlow
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setScreen('history')}
          className="p-2 hover:bg-[#1A1E28] rounded-lg transition-colors"
        >
          <History className="w-5 h-5 text-[#94A3B8]" />
        </button>
        <button
          onClick={() => setScreen('payment')}
          className="p-2 hover:bg-[#1A1E28] rounded-lg transition-colors"
        >
          <CreditCard className="w-5 h-5 text-[#94A3B8]" />
        </button>
        <button className="relative p-2 hover:bg-[#1A1E28] rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-[#94A3B8]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
        </button>
        <button
          onClick={() => navigate(ROUTES.PROFILE)}
          className="flex items-center gap-2 p-2 hover:bg-[#1A1E28] rounded-lg transition-colors"
        >
          <User className="w-5 h-5 text-[#94A3B8]" />
        </button>
      </div>
    </header>
  );
}

function HomeScreen({ pickupLocation, setPickupLocation, pickupCoords, setPickupCoords, destination, setDestination, selectedRide, setSelectedRide, setScreen, onConfirmRide, loading, error, geolocationError }: any) {
  const [showCoords, setShowCoords] = useState(false);
  
  const handleUseCurrentLocation = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { 
          enableHighAccuracy: true, 
          timeout: 10000 
        });
      });
      
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setPickupCoords({ lat, lng });
      
      // Get address from coordinates
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
          { headers: { Accept: 'application/json' } }
        );
        const data = await res.json();
        setPickupLocation(data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      } catch (err) {
        setPickupLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    } catch (err) {
      alert('Unable to get current location. Please check permissions.');
      console.error('Geolocation error:', err);
    }
  };
  
  const rideOptions = [
    { id: 'ridex', ...RIDE_TYPE_PRICING.ridex },
    { id: 'ridexl', ...RIDE_TYPE_PRICING.ridexl },
    { id: 'comfort', ...RIDE_TYPE_PRICING.comfort },
  ];

  const selectedOption = rideOptions.find(r => r.id === selectedRide);

  return (
    <>
      <MapView />
      <div className="absolute left-0 top-0 bottom-0 w-full lg:w-[420px] bg-[#12151C] border-r border-[#1E2433] p-6 overflow-y-auto z-10">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>Where to?</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Search destination..."
                className="w-full bg-[#1A1E28] border border-[#1E2433] rounded-lg pl-12 pr-12 py-4 text-[#F1F5F9] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
              />
              <Mic className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            </div>
          </div>

          <div className="flex gap-2">
            {[{ icon: Home, label: 'Home' }, { icon: Briefcase, label: 'Office' }].map((dest) => (
              <button
                key={dest.label}
                onClick={() => setDestination(dest.label)}
                className="flex items-center gap-2 px-3 py-2 bg-[#1A1E28] hover:bg-[#1E2433] border border-[#1E2433] rounded-lg transition-all"
              >
                <dest.icon className="w-4 h-4 text-[#F5A623]" />
                <span className="text-sm">{dest.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#1A1E28] rounded-lg border border-[#1E2433]">
            <MapPin className="w-5 h-5 text-[#F5A623]" />
            <div className="flex-1">
              <div className="text-xs text-[#94A3B8] mb-1">Pickup location</div>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Enter pickup location"
                className="w-full bg-transparent text-sm text-[#F1F5F9] placeholder:text-[#94A3B8] focus:outline-none"
              />
              {pickupCoords && (
                <div className="text-xs text-[#64748B] mt-1">
                  📍 {pickupCoords.lat.toFixed(4)}, {pickupCoords.lng.toFixed(4)}
                </div>
              )}
            </div>
            <button
              onClick={handleUseCurrentLocation}
              className="p-2 hover:bg-[#1E2433] rounded-lg transition-colors text-[#F5A623] flex-shrink-0"
              title="Use current location"
            >
              <Navigation className="w-5 h-5" />
            </button>
          </div>

          {destination && (
            <>
              <div className="space-y-3">
                {rideOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedRide(option.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      selectedRide === option.id
                        ? 'bg-[#1A1E28] border-[#F5A623] shadow-lg'
                        : 'bg-[#1A1E28] border-[#1E2433]'
                    }`}
                  >
                    <div className="text-3xl">{option.image}</div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{option.name}</div>
                      <div className="flex gap-3 text-xs text-[#94A3B8] mt-1">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{option.eta}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{option.seats}</span>
                      </div>
                    </div>
                    <div className="text-lg font-medium text-[#F5A623]" style={{ fontFamily: 'var(--font-mono)' }}>
                      ${option.price.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 p-3 bg-[#1A1E28] border border-[#F59E0B] rounded-lg">
                <span className="text-xl">⚡</span>
                <div className="text-sm text-[#F59E0B]">Surge: 1.3x — High demand area</div>
              </div>

              {selectedRide && (
                <button
                  onClick={async () => {
                    await onConfirmRide();
                    setScreen('finding');
                  }}
                  disabled={loading}
                  className="w-full bg-[#F5A623] hover:bg-[#F5A623]/90 disabled:opacity-60 disabled:cursor-not-allowed text-[#0A0C10] py-4 rounded-lg font-medium transition-all"
                >
                  {loading ? 'Requesting ride...' : `Confirm ${selectedOption?.name} — ${selectedOption?.price}`}
                </button>
              )}
              {error && <div className="text-sm text-[#EF4444]">{error}</div>}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function FindingDriverScreen({ rideId, setScreen, setMatchedRide, setMatchedDriver }: any) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [matchedStatus, setMatchedStatus] = useState<any>(null);
  const [matchedDriverState, setMatchedDriverState] = useState<any>(null);
  const [matchError, setMatchError] = useState<string | null>(null);

  useEffect(() => {
    if (!rideId) {
      return;
    }

    let cancelled = false;
    let intervalId: number | undefined;

    const resolveDriver = async (driverId: string) => {
      try {
        const { data } = await driverApi.getById(driverId);
        if (!cancelled) {
          // driverApi returns { driver: {...} } — normalize and set both local
          // preview state and parent matched driver so downstream screens
          // (Active/Completed) can display driver details.
          const driverPayload = (data && data.driver) ? data.driver : data;
          setMatchedDriverState(driverPayload);
          if (setMatchedDriver) setMatchedDriver(driverPayload);
        }
      } catch {
        if (!cancelled) {
          const fallback = { id: driverId };
          setMatchedDriverState(fallback);
          if (setMatchedDriver) setMatchedDriver(fallback);
        }
      }
    };

    const pollMatch = async () => {
      try {
        const { data } = await matchingApi.status(rideId);
        if (cancelled) return;

        setMatchedStatus(data);
        setMatchError(null);

        if (data?.status === 'accepted' && data?.driver_id) {
          await resolveDriver(data.driver_id);
          try {
            const { data: rideData } = await rideApi.getById(rideId);
            if (!cancelled) {
              setMatchedRide(rideData);
            }
          } catch {
            if (!cancelled) {
              setMatchedRide(data);
            }
          }
          setScreen('active');
        }
      } catch (error: any) {
        if (!cancelled) {
          setMatchError(error?.response?.data?.detail ?? error?.message ?? 'Failed to check match status');
        }
      }
    };

    pollMatch();
    intervalId = window.setInterval(pollMatch, 2000);

    return () => {
      cancelled = true;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [rideId, setScreen]);

  const handleCancelRide = async () => {
    if (!rideId) {
      setCancelError('No ride to cancel');
      return;
    }
    setIsCancelling(true);
    setCancelError(null);
    try {
      await rideApi.cancel(rideId);
      setScreen('home');
    } catch (e: any) {
      const msg = e?.response?.data?.detail ?? e?.message ?? 'Failed to cancel ride';
      setCancelError(msg);
      console.error('Cancel ride error:', e);
    } finally {
      setIsCancelling(false);
    }
  };
  return (
    <>
      <MapView />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-[#12151C] border border-[#1E2433] rounded-2xl p-8 text-center max-w-sm shadow-2xl">
          <div className="mb-6">
            <div className="inline-flex p-4 bg-[#1A1E28] rounded-full mb-4">
              <div className="animate-spin w-12 h-12 border-4 border-[#F5A623] border-t-transparent rounded-full"></div>
            </div>
            <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-display)' }}>Finding your driver...</h3>
            <p className="text-[#94A3B8]">{matchedStatus?.driver_id ? 'Driver found. Preparing your ride...' : 'Estimated wait: ~2 min'}</p>
          </div>
          <div className="text-sm text-[#94A3B8]">{matchedDriverState?.full_name ? `Matched with ${matchedDriverState.full_name}` : 'Waiting for the closest available driver'}</div>
          <div className="mt-4">
            <button onClick={handleCancelRide} className="text-sm text-[#EF4444] hover:underline" disabled={isCancelling}>
              {isCancelling ? 'Cancelling...' : 'Cancel ride'}
            </button>
            {cancelError && <div className="text-sm text-[#EF4444] mt-2">{cancelError}</div>}
            {matchError && <div className="text-sm text-[#EF4444] mt-2">{matchError}</div>}
          </div>
        </div>
      </div>
    </>
  );
}

function ActiveRideScreen({ setScreen, ride, driver, setMatchedRide }: any) {
  useEffect(() => {
    if (!ride?.id) {
      return;
    }

    let cancelled = false;
    let intervalId: number | undefined;

    const pollRide = async () => {
      try {
        const { data } = await rideApi.getById(ride.id);
        if (cancelled) return;

        setMatchedRide(data);
        if (data?.status === 'completed') {
          setScreen('completed');
        }
      } catch {
        // keep the last known ride state on transient failures
      }
    };

    pollRide();
    intervalId = window.setInterval(pollRide, 2000);

    return () => {
      cancelled = true;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [ride?.id, setMatchedRide, setScreen]);

  return (
    <>
      <MapView />
      <div className="absolute right-6 top-6 bottom-6 w-[360px] bg-[#12151C] border border-[#1E2433] rounded-2xl p-6 z-10 space-y-6 shadow-2xl">
        <div className="flex items-center gap-4 pb-4 border-b border-[#1E2433]">
          <div className="w-16 h-16 bg-gradient-to-br from-[#F5A623] to-[#F59E0B] rounded-full flex items-center justify-center text-2xl">
            {String(driver?.full_name ?? 'DR').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{driver?.full_name ?? 'Driver assigned'}</h3>
            <div className="flex items-center gap-1 text-sm text-[#F59E0B]">
              <Star className="w-4 h-4 fill-current" />
              <span>{driver?.rating ?? '4.87'}</span>
            </div>
            <p className="text-sm text-[#94A3B8]">{driver?.vehicle_make_model ?? driver?.vehicle_type ?? 'Assigned vehicle'}</p>
            <p className="text-xs text-[#94A3B8]">{driver?.vehicle_number ?? 'Vehicle pending'}</p>
          </div>
        </div>


        <div className="space-y-3">
          <div className="p-3 bg-[#1A1E28] rounded-lg text-sm text-[#94A3B8]">
            <div className="text-xs text-[#94A3B8]">Vehicle</div>
            <div className="font-medium text-white mt-1">{driver?.vehicle_make_model ?? driver?.vehicle_type ?? 'Assigned vehicle'}</div>
            <div className="flex gap-4 text-xs text-[#94A3B8] mt-2">
              <div>Plate: <span className="text-white font-medium">{driver?.vehicle_number ?? 'N/A'}</span></div>
              <div>License: <span className="text-white font-medium">{driver?.license_number ?? 'N/A'}</span></div>
            </div>
          </div>

          <div className="p-4 bg-[#1A1E28] rounded-lg">
            <div className="text-sm text-[#94A3B8] mb-1">Current Fare</div>
            <div className="text-2xl font-medium text-[#F5A623]" style={{ fontFamily: 'var(--font-mono)' }}>{ride?.fare ? `$${Number(ride.fare).toFixed(2)}` : 'Loading fare...'}</div>
            <div className="text-xs text-[#94A3B8] mt-1">12 min remaining</div>
          </div>
        </div>

      
      

       
      </div>
    </>
  );
}

function CompletedScreen({ setScreen, ride, driver, rideId }: any) {
  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0A0C10] z-10">
      <div className="bg-[#12151C] border border-[#1E2433] rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl text-center mb-6" style={{ fontFamily: 'var(--font-display)' }}>Trip Completed! 🎉</h2>

        <div className="bg-[#1A1E28] rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#94A3B8]">Base fare</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{ride?.fare ? `$${Number(ride.fare).toFixed(2)}` : 'Loading fare...'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#94A3B8]">Distance</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{ride?.origin && ride?.destination ? 'Calculated' : '$1.70'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#94A3B8]">Tax</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>$0.30</span>
          </div>
          <div className="border-t border-[#1E2433] pt-2 flex justify-between font-medium">
            <span>Total</span>
            <span className="text-[#F5A623]" style={{ fontFamily: 'var(--font-mono)' }}>{ride?.fare ? `$${Number(ride.fare).toFixed(2)}` : 'Loading fare...'}</span>
          </div>
        </div>

        <div className="bg-[#12151C] border border-[#1E2433] rounded-lg p-4 mb-6">
          <div className="text-sm text-[#94A3B8] mb-1">Driver</div>
          <div className="font-medium">{driver?.full_name ?? 'Assigned driver'}</div>
          <div className="text-sm text-[#94A3B8]">{driver?.vehicle_make_model ?? driver?.vehicle_type ?? 'Vehicle details pending'}</div>
        </div>

        <div className="mb-6">
          <p className="text-center text-sm text-[#94A3B8] mb-3">Rate your driver</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-all hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${star <= rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#1E2433]'}`}
                />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={async () => {
            setSaving(true);
            setError(null);
            try {
              if (rideId && rating > 0) {
                await rideApi.rate(rideId, { rating });
              }
              setScreen('payment');
            } catch (e: any) {
              const msg = e?.response?.data?.detail ?? e?.message ?? 'Failed to submit rating';
              setError(msg);
            } finally {
              setSaving(false);
            }
          }}
          className="w-full bg-[#F5A623] hover:bg-[#F5A623]/90 text-[#0A0C10] py-4 rounded-lg font-medium"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Continue To Payment'}
        </button>
        {error && <div className="text-sm text-[#EF4444] text-center mt-3">{error}</div>}
      </div>
    </div>
  );
}

function HistoryScreen({ setScreen }: any) {
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await rideApi.history({ page: 1, page_size: 20 });
        // Handle both direct response and nested data structure
        const ridesData = (response as any)?.rides || response || [];
        setRides(Array.isArray(ridesData) ? ridesData : []);
      } catch (err: any) {
        console.error('Failed to fetch ride history:', err);
        const errorMsg = err?.response?.data?.detail || err?.message || 'Failed to load ride history';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchRideHistory();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount: any) => {
    if (amount === null || amount === undefined) return 'N/A';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `$${num.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-[#10B981]';
      case 'cancelled':
        return 'text-[#EF4444]';
      default:
        return 'text-[#94A3B8]';
    }
  };

  return (
    <div className="size-full bg-[#0A0C10] p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>Ride History</h2>
          <button onClick={() => setScreen('home')} className="text-[#F5A623]">
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-flex p-4 bg-[#1A1E28] rounded-full mb-4">
                <div className="animate-spin w-8 h-8 border-3 border-[#F5A623] border-t-transparent rounded-full"></div>
              </div>
              <p className="text-[#94A3B8]">Loading your ride history...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-4 text-[#EF4444]">
            <p className="font-medium">Error loading ride history</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-[#94A3B8] mb-2">No rides found</p>
              <button
                onClick={() => setScreen('home')}
                className="text-sm text-[#F5A623] hover:underline"
              >
                Request your first ride
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {rides.map((ride) => (
              <div key={ride.id} className="bg-[#12151C] border border-[#1E2433] rounded-lg p-4 hover:border-[#F5A623]/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{ride.origin} → {ride.destination}</div>
                    <div className="text-sm text-[#94A3B8] mt-1">{formatDate(ride.created_at)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg text-[#F5A623]" style={{ fontFamily: 'var(--font-mono)' }}>
                      {formatAmount(ride.fare)}
                    </div>
                    <div className={`text-xs capitalize ${getStatusColor(ride.status)}`}>
                      {ride.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentScreen({ setScreen, rideId, ride, selectedRideType }: any) {
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [methodType, setMethodType] = useState<'card' | 'wallet'>('card');
  const [tokenRef, setTokenRef] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [selectedMethodType, setSelectedMethodType] = useState<'card' | 'wallet' | 'cash'>('cash');
  const [rideData, setRideData] = useState<any>(ride ?? null);
  const selectedRideTypeKey = String(selectedRideType ?? '').toLowerCase();
  const selectedRideTypePrice = selectedRideTypeKey ? RIDE_TYPE_PRICING[selectedRideTypeKey]?.price ?? null : null;
  const rideTypeKey = String(rideData?.ride_type ?? '').toLowerCase();
  const rideTypePrice = rideTypeKey ? RIDE_TYPE_PRICING[rideTypeKey]?.price ?? null : null;
  const totalAmount = rideData?.fare != null ? Number(rideData.fare) : (rideTypePrice ?? selectedRideTypePrice);

  const loadMethods = async () => {
    try {
      const { data } = await paymentApi.listMethods();
      const list = Array.isArray(data) ? data : [];
      setMethods(list);
      const defaultMethod = list.find((m: any) => m.is_default);
      if (defaultMethod) {
        setSelectedMethodId(defaultMethod.id);
        setSelectedMethodType(defaultMethod.method_type ?? 'cash');
      } else if (list[0]?.id) {
        setSelectedMethodId(list[0].id);
        setSelectedMethodType(list[0].method_type ?? 'cash');
      }
    } catch (e: any) {
      const msg = e?.response?.data?.detail ?? e?.message ?? 'Failed to load payment methods';
      setError(msg);
    }
  };

  useEffect(() => {
    loadMethods();
  }, []);

  useEffect(() => {
    if (ride) {
      setRideData(ride);
    }
  }, [ride]);

  useEffect(() => {
    if (rideData?.fare != null || rideData?.ride_type) {
      return;
    }

    let cancelled = false;

    const loadRide = async () => {
      if (!rideId) {
        return;
      }

      try {
        const { data } = await rideApi.getById(rideId);
        if (!cancelled) {
          setRideData(data);
          if (data?.fare == null && !data?.ride_type) {
            setError('Ride fare is unavailable for this trip');
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError((prev) => prev ?? 'Failed to load ride details');
        }
      }
    };

    loadRide();

    return () => {
      cancelled = true;
    };
  }, [rideData, rideId]);

  return (
    <div className="size-full bg-[#0A0C10] p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>Payment & Wallet</h2>
          <button onClick={() => setScreen('home')} className="text-[#F5A623]">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-[#F5A623] to-[#F59E0B] rounded-xl p-6 mb-6 shadow-lg">
          <div className="text-[#0A0C10] text-sm mb-2">RideFlow Credits</div>
          <div className="text-[#0A0C10] text-3xl font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
            {totalAmount !== null ? `$${totalAmount.toFixed(2)}` : '$--.--'}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm text-[#94A3B8] mb-3">Payment Methods</h3>
          {methods.map((method) => (
            <div key={method.id} className="bg-[#12151C] border border-[#1E2433] rounded-lg p-4 flex items-center gap-4">
              <CreditCard className="w-6 h-6 text-[#F5A623]" />
              <div className="flex-1">
                <div className="font-medium" style={{ fontFamily: 'var(--font-mono)' }}>
                  {method.token_ref}
                </div>
                <div className="text-sm text-[#94A3B8]">{method.method_type}</div>
              </div>
              <button
                onClick={() => {
                  setSelectedMethodId(method.id);
                  setSelectedMethodType(method.method_type ?? 'cash');
                }}
                className={`text-xs px-3 py-1 rounded border ${
                  selectedMethodId === method.id
                    ? 'border-[#F5A623] text-[#F5A623]'
                    : 'border-[#1E2433] text-[#94A3B8]'
                }`}
              >
                Select
              </button>
              <button
                onClick={async () => {
                  try {
                    await paymentApi.removeMethod(method.id);
                    await loadMethods();
                  } catch (e: any) {
                    const msg = e?.response?.data?.detail ?? e?.message ?? 'Failed to remove method';
                    setError(msg);
                  }
                }}
                className="text-sm text-[#F5A623]"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="bg-[#12151C] border border-[#1E2433] rounded-lg p-4 space-y-3">
            <div className="text-sm text-[#94A3B8]">Add Payment Method</div>
            <div className="flex gap-2">
              <select
                value={methodType}
                onChange={(e) => {
                  const nextType = e.target.value as 'card' | 'wallet';
                  setMethodType(nextType);
                  setSelectedMethodType(nextType);
                }}
                className="bg-[#1A1E28] border border-[#1E2433] rounded px-3 py-2 text-sm"
              >
                <option value="card">Card</option>
                <option value="wallet">Wallet</option>
              </select>
              <input
                value={tokenRef}
                onChange={(e) => setTokenRef(e.target.value)}
                placeholder="Token / masked number"
                className="flex-1 bg-[#1A1E28] border border-[#1E2433] rounded px-3 py-2 text-sm"
              />
              <button
                onClick={async () => {
                  if (!tokenRef.trim()) return;
                  try {
                    await paymentApi.addMethod({ token: tokenRef.trim(), type: methodType });
                    setTokenRef('');
                    await loadMethods();
                  } catch (e: any) {
                    const msg = e?.response?.data?.detail ?? e?.message ?? 'Failed to add method';
                    setError(msg);
                  }
                }}
                className="px-4 py-2 bg-[#1A1E28] border border-[#1E2433] hover:border-[#F5A623] rounded text-sm"
              >
                Add
              </button>
            </div>
          </div>

          <button
            onClick={async () => {
              if (!rideId) {
                setError('Ride ID is required');
                return;
              }
              setLoading(true);
              setError(null);
              try {
                const initiateRes = await paymentApi.initiate({
                  ride_id: rideId,
                  payment_method: selectedMethodType,
                  amount: totalAmount ?? 0,
                });
                const paymentId = initiateRes?.data?.id;
                if (!paymentId) {
                  throw new Error('Payment initiation did not return a payment id');
                }
                await paymentApi.confirm(paymentId);
                setScreen('home');
              } catch (e: any) {
                const msg = e?.response?.data?.detail ?? e?.message ?? 'Payment failed';
                setError(msg);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading || !rideId || totalAmount === null}
            className="w-full bg-[#F5A623] hover:bg-[#F5A623]/90 disabled:opacity-60 text-[#0A0C10] py-4 rounded-lg transition-all font-medium"
          >
            {loading ? 'Processing Payment...' : totalAmount !== null ? `Pay Now • $${totalAmount.toFixed(2)}` : 'Loading fare...'}
          </button>
          {error && <div className="text-sm text-[#EF4444]">{error}</div>}
        </div>
      </div>
    </div>
  );
}
