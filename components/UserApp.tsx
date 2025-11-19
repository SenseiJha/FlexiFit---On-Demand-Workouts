import React, { useState, useEffect } from 'react';
import { Home, Search, Calendar, User as UserIcon, MapPin, Star, Zap, CheckCircle2, Plus } from 'lucide-react';
import { CURRENT_USER, GYMS, DAILY_CHALLENGE, MOCK_BOOKINGS, GENERATE_SLOTS } from '../services/mockData';
import { Gym, Slot, Booking } from '../types';
import { generateMotivationalQuote, getFlexiCoachAdvice } from '../services/geminiService';

// --- Subcomponents ---

const TabBar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 pb-safe">
    {[
      { id: 'home', icon: Home, label: 'Home' },
      { id: 'discover', icon: Search, label: 'Discover' },
      { id: 'bookings', icon: Calendar, label: 'Bookings' },
      { id: 'profile', icon: UserIcon, label: 'Profile' },
    ].map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`flex flex-col items-center space-y-1 transition-all ${activeTab === tab.id ? 'text-teal-500 scale-110' : 'text-gray-400'}`}
      >
        <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
        <span className="text-[10px] font-medium">{tab.label}</span>
      </button>
    ))}
  </div>
);

const StreakRing = ({ streak, points }: { streak: number, points: number }) => (
  <div className="relative w-40 h-40 mx-auto my-6 flex items-center justify-center">
    {/* Background Circle */}
    <svg className="w-full h-full transform -rotate-90">
      <circle
        cx="80"
        cy="80"
        r="70"
        stroke="#E6EDF3"
        strokeWidth="12"
        fill="transparent"
      />
      {/* Progress Circle */}
      <circle
        cx="80"
        cy="80"
        r="70"
        stroke="url(#gradient)"
        strokeWidth="12"
        fill="transparent"
        strokeDasharray="440"
        strokeDashoffset={440 - (440 * 0.75)} // 75% completion mock
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00B5A6" />
          <stop offset="100%" stopColor="#FF6B9A" />
        </linearGradient>
      </defs>
    </svg>
    <div className="absolute text-center">
      <div className="flex items-center justify-center space-x-1 text-orange-500 mb-1">
        <Zap size={16} fill="currentColor" />
        <span className="text-sm font-bold">{streak} Day Streak</span>
      </div>
      <p className="text-3xl font-bold text-navy-900">{points}</p>
      <p className="text-xs text-gray-400 font-medium">FlexiPoints</p>
    </div>
  </div>
);

const GymCard = ({ gym, onPress }: { gym: Gym, onPress: () => void }) => (
  <div onClick={onPress} className="bg-white rounded-2xl p-3 mb-4 shadow-sm border border-gray-100 active:scale-95 transition-transform cursor-pointer">
    <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3">
      <img src={gym.image} alt={gym.name} className="w-full h-full object-cover" />
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center shadow-sm">
        <Star size={12} className="text-yellow-400 fill-yellow-400 mr-1" />
        <span className="text-xs font-bold">{gym.rating}</span>
      </div>
      {gym.capacity > 80 && (
        <div className="absolute bottom-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
          High Demand
        </div>
      )}
    </div>
    <h3 className="font-bold text-navy-900 text-lg">{gym.name}</h3>
    <div className="flex items-center text-gray-500 text-xs mt-1 mb-3">
      <MapPin size={12} className="mr-1" />
      {gym.address}
    </div>
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {gym.tags.slice(0, 2).map(tag => (
          <span key={tag} className="bg-teal-50 text-teal-600 px-2 py-1 rounded-md text-[10px] font-semibold">
            {tag}
          </span>
        ))}
      </div>
      <span className="font-bold text-teal-600">₹{gym.pricePerHour}<span className="text-gray-400 text-xs font-normal">/hr</span></span>
    </div>
  </div>
);

const GymDetail = ({ gym, onBack, onBook }: { gym: Gym, onBack: () => void, onBook: (slot: Slot) => void }) => {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const slots = GENERATE_SLOTS(gym.id);

  return (
    <div className="bg-white min-h-screen pb-20 animate-in slide-in-from-right duration-300">
      {/* Header Image */}
      <div className="relative h-64">
        <img src={gym.image} className="w-full h-full object-cover" />
        <button onClick={onBack} className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
      </div>

      <div className="p-6 -mt-6 bg-white rounded-t-3xl relative z-10">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold text-navy-900 font-heading">{gym.name}</h1>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-teal-600">₹{gym.pricePerHour}</span>
            <span className="text-xs text-gray-400">per hour</span>
          </div>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-6">
          <MapPin size={14} className="mr-1" /> {gym.address}
        </div>

        <h3 className="font-bold text-navy-900 mb-3">About</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          {gym.description}
        </p>

        <h3 className="font-bold text-navy-900 mb-3">Select Time Slot</h3>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {slots.map(slot => (
            <button
              key={slot.id}
              disabled={slot.seatsLeft === 0}
              onClick={() => setSelectedSlot(slot)}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedSlot?.id === slot.id 
                  ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500/20' 
                  : slot.seatsLeft === 0 
                    ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed' 
                    : 'border-gray-200 hover:border-teal-200'
              }`}
            >
              <div className={`text-sm font-bold mb-1 ${selectedSlot?.id === slot.id ? 'text-teal-700' : 'text-gray-700'}`}>{slot.time}</div>
              <div className={`text-[10px] ${slot.seatsLeft < 3 ? 'text-orange-500 font-bold' : 'text-gray-400'}`}>
                {slot.seatsLeft === 0 ? 'Full' : `${slot.seatsLeft} left`}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => selectedSlot && onBook(selectedSlot)}
          disabled={!selectedSlot}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
            selectedSlot 
              ? 'bg-gradient-to-r from-teal-400 to-teal-600 shadow-teal-200 hover:shadow-teal-300' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {selectedSlot ? 'Proceed to Pay' : 'Select a Slot'}
        </button>
      </div>
    </div>
  );
};

// --- Main Screens ---

const HomeScreen = ({ onNavigate }: { onNavigate: (id: string) => void }) => {
  const [motivation, setMotivation] = useState("Loading motivation...");

  useEffect(() => {
    generateMotivationalQuote(CURRENT_USER.streak, CURRENT_USER.name).then(setMotivation);
  }, []);

  return (
    <div className="p-6 pb-24 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Good Morning</p>
          <h1 className="text-xl font-bold text-navy-900">{CURRENT_USER.name}</h1>
        </div>
        <img src={CURRENT_USER.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-md" />
      </div>

      <div className="bg-gradient-to-br from-teal-50 to-white border border-teal-100 p-4 rounded-xl mb-6 shadow-sm">
         <p className="text-sm text-teal-800 font-medium italic">"{motivation}"</p>
      </div>

      <StreakRing streak={CURRENT_USER.streak} points={CURRENT_USER.points} />

      <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl p-1 shadow-lg shadow-orange-200 mb-8">
        <div className="bg-white rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-navy-900 flex items-center">
              <span className="bg-orange-100 p-1 rounded mr-2">🔥</span>
              Daily Challenge
            </h3>
            <span className="text-xs font-bold text-orange-500">+{DAILY_CHALLENGE.reward} pts</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{DAILY_CHALLENGE.target}</p>
          <button 
            onClick={() => onNavigate('discover')}
            className="w-full py-2 bg-orange-50 text-orange-600 font-bold rounded-lg text-sm hover:bg-orange-100 transition-colors"
          >
            Accept Challenge
          </button>
        </div>
      </div>

      <div className="flex justify-between items-end mb-4">
        <h2 className="text-lg font-bold text-navy-900">Popular Near You</h2>
        <button onClick={() => onNavigate('discover')} className="text-teal-500 text-xs font-bold">View All</button>
      </div>
      
      {/* Horizontal Scroll Mock */}
      <div className="flex overflow-x-auto space-x-4 pb-4 -mx-6 px-6 no-scrollbar">
        {GYMS.slice(0, 2).map(gym => (
          <div key={gym.id} className="min-w-[250px]">
             <GymCard gym={gym} onPress={() => onNavigate('discover')} />
          </div>
        ))}
      </div>
    </div>
  );
};

const DiscoverScreen = ({ onSelectGym }: { onSelectGym: (gym: Gym) => void }) => {
  const [filter, setFilter] = useState('All');
  
  const filteredGyms = filter === 'All' ? GYMS : GYMS.filter(g => g.tags.includes(filter));

  return (
    <div className="p-6 pb-24 pt-12 animate-in fade-in">
      <h1 className="text-2xl font-bold text-navy-900 mb-4 font-heading">Find Your Spot</h1>
      
      {/* Search Mock */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search gyms, yoga, cycling..." 
          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-teal-500 shadow-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-6 no-scrollbar">
        {['All', 'Gym', 'Yoga', 'Cycling', 'Pilates'].map(tag => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
              filter === tag ? 'bg-navy-900 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filteredGyms.map(gym => (
          <React.Fragment key={gym.id}>
            <GymCard gym={gym} onPress={() => onSelectGym(gym)} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const BookingsScreen = () => {
  return (
    <div className="p-6 pb-24 pt-12 animate-in fade-in">
       <h1 className="text-2xl font-bold text-navy-900 mb-6 font-heading">Your Sessions</h1>
       
       <div className="space-y-4">
         {MOCK_BOOKINGS.map(booking => (
           <div key={booking.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-navy-900">{booking.gymName}</h3>
                <p className="text-sm text-gray-500 mb-1">{booking.date} • {booking.time}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  booking.status === 'UPCOMING' ? 'bg-teal-50 text-teal-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {booking.status}
                </span>
              </div>
              {booking.status === 'UPCOMING' && (
                <div className="bg-navy-900 p-2 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-black border-dashed"></div>
                  </div>
                </div>
              )}
           </div>
         ))}
       </div>
    </div>
  )
}

const ProfileScreen = () => {
    const [aiQuery, setAiQuery] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAskCoach = async () => {
        if(!aiQuery) return;
        setLoading(true);
        const res = await getFlexiCoachAdvice(aiQuery, "User stats: 12 day streak, prefers lifting.");
        setAiResponse(res);
        setLoading(false);
    }

    return (
        <div className="p-6 pb-24 pt-12 animate-in fade-in">
            <div className="text-center mb-8">
                <img src={CURRENT_USER.avatar} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" />
                <h2 className="text-xl font-bold text-navy-900">{CURRENT_USER.name}</h2>
                <p className="text-teal-600 font-bold text-sm">Level 5 Athlete</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-8">
                <div className="flex items-center mb-4">
                   <div className="bg-white/20 p-2 rounded-lg mr-3">
                     <Zap size={20} />
                   </div>
                   <h3 className="font-bold text-lg">FlexiCoach AI</h3>
                </div>
                <p className="text-white/80 text-sm mb-4">Need tips on form or motivation? Ask me anything!</p>
                
                {aiResponse && (
                    <div className="bg-white/10 p-3 rounded-lg mb-4 text-sm border border-white/20 animate-in fade-in">
                        "{aiResponse}"
                    </div>
                )}

                <div className="flex gap-2">
                    <input 
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        placeholder="e.g., How to improve squats?" 
                        className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none"
                    />
                    <button 
                        onClick={handleAskCoach}
                        disabled={loading}
                        className="bg-white text-indigo-600 p-2 rounded-lg font-bold"
                    >
                        {loading ? '...' : <CheckCircle2 size={20} />}
                    </button>
                </div>
            </div>

            <div className="space-y-1">
                {['Edit Profile', 'Payment Methods', 'Notifications', 'Dark Mode'].map(item => (
                    <button key={item} className="w-full text-left p-4 bg-white border-b border-gray-50 flex justify-between items-center text-gray-700 hover:bg-gray-50 transition">
                        {item}
                        <span className="text-gray-300">›</span>
                    </button>
                ))}
                <button className="w-full text-left p-4 text-red-500 font-bold mt-4">Log Out</button>
            </div>
        </div>
    )
}

export default function UserApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBook = (slot: Slot) => {
      // Simulate Razorpay flow
      const options = {
          key: "rzp_test_dummy",
          amount: selectedGym!.pricePerHour * 100,
          name: "FlexiFit",
          description: `Booking at ${selectedGym!.name}`,
          handler: function (response: any) {
              setBookingSuccess(true);
              setTimeout(() => {
                  setBookingSuccess(false);
                  setSelectedGym(null);
                  setActiveTab('bookings');
              }, 2000);
          }
      };
      // Mock success immediately for this demo
      setBookingSuccess(true);
      setTimeout(() => {
          setBookingSuccess(false);
          setSelectedGym(null);
          setActiveTab('bookings');
      }, 2000);
  };

  if (bookingSuccess) {
      return (
          <div className="min-h-screen bg-teal-500 flex flex-col items-center justify-center text-white animate-in zoom-in duration-300">
              <div className="bg-white p-4 rounded-full mb-6 animate-bounce">
                  <CheckCircle2 size={64} className="text-teal-500" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Booked!</h1>
              <p className="text-teal-100">You earned +50 points</p>
          </div>
      )
  }

  if (selectedGym) {
    return <GymDetail gym={selectedGym} onBack={() => setSelectedGym(null)} onBook={handleBook} />;
  }

  return (
    <div className="bg-bg min-h-screen font-sans text-gray-800 max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <div className="h-full overflow-y-auto no-scrollbar">
        {activeTab === 'home' && <HomeScreen onNavigate={setActiveTab} />}
        {activeTab === 'discover' && <DiscoverScreen onSelectGym={setSelectedGym} />}
        {activeTab === 'bookings' && <BookingsScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </div>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}