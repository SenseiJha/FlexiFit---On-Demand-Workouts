import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Wallet, 
  Users, 
  Settings, 
  Bell, 
  Search,
  Plus,
  MoreVertical,
  TrendingUp
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const MOCK_DATA = [
  { name: 'Mon', bookings: 12 },
  { name: 'Tue', bookings: 19 },
  { name: 'Wed', bookings: 15 },
  { name: 'Thu', bookings: 22 },
  { name: 'Fri', bookings: 30 },
  { name: 'Sat', bookings: 45 },
  { name: 'Sun', bookings: 38 },
];

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all mb-1 ${
      active ? 'bg-teal-50 text-teal-600 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const StatCard = ({ title, value, trend, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="bg-gray-50 p-2 rounded-lg text-gray-600">
        <Icon size={24} />
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
        {trend > 0 ? '+' : ''}{trend}%
      </span>
    </div>
    <p className="text-gray-500 text-sm mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-navy-900">{value}</h3>
  </div>
);

export default function ProviderDashboard() {
  const [activePage, setActivePage] = useState('overview');

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col p-6">
        <div className="flex items-center space-x-2 mb-10">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg"></div>
          <span className="text-xl font-bold text-navy-900 font-heading">FlexiPartner</span>
        </div>

        <nav className="flex-1">
          <SidebarItem icon={LayoutDashboard} label="Overview" active={activePage === 'overview'} onClick={() => setActivePage('overview')} />
          <SidebarItem icon={CalendarDays} label="Schedule & Slots" active={activePage === 'schedule'} onClick={() => setActivePage('schedule')} />
          <SidebarItem icon={Users} label="Bookings" active={activePage === 'bookings'} onClick={() => setActivePage('bookings')} />
          <SidebarItem icon={Wallet} label="Financials" active={activePage === 'financials'} onClick={() => setActivePage('financials')} />
        </nav>

        <div className="pt-6 border-t border-gray-100">
           <SidebarItem icon={Settings} label="Settings" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h2 className="text-xl font-bold text-gray-800">
            {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
          </h2>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
              <img src="https://picsum.photos/100/100?random=99" alt="Profile" />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard title="Total Revenue" value="₹124,500" trend={12} icon={Wallet} />
              <StatCard title="Active Bookings" value="342" trend={8} icon={Users} />
              <StatCard title="Avg. Occupancy" value="78%" trend={-2} icon={TrendingUp} />
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
               <h3 className="text-lg font-bold text-navy-900 mb-6">Weekly Bookings</h3>
               <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={MOCK_DATA}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                     <Tooltip 
                        cursor={{fill: '#f3f4f6'}}
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
                      />
                     <Bar dataKey="bookings" fill="#00B5A6" radius={[4, 4, 0, 0]} barSize={40} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-navy-900">Recent Check-ins</h3>
                <button className="text-sm text-teal-600 font-bold hover:underline">View All</button>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Slot</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                        <span className="font-medium text-gray-900">User {i}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">Today, 6:00 PM</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold">Checked In</span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">₹150</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}