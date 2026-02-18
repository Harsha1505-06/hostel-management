
import React from 'react';
import { User, Room, Complaint, UserRole, ViewType, ComplaintStatus } from './types';
import { MOCK_USER, MOCK_ROOMS, MOCK_COMPLAINTS } from './constants';
import { Layout } from './components/Layout';
import { DashboardCard } from './components/DashboardCard';
import { ComplaintSystem } from './components/ComplaintSystem';
import { Analytics } from './components/Analytics';
import { 
  Users, 
  Bed, 
  AlertCircle, 
  CheckCircle2, 
  FileText,
  DoorOpen,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles
} from 'lucide-react';
import { getSmartAllocationSuggestion } from './services/geminiService';

export default function App() {
  const [currentUser, setCurrentUser] = React.useState<User>(MOCK_USER);
  const [rooms, setRooms] = React.useState<Room[]>(MOCK_ROOMS);
  const [complaints, setComplaints] = React.useState<Complaint[]>(MOCK_COMPLAINTS);
  const [activeView, setActiveView] = React.useState<ViewType>('DASHBOARD');
  const [aiSuggestion, setAiSuggestion] = React.useState<string | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = React.useState(false);

  const stats = {
    totalStudents: rooms.reduce((acc, r) => acc + r.occupancy, 0),
    totalRooms: rooms.length,
    occupancyRate: Math.round((rooms.reduce((acc, r) => acc + r.occupancy, 0) / rooms.reduce((acc, r) => acc + r.capacity, 0)) * 100),
    openComplaints: complaints.filter(c => c.status !== ComplaintStatus.RESOLVED && c.status !== ComplaintStatus.CLOSED).length,
    resolvedRate: Math.round((complaints.filter(c => c.status === ComplaintStatus.RESOLVED).length / complaints.length) * 100)
  };

  const handleAddComplaint = (newComplaint: Partial<Complaint>) => {
    const complaint: Complaint = {
      ...newComplaint as Complaint,
      id: `c${complaints.length + 1}`,
    };
    setComplaints([complaint, ...complaints]);
  };

  const handleUpdateComplaintStatus = (id: string, status: ComplaintStatus) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c));
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentUser({ ...currentUser, role });
    setActiveView('DASHBOARD');
  };

  const fetchAllocationSuggestion = async () => {
    setLoadingSuggestion(true);
    const suggestion = await getSmartAllocationSuggestion(['AC', 'Near Exit', 'Low Floor'], rooms.filter(r => r.status === 'AVAILABLE'));
    setAiSuggestion(suggestion);
    setLoadingSuggestion(false);
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <DashboardCard title="Total Residents" value={stats.totalStudents} icon={<Users size={20} />} trend="+4% this month" trendUp={true} />
        <DashboardCard title="Hostel Occupancy" value={`${stats.occupancyRate}%`} icon={<Bed size={20} />} />
        <DashboardCard title="Pending Grievances" value={stats.openComplaints} icon={<AlertCircle size={20} />} trend="-2 since yesterday" trendUp={true} />
        <DashboardCard title="Resolution Efficiency" value={`${stats.resolvedRate}%`} icon={<CheckCircle2 size={20} />} trendUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
              <button onClick={() => setActiveView('COMPLAINTS')} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All <ArrowRight size={16} />
              </button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-sm">
              {complaints.slice(0, 4).map((c) => (
                <div key={c.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className={`p-2 rounded-lg ${c.status === ComplaintStatus.RESOLVED ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    {c.status === ComplaintStatus.RESOLVED ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{c.category} - Room {c.roomNumber}</p>
                    <p className="text-xs text-slate-500 truncate">{c.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {currentUser.role === UserRole.ADMIN && (
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
               <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <DoorOpen size={20} />
                </div>
                <h3 className="font-bold text-slate-800">Smart Allocation Engine</h3>
              </div>
              <p className="text-slate-600 text-sm mb-6">Using rule-based logic to match students with optimal room preferences while maintaining block balance.</p>
              
              <button 
                onClick={fetchAllocationSuggestion}
                disabled={loadingSuggestion}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
              >
                {loadingSuggestion ? "Optimizing..." : "Generate Suggestion"}
              </button>

              {aiSuggestion && (
                <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                   <div className="flex items-start gap-3">
                    <Sparkles className="text-indigo-600 shrink-0" size={18} />
                    <p className="text-sm text-indigo-900 leading-relaxed italic">{aiSuggestion}</p>
                   </div>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" />
              Quick Reports
            </h4>
            <div className="space-y-3">
              <button className="w-full p-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-slate-500 group-hover:text-blue-500" />
                  <span className="text-sm font-medium text-slate-700">Monthly Occupancy</span>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </button>
              <button className="w-full p-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-slate-500 group-hover:text-blue-500" />
                  <span className="text-sm font-medium text-slate-700">Maintenance Costs</span>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </button>
              <button className="w-full p-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-slate-500 group-hover:text-blue-500" />
                  <span className="text-sm font-medium text-slate-700">Student Feedback</span>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-red-500" />
              Hostel Map
            </h4>
            <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-sm font-medium border-2 border-dashed border-slate-200">
              Interactive Map Loading...
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {rooms.map(room => (
        <div key={room.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all">
          <div className="h-2 bg-blue-600"></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold text-slate-900">Room {room.number}</h4>
                <p className="text-xs text-slate-500 font-medium">Block {room.block} • {room.type}</p>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                room.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 
                room.status === 'FULL' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
              }`}>
                {room.status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${(room.occupancy / room.capacity) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-slate-700">{room.occupancy}/{room.capacity}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {room.features.map(f => (
                  <span key={f} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-100">{f}</span>
                ))}
              </div>
            </div>
            
            <button className="w-full mt-6 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
              Manage Residents
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'DASHBOARD': return renderDashboard();
      case 'ROOMS': return renderRooms();
      case 'COMPLAINTS': return (
        <ComplaintSystem 
          complaints={complaints} 
          user={currentUser} 
          onAddComplaint={handleAddComplaint}
          onUpdateStatus={handleUpdateComplaintStatus}
        />
      );
      case 'ANALYTICS': return <Analytics complaints={complaints} rooms={rooms} />;
      case 'ALLOCATIONS': return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-12 bg-white rounded-3xl border border-slate-200">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <Users size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Automated Allocation Portal</h3>
          <p className="text-slate-500 max-w-md mb-8">Review pending room requests and use AI matching to optimize block diversity and student preferences.</p>
          <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200">
            Open Request Manager
          </button>
        </div>
      );
      default: return renderDashboard();
    }
  };

  return (
    <Layout 
      activeView={activeView} 
      setView={setActiveView} 
      user={currentUser}
      onRoleChange={handleRoleChange}
    >
      {renderContent()}
    </Layout>
  );
}
