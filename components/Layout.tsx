
import React from 'react';
import { UserRole, ViewType, User } from '../types';
import { 
  LayoutDashboard, 
  BedDouble, 
  ClipboardList, 
  Users, 
  BarChart3, 
  UserCircle,
  Menu,
  X,
  LogOut,
  Bell
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setView: (view: ViewType) => void;
  user: User;
  onRoleChange: (role: UserRole) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, setView, user, onRoleChange }) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  const navItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: [UserRole.ADMIN, UserRole.STUDENT, UserRole.MAINTENANCE] },
    { id: 'ROOMS', label: 'Room Management', icon: <BedDouble size={20} />, roles: [UserRole.ADMIN] },
    { id: 'COMPLAINTS', label: 'Complaints', icon: <ClipboardList size={20} />, roles: [UserRole.ADMIN, UserRole.STUDENT, UserRole.MAINTENANCE] },
    { id: 'ALLOCATIONS', label: 'Allocations', icon: <Users size={20} />, roles: [UserRole.ADMIN, UserRole.STUDENT] },
    { id: 'ANALYTICS', label: 'Insights', icon: <BarChart3 size={20} />, roles: [UserRole.ADMIN] },
    { id: 'PROFILE', label: 'My Profile', icon: <UserCircle size={20} />, roles: [UserRole.ADMIN, UserRole.STUDENT, UserRole.MAINTENANCE] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">HostelWise</h1>
          </div>
          
          <nav className="space-y-1">
            {filteredNav.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewType)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeView === item.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-semibold uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
            </div>
          </div>
          
          <select 
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            value={user.role}
            className="w-full text-xs bg-slate-100 border-none rounded p-1 mb-4 text-slate-600"
          >
            <option value={UserRole.ADMIN}>Switch to Admin View</option>
            <option value={UserRole.STUDENT}>Switch to Student View</option>
            <option value={UserRole.MAINTENANCE}>Switch to Staff View</option>
          </select>

          <button className="w-full flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors text-sm font-medium">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
          <h1 className="text-lg font-bold">HostelWise</h1>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white p-6 shadow-xl animate-in slide-in-from-right duration-200">
            <div className="flex justify-end mb-6">
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-600">
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-1">
              {filteredNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id as ViewType);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg ${
                    activeView === item.id 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-slate-600'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 md:ml-0 pt-16 md:pt-0 overflow-y-auto h-screen">
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-30 flex justify-between items-center hidden md:flex">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{activeView.charAt(0) + activeView.slice(1).toLowerCase()}</h2>
            <p className="text-xs text-slate-500">Manage your hostel operations seamlessly</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{user.role}</p>
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
