
import React from 'react';
import { Complaint, UserRole, ComplaintStatus, ComplaintPriority, User } from '../types';
import { CATEGORIES } from '../constants';
import { classifyComplaintPriority } from '../services/geminiService';
// Added Sparkles to the lucide-react imports
import { Plus, Search, Filter, Clock, CheckCircle, Hammer, AlertCircle, Sparkles } from 'lucide-react';

interface ComplaintSystemProps {
  complaints: Complaint[];
  user: User;
  onAddComplaint: (complaint: Partial<Complaint>) => void;
  onUpdateStatus: (id: string, status: ComplaintStatus) => void;
}

export const ComplaintSystem: React.FC<ComplaintSystemProps> = ({ complaints, user, onAddComplaint, onUpdateStatus }) => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({ category: CATEGORIES[0], description: '' });

  const filteredComplaints = user.role === UserRole.STUDENT 
    ? complaints.filter(c => c.studentId === user.id)
    : complaints;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const priority = await classifyComplaintPriority(formData.description);
    
    onAddComplaint({
      studentId: user.id,
      studentName: user.name,
      roomNumber: user.roomNumber || 'N/A',
      category: formData.category,
      description: formData.description,
      status: ComplaintStatus.PENDING,
      priority: priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setFormData({ category: CATEGORIES[0], description: '' });
    setModalOpen(false);
    setLoading(false);
  };

  const getStatusIcon = (status: ComplaintStatus) => {
    switch (status) {
      case ComplaintStatus.PENDING: return <Clock className="text-orange-500" size={18} />;
      case ComplaintStatus.IN_PROGRESS: return <Hammer className="text-blue-500" size={18} />;
      case ComplaintStatus.RESOLVED: return <CheckCircle className="text-green-500" size={18} />;
      default: return <AlertCircle className="text-slate-500" size={18} />;
    }
  };

  const getPriorityBadge = (priority: ComplaintPriority) => {
    const colors = {
      [ComplaintPriority.LOW]: 'bg-green-100 text-green-700',
      [ComplaintPriority.MEDIUM]: 'bg-blue-100 text-blue-700',
      [ComplaintPriority.HIGH]: 'bg-orange-100 text-orange-700',
      [ComplaintPriority.CRITICAL]: 'bg-red-100 text-red-700',
    };
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${colors[priority]}`}>{priority}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search complaints..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter size={18} />
            Filter
          </button>
          {user.role === UserRole.STUDENT && (
            <button 
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
            >
              <Plus size={18} />
              Lodge Grievance
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComplaints.map((complaint) => (
          <div key={complaint.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                {complaint.category}
              </span>
              {getPriorityBadge(complaint.priority)}
            </div>
            
            <p className="text-slate-800 text-sm font-medium mb-4 line-clamp-3">
              {complaint.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2">
                {getStatusIcon(complaint.status)}
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-tight">
                  {complaint.status.replace('_', ' ')}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {new Date(complaint.createdAt).toLocaleDateString()}
              </span>
            </div>

            {user.role === UserRole.MAINTENANCE && complaint.status === ComplaintStatus.PENDING && (
              <button 
                onClick={() => onUpdateStatus(complaint.id, ComplaintStatus.IN_PROGRESS)}
                className="w-full mt-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
              >
                Accept Task
              </button>
            )}
            
            {user.role === UserRole.MAINTENANCE && complaint.status === ComplaintStatus.IN_PROGRESS && (
              <button 
                onClick={() => onUpdateStatus(complaint.id, ComplaintStatus.RESOLVED)}
                className="w-full mt-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-bold hover:bg-green-100 transition-colors"
              >
                Mark Resolved
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Lodge Complaint Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900">New Grievance</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us what's wrong. Be specific for AI priority sorting..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
                <p className="mt-2 text-xs text-slate-400 italic flex items-center gap-1">
                  <Sparkles size={12} className="text-blue-400" />
                  AI will automatically classify priority based on your description.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 px-4 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                >
                  {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const X = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
