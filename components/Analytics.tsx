
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Complaint, Room } from '../types';
import { getMaintenancePredictions } from '../services/geminiService';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AnalyticsProps {
  complaints: Complaint[];
  rooms: Room[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const Analytics: React.FC<AnalyticsProps> = ({ complaints, rooms }) => {
  const [prediction, setPrediction] = React.useState<string>("Analyzing historical patterns...");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPrediction = async () => {
      const insight = await getMaintenancePredictions(complaints);
      setPrediction(insight);
      setLoading(false);
    };
    fetchPrediction();
  }, [complaints]);

  // Aggregate Data
  const categoryData = complaints.reduce((acc: any[], curr) => {
    const existing = acc.find(a => a.name === curr.category);
    if (existing) existing.value += 1;
    else acc.push({ name: curr.category, value: 1 });
    return acc;
  }, []);

  const occupancyData = [
    { name: 'Occupied', value: rooms.reduce((acc, r) => acc + r.occupancy, 0) },
    { name: 'Vacant', value: rooms.reduce((acc, r) => acc + (r.capacity - r.occupancy), 0) },
  ];

  const resolutionTrend = [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 18 },
    { day: 'Wed', count: 15 },
    { day: 'Thu', count: 25 },
    { day: 'Fri', count: 22 },
    { day: 'Sat', count: 8 },
    { day: 'Sun', count: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* AI Insight Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl text-white shadow-lg overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Sparkles size={20} className="text-yellow-300" />
            </div>
            <h3 className="font-bold text-lg">Predictive Maintenance AI</h3>
          </div>
          <p className="text-indigo-50 text-lg leading-relaxed max-w-3xl font-medium">
            {loading ? "Our AI models are processing recent grievance trends to forecast potential failures..." : prediction}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaints by Category */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle size={18} className="text-blue-500" />
              Complaints by Category
            </h4>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-green-500" />
              Real-time Occupancy
            </h4>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-4">
              {occupancyData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-sm text-slate-600 font-medium">{d.name}: {d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resolution Speed */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-indigo-500" />
              Complaint Resolution Trends
            </h4>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
