import { useState } from 'react';
import { Gauge, Bell, User, MapPin, Search, Mic, Home, Briefcase, Ticket, CreditCard, Clock, Users, X, Star, DollarSign, History } from 'lucide-react';
import { MapView } from '../../components/map/RideMap';

type RiderScreen = 'home' | 'finding' | 'active' | 'completed' | 'history' | 'payment';

export function RiderPortal() {
  const [screen, setScreen] = useState<RiderScreen>('home');
  const [destination, setDestination] = useState('');
  const [selectedRide, setSelectedRide] = useState<string | null>(null);

  return (
    <div className="size-full flex flex-col overflow-hidden">
      <Header screen={screen} setScreen={setScreen} />

      <div className="flex-1 relative overflow-hidden">
        {screen === 'home' && (
          <HomeScreen
            destination={destination}
            setDestination={setDestination}
            selectedRide={selectedRide}
            setSelectedRide={setSelectedRide}
            setScreen={setScreen}
          />
        )}
        {screen === 'finding' && <FindingDriverScreen setScreen={setScreen} />}
        {screen === 'active' && <ActiveRideScreen setScreen={setScreen} />}
        {screen === 'completed' && <CompletedScreen setScreen={setScreen} />}
        {screen === 'history' && <HistoryScreen setScreen={setScreen} />}
        {screen === 'payment' && <PaymentScreen setScreen={setScreen} />}
      </div>
    </div>
  );
}

function Header({ screen, setScreen }: { screen: RiderScreen; setScreen: (s: RiderScreen) => void }) {
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
        <button className="flex items-center gap-2 p-2 hover:bg-[#1A1E28] rounded-lg transition-colors">
          <User className="w-5 h-5 text-[#94A3B8]" />
        </button>
      </div>
    </header>
  );
}

function HomeScreen({ destination, setDestination, selectedRide, setSelectedRide, setScreen }: any) {
  const rideOptions = [
    { id: 'ridex', name: 'RideX', subtitle: 'Standard', eta: '3 min away', price: '$4.20', seats: 4, image: '🚗' },
    { id: 'ridexl', name: 'RideXL', subtitle: 'Larger vehicle', eta: '5 min away', price: '$6.80', seats: 6, image: '🚙' },
    { id: 'comfort', name: 'Comfort', subtitle: 'Premium ride', eta: '8 min away', price: '$9.50', seats: 4, image: '✨' },
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
              <div className="text-xs text-[#94A3B8]">Pickup location</div>
              <div className="text-sm">Current Location</div>
            </div>
            <button className="text-sm text-[#F5A623]">Change</button>
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
                      {option.price}
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
                  onClick={() => setScreen('finding')}
                  className="w-full bg-[#F5A623] hover:bg-[#F5A623]/90 text-[#0A0C10] py-4 rounded-lg font-medium transition-all"
                >
                  Confirm {selectedOption?.name} — {selectedOption?.price}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function FindingDriverScreen({ setScreen }: any) {
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
            <p className="text-[#94A3B8]">Estimated wait: ~2 min</p>
          </div>
          <button
            onClick={() => setScreen('active')}
            className="text-sm text-[#94A3B8] hover:text-[#F1F5F9]"
          >
            [Simulate: Driver Found]
          </button>
          <div className="mt-4">
            <button onClick={() => setScreen('home')} className="text-sm text-[#EF4444] hover:underline">
              Cancel ride
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function ActiveRideScreen({ setScreen }: any) {
  return (
    <>
      <MapView />
      <div className="absolute right-6 top-6 bottom-6 w-[360px] bg-[#12151C] border border-[#1E2433] rounded-2xl p-6 z-10 space-y-6 shadow-2xl">
        <div className="flex items-center gap-4 pb-4 border-b border-[#1E2433]">
          <div className="w-16 h-16 bg-gradient-to-br from-[#F5A623] to-[#F59E0B] rounded-full flex items-center justify-center text-2xl">
            AK
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Ahmad K.</h3>
            <div className="flex items-center gap-1 text-sm text-[#F59E0B]">
              <Star className="w-4 h-4 fill-current" />
              <span>4.87</span>
            </div>
            <p className="text-sm text-[#94A3B8]">White Toyota Camry</p>
            <p className="text-xs text-[#94A3B8]">KHI-234-AB</p>
          </div>
        </div>

        <div className="space-y-3">
          {['Accepted', 'En Route', 'Arrived', 'In Ride'].map((status, i) => (
            <div key={status} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${i < 2 ? 'bg-[#10B981]' : 'bg-[#1E2433]'}`}>
                {i < 2 && <span className="text-xs">✓</span>}
              </div>
              <span className={i < 2 ? 'text-[#F1F5F9]' : 'text-[#94A3B8]'}>{status}</span>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#1A1E28] rounded-lg">
          <div className="text-sm text-[#94A3B8] mb-1">Current Fare</div>
          <div className="text-2xl font-medium text-[#F5A623]" style={{ fontFamily: 'var(--font-mono)' }}>$3.40</div>
          <div className="text-xs text-[#94A3B8] mt-1">12 min remaining</div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 bg-[#1A1E28] hover:bg-[#1E2433] border border-[#1E2433] py-3 rounded-lg">
            📞 Call
          </button>
          <button className="flex-1 bg-[#1A1E28] hover:bg-[#1E2433] border border-[#1E2433] py-3 rounded-lg">
            💬 Chat
          </button>
        </div>

        <button
          onClick={() => setScreen('completed')}
          className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-white py-3 rounded-lg"
        >
          [Simulate: Complete Ride]
        </button>

        <button className="w-full text-sm text-[#EF4444] hover:underline">🚨 Emergency SOS</button>
      </div>
    </>
  );
}

function CompletedScreen({ setScreen }: any) {
  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState<number | null>(null);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0A0C10] z-10">
      <div className="bg-[#12151C] border border-[#1E2433] rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl text-center mb-6" style={{ fontFamily: 'var(--font-display)' }}>Trip Completed! 🎉</h2>

        <div className="bg-[#1A1E28] rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#94A3B8]">Base fare</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>$2.50</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#94A3B8]">Distance</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>$1.70</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#94A3B8]">Tax</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>$0.30</span>
          </div>
          <div className="border-t border-[#1E2433] pt-2 flex justify-between font-medium">
            <span>Total</span>
            <span className="text-[#F5A623]" style={{ fontFamily: 'var(--font-mono)' }}>$4.50</span>
          </div>
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

        <div className="mb-6">
          <p className="text-center text-sm text-[#94A3B8] mb-3">Add a tip?</p>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 5].map((amount) => (
              <button
                key={amount}
                onClick={() => setTip(amount)}
                className={`py-2 rounded-lg border transition-all ${
                  tip === amount
                    ? 'bg-[#F5A623] border-[#F5A623] text-[#0A0C10]'
                    : 'bg-[#1A1E28] border-[#1E2433]'
                }`}
              >
                ${amount}
              </button>
            ))}
            <button
              onClick={() => setTip(0)}
              className={`py-2 rounded-lg border text-sm transition-all ${
                tip === 0
                  ? 'bg-[#F5A623] border-[#F5A623] text-[#0A0C10]'
                  : 'bg-[#1A1E28] border-[#1E2433]'
              }`}
            >
              Custom
            </button>
          </div>
        </div>

        <button
          onClick={() => setScreen('home')}
          className="w-full bg-[#F5A623] hover:bg-[#F5A623]/90 text-[#0A0C10] py-4 rounded-lg font-medium"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function HistoryScreen({ setScreen }: any) {
  const trips = [
    { id: 1, driver: 'Ahmad K.', date: '2026-04-22', route: 'Downtown → Airport', amount: '$18.50', status: 'Completed' },
    { id: 2, driver: 'Sara M.', date: '2026-04-21', route: 'Home → Office', amount: '$4.20', status: 'Completed' },
    { id: 3, driver: 'John D.', date: '2026-04-20', route: 'Mall → Home', amount: '$12.80', status: 'Completed' },
  ];

  return (
    <div className="size-full bg-[#0A0C10] p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>Ride History</h2>
          <button onClick={() => setScreen('home')} className="text-[#F5A623]">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-[#12151C] border border-[#1E2433] rounded-lg p-4 hover:border-[#F5A623]/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{trip.route}</div>
                  <div className="text-sm text-[#94A3B8] mt-1">{trip.driver} • {trip.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg text-[#F5A623]" style={{ fontFamily: 'var(--font-mono)' }}>{trip.amount}</div>
                  <div className="text-xs text-[#10B981]">{trip.status}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PaymentScreen({ setScreen }: any) {
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
          <div className="text-[#0A0C10] text-3xl font-bold" style={{ fontFamily: 'var(--font-mono)' }}>$12.50</div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm text-[#94A3B8] mb-3">Payment Methods</h3>
          {['•••• 4242', '•••• 8888'].map((card, i) => (
            <div key={i} className="bg-[#12151C] border border-[#1E2433] rounded-lg p-4 flex items-center gap-4">
              <CreditCard className="w-6 h-6 text-[#F5A623]" />
              <div className="flex-1">
                <div className="font-medium" style={{ fontFamily: 'var(--font-mono)' }}>{card}</div>
                <div className="text-sm text-[#94A3B8]">Visa</div>
              </div>
              <button className="text-sm text-[#F5A623]">Remove</button>
            </div>
          ))}

          <button className="w-full bg-[#1A1E28] border border-[#1E2433] hover:border-[#F5A623] py-4 rounded-lg transition-all">
            + Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );
}
