import React, { useState, useEffect } from 'react';
import { Shield, Lock, User, Eye, EyeOff, Activity, Cpu, Wifi, Globe } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
  error?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [networkStats, setNetworkStats] = useState({
    devices: 247,
    threats: 3,
    uptime: '99.7%'
  });

  // Simulate real-time network statistics
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkStats({
        devices: 247 + Math.floor(Math.random() * 6) - 3,
        threats: Math.max(0, 3 + Math.floor(Math.random() * 4) - 2),
        uptime: (99.5 + Math.random() * 0.4).toFixed(1) + '%'
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onLogin(username, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Glassmorphic overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        {/* Status Bar */}
        <div className="absolute top-6 right-6 flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2 bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-lg px-3 py-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-300">System Online</span>
          </div>
          <div className="flex items-center space-x-4 bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-lg px-4 py-2">
            <div className="flex items-center space-x-1">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-300">{networkStats.devices}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-gray-300">{networkStats.threats}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">{networkStats.uptime}</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md">
          {/* Header with enhanced branding */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6 relative">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-full p-4">
                  <Shield className="w-12 h-12 text-blue-400" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
              Secure<span className="text-cyan-400">IoT</span>
            </h1>
            <p className="text-gray-300 mb-2">Industrial IoT Security Platform</p>
            <div className="flex justify-center items-center space-x-2 text-xs text-gray-500">
              <Globe className="w-3 h-3" />
              <span>Enterprise Grade • Real-time Monitoring • ML-Powered</span>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-gray-300/90 backdrop-blur-sm border border-gray-400/30 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-cyan-400/10"></div>
            </div>
            
            <div className="relative z-10">

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-400/50 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 hover:border-gray-500/70"

                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white/70 border border-gray-400/50 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 hover:border-gray-500/70"

                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 animate-pulse">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-red-400" />
                      <p className="text-red-400 text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-800 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-xl relative overflow-hidden"
                >
                  {isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-cyan-600/50 animate-pulse"></div>
                  )}
                  <div className="relative flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        <span>Secure Access</span>
                      </>
                    )}
                  </div>
                </button>

                {/* Security Notice */}
                <div className="mt-6 pt-6 border-t border-gray-500/30">
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
                    <Lock className="w-3 h-3" />
                    <span>Protected by enterprise-grade encryption</span>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Wifi className="w-3 h-3 text-green-400" />
                <span>Network Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Activity className="w-3 h-3 text-cyan-400" />
                <span>Systems Online</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="w-3 h-3 text-blue-400" />
                <span>Global Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;