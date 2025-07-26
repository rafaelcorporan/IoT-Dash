import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DeviceList from './components/DeviceList';
import SecurityPanel from './components/SecurityPanel';
import FirmwareManager from './components/FirmwareManager';
import UserManagement from './components/UserManagement';
import AuditLogs from './components/AuditLogs';
import Settings from './components/Settings';
import { 
  LayoutDashboard, 
  Cpu, 
  Shield, 
  Download, 
  Users, 
  FileText, 
  Settings as SettingsIcon,
  Menu,
  X
} from 'lucide-react';

type ActiveView = 'dashboard' | 'devices' | 'security' | 'firmware' | 'users' | 'audit' | 'settings';

function AppContent() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, login, logout, error } = useAuth();

  const menuItems = [
    { id: 'dashboard' as ActiveView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'devices' as ActiveView, label: 'Device Management', icon: Cpu },
    { id: 'security' as ActiveView, label: 'Security Panel', icon: Shield },
    { id: 'firmware' as ActiveView, label: 'Firmware Manager', icon: Download },
    { id: 'users' as ActiveView, label: 'User Management', icon: Users },
    { id: 'audit' as ActiveView, label: 'Audit Logs', icon: FileText },
    { id: 'settings' as ActiveView, label: 'Settings', icon: SettingsIcon },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'devices':
        return <DeviceList />;
      case 'security':
        return <SecurityPanel />;
      case 'firmware':
        return <FirmwareManager />;
      case 'users':
        return <UserManagement />;
      case 'audit':
        return <AuditLogs />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={login} error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 theme-transition">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800/95 backdrop-blur-sm border-r border-gray-700/50 transform transition-transform duration-300 ease-in-out lg:transform-none theme-transition ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700/50">
            <h1 className="text-xl font-bold text-white theme-transition">SecureIoT</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="mt-8 px-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 theme-transition ${
                      activeView === item.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="lg:ml-64">
          {/* Header */}
          <header className="bg-gray-800/40 backdrop-blur-sm border-b border-gray-700/50 h-16 flex items-center px-6 theme-transition">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white mr-4"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white theme-transition">
                {menuItems.find(item => item.id === activeView)?.label}
              </h2>
            </div>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-white px-3 py-2 rounded-lg transition-colors duration-200"
            >
              Logout
            </button>
          </header>

          {/* Content */}
          <main className="p-6 theme-transition">
            {renderContent()}
          </main>
        </div>
      </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;