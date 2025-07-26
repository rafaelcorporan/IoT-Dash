import React, { useState, useMemo, useEffect } from 'react';
import { AuditLog, AuditLogFilter } from '../types';
import CustomSelect from './CustomSelect';
import { 
  FileText, 
  Search, 
  Calendar, 
  Filter, 
  Download, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  XCircle,
  CheckCircle,
  User,
  Shield,
  Server,
  Settings,
  Smartphone,
  Upload,
  Eye,
  Clock,
  MapPin,
  Globe,
  Monitor,
  MoreHorizontal,
  RefreshCw,
  TrendingUp
} from 'lucide-react';

// Mock audit log data for demonstration
const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date('2024-01-15T10:30:15Z'),
    userId: '1',
    username: 'admin',
    userRole: 'admin',
    action: 'User Login',
    category: 'authentication',
    severity: 'info',
    resource: 'Authentication System',
    details: 'Successful login with 2FA',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    success: true
  },
  {
    id: '2',
    timestamp: new Date('2024-01-15T10:25:42Z'),
    userId: '2',
    username: 'john.doe',
    userRole: 'operator',
    action: 'Device Configuration Updated',
    category: 'device_management',
    severity: 'warning',
    resource: 'Sensor Device',
    resourceId: 'sensor-001',
    details: 'Updated sensor sampling rate from 60s to 30s',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    success: true,
    changes: [
      { field: 'sampling_rate', oldValue: '60s', newValue: '30s' },
      { field: 'last_modified', oldValue: '2024-01-15T09:30:00Z', newValue: '2024-01-15T10:25:42Z' }
    ]
  },
  {
    id: '3',
    timestamp: new Date('2024-01-15T10:20:18Z'),
    userId: '3',
    username: 'jane.smith',
    userRole: 'security_analyst',
    action: 'Security Alert Acknowledged',
    category: 'security',
    severity: 'critical',
    resource: 'Security Alert System',
    resourceId: 'alert-456',
    details: 'Acknowledged critical security alert for unauthorized access attempt',
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    success: true
  },
  {
    id: '4',
    timestamp: new Date('2024-01-15T10:15:33Z'),
    userId: '1',
    username: 'admin',
    userRole: 'admin',
    action: 'User Created',
    category: 'user_management',
    severity: 'info',
    resource: 'User Management System',
    resourceId: 'user-789',
    details: 'Created new user account for Alice Johnson',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    success: true,
    changes: [
      { field: 'username', oldValue: null, newValue: 'alice.johnson' },
      { field: 'role', oldValue: null, newValue: 'operator' },
      { field: 'status', oldValue: null, newValue: 'active' }
    ]
  },
  {
    id: '5',
    timestamp: new Date('2024-01-15T10:10:55Z'),
    userId: '2',
    username: 'john.doe',
    userRole: 'operator',
    action: 'Firmware Update Failed',
    category: 'firmware',
    severity: 'error',
    resource: 'Firmware Management System',
    resourceId: 'firmware-v2.1.0',
    details: 'Failed to update firmware on gateway device due to connectivity issues',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    success: false
  },
  {
    id: '6',
    timestamp: new Date('2024-01-15T09:55:21Z'),
    userId: '4',
    username: 'bob.wilson',
    userRole: 'viewer',
    action: 'Failed Login Attempt',
    category: 'authentication',
    severity: 'warning',
    resource: 'Authentication System',
    details: 'Failed login attempt - incorrect password',
    ipAddress: '192.168.1.120',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    success: false
  },
  {
    id: '7',
    timestamp: new Date('2024-01-15T09:45:12Z'),
    userId: '1',
    username: 'admin',
    userRole: 'admin',
    action: 'System Configuration Updated',
    category: 'configuration',
    severity: 'info',
    resource: 'System Settings',
    details: 'Updated system timezone and notification settings',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    success: true,
    changes: [
      { field: 'timezone', oldValue: 'UTC', newValue: 'America/New_York' },
      { field: 'email_notifications', oldValue: false, newValue: true }
    ]
  },
  {
    id: '8',
    timestamp: new Date('2024-01-15T09:30:44Z'),
    userId: '3',
    username: 'jane.smith',
    userRole: 'security_analyst',
    action: 'Security Scan Initiated',
    category: 'security',
    severity: 'info',
    resource: 'Security Scanner',
    details: 'Initiated comprehensive security scan of all IoT devices',
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    success: true
  }
];

const severityColors = {
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  critical: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
};

const categoryColors = {
  authentication: 'bg-green-500/20 text-green-400 border-green-500/30',
  user_management: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  device_management: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  security: 'bg-red-500/20 text-red-400 border-red-500/30',
  system: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  firmware: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  configuration: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
};

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [filters, setFilters] = useState<AuditLogFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');

  // Auto-refresh simulation
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Simulate new log entries
      const newLog: AuditLog = {
        id: Date.now().toString(),
        timestamp: new Date(),
        userId: '1',
        username: 'system',
        userRole: 'system',
        action: 'System Health Check',
        category: 'system',
        severity: 'info',
        resource: 'System Monitor',
        details: 'Automated system health check completed successfully',
        ipAddress: '127.0.0.1',
        userAgent: 'System/1.0',
        success: true
      };
      
      setLogs(prevLogs => [newLog, ...prevLogs]);
    }, 30000); // Add new log every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          log.username.toLowerCase().includes(searchLower) ||
          log.action.toLowerCase().includes(searchLower) ||
          log.details.toLowerCase().includes(searchLower) ||
          log.resource.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Date filters
      if (filters.startDate && log.timestamp < filters.startDate) return false;
      if (filters.endDate && log.timestamp > filters.endDate) return false;

      // Category filter
      if (filters.category && filters.category !== 'all' && log.category !== filters.category) return false;

      // Severity filter
      if (filters.severity && filters.severity !== 'all' && log.severity !== filters.severity) return false;

      // Success filter
      if (filters.success !== undefined && log.success !== filters.success) return false;

      // User filter
      if (filters.userId && filters.userId !== 'all' && log.userId !== filters.userId) return false;

      return true;
    });
  }, [logs, filters, searchTerm]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info': return <Info className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <Shield className="w-4 h-4" />;
      case 'user_management': return <User className="w-4 h-4" />;
      case 'device_management': return <Smartphone className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'system': return <Server className="w-4 h-4" />;
      case 'firmware': return <Upload className="w-4 h-4" />;
      case 'configuration': return <Settings className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Category', 'Severity', 'Resource', 'Details', 'IP Address', 'Success'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp.toISOString(),
        log.username,
        log.action,
        log.category,
        log.severity,
        log.resource,
        `"${log.details}"`,
        log.ipAddress,
        log.success
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uniqueUsers = useMemo(() => {
    const users = Array.from(new Set(logs.map(log => log.username)));
    return users.map(username => {
      const log = logs.find(l => l.username === username);
      return { username, userId: log?.userId || '' };
    });
  }, [logs]);

  const stats = useMemo(() => {
    const total = filteredLogs.length;
    const successful = filteredLogs.filter(log => log.success).length;
    const failed = total - successful;
    const criticalCount = filteredLogs.filter(log => log.severity === 'critical').length;
    const recentCount = filteredLogs.filter(log => 
      new Date().getTime() - log.timestamp.getTime() < 24 * 60 * 60 * 1000
    ).length;

    return { total, successful, failed, criticalCount, recentCount };
  }, [filteredLogs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Audit Logs</h2>
          <p className="text-gray-400">Monitor system activity and compliance for the SecureIoT platform</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              autoRefresh 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span>{autoRefresh ? 'Auto Refresh On' : 'Auto Refresh Off'}</span>
          </button>
          <button
            onClick={exportLogs}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Events</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Successful</p>
              <p className="text-2xl font-bold text-green-400">{stats.successful}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Failed</p>
              <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Critical</p>
              <p className="text-2xl font-bold text-purple-400">{stats.criticalCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Last 24h</p>
              <p className="text-2xl font-bold text-cyan-400">{stats.recentCount}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>
          <div>
            <CustomSelect
              value={filters.category || 'all'}
              onChange={(value) => setFilters(prev => ({ ...prev, category: value === 'all' ? undefined : value }))}
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'authentication', label: 'Authentication' },
                { value: 'user_management', label: 'User Management' },
                { value: 'device_management', label: 'Device Management' },
                { value: 'security', label: 'Security' },
                { value: 'system', label: 'System' },
                { value: 'firmware', label: 'Firmware' },
                { value: 'configuration', label: 'Configuration' }
              ]}
            />
          </div>
          <div>
            <CustomSelect
              value={filters.severity || 'all'}
              onChange={(value) => setFilters(prev => ({ ...prev, severity: value === 'all' ? undefined : value }))}
              options={[
                { value: 'all', label: 'All Severities' },
                { value: 'info', label: 'Info' },
                { value: 'warning', label: 'Warning' },
                { value: 'error', label: 'Error' },
                { value: 'critical', label: 'Critical' }
              ]}
            />
          </div>
          <div>
            <CustomSelect
              value={filters.userId || 'all'}
              onChange={(value) => setFilters(prev => ({ ...prev, userId: value === 'all' ? undefined : value }))}
              options={[
                { value: 'all', label: 'All Users' },
                ...uniqueUsers.map(user => ({ value: user.userId, label: user.username }))
              ]}
            />
          </div>
          <div>
            <CustomSelect
              value={filters.success !== undefined ? (filters.success ? 'success' : 'failed') : 'all'}
              onChange={(value) => {
                setFilters(prev => ({ 
                  ...prev, 
                  success: value === 'all' ? undefined : value === 'success' 
                }));
              }}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'success', label: 'Success' },
                { value: 'failed', label: 'Failed' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex bg-gray-800/40 rounded-lg p-1">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'table' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'timeline' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Timeline View
          </button>
        </div>
        <p className="text-gray-400">Showing {filteredLogs.length} of {logs.length} events</p>
      </div>

      {/* Logs Display */}
      {viewMode === 'table' ? (
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="text-left p-4 text-gray-300 font-medium">Timestamp</th>
                  <th className="text-left p-4 text-gray-300 font-medium">User</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Action</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Category</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Severity</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-t border-gray-700/50 hover:bg-gray-700/20">
                    <td className="p-4">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{formatDate(log.timestamp)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {log.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{log.username}</p>
                          <p className="text-gray-400 text-xs">{log.userRole}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white text-sm font-medium">{log.action}</p>
                        <p className="text-gray-400 text-xs">{log.resource}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[log.category]}`}>
                        {getCategoryIcon(log.category)}
                        <span className="capitalize">{log.category.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${severityColors[log.severity]}`}>
                        {getSeverityIcon(log.severity)}
                        <span className="capitalize">{log.severity}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      {log.success ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setSelectedLog(log);
                          setShowDetails(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No audit logs found matching your criteria</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="space-y-4">
            {filteredLogs.map((log, index) => (
              <div key={log.id} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    log.success ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  {index < filteredLogs.length - 1 && (
                    <div className="w-px h-16 bg-gray-600 mt-2" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${severityColors[log.severity]}`}>
                        {getSeverityIcon(log.severity)}
                        <span className="capitalize">{log.severity}</span>
                      </span>
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[log.category]}`}>
                        {getCategoryIcon(log.category)}
                        <span className="capitalize">{log.category.replace('_', ' ')}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(log.timestamp)}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-white font-medium">{log.action}</p>
                    <p className="text-gray-300 text-sm mt-1">{log.details}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{log.username}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Globe className="w-3 h-3" />
                        <span>{log.ipAddress}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Monitor className="w-3 h-3" />
                        <span>{log.resource}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedLog(log);
                    setShowDetails(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No audit logs found matching your criteria</p>
            </div>
          )}
        </div>
      )}

      {/* Detailed Log Modal */}
      {showDetails && selectedLog && (
        <LogDetailsModal
          log={selectedLog}
          onClose={() => {
            setShowDetails(false);
            setSelectedLog(null);
          }}
        />
      )}
    </div>
  );
};

// Log Details Modal Component
const LogDetailsModal: React.FC<{
  log: AuditLog;
  onClose: () => void;
}> = ({ log, onClose }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Audit Log Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Timestamp</label>
              <div className="flex items-center space-x-2 text-white">
                <Clock className="w-4 h-4" />
                <span>{formatDate(log.timestamp)}</span>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Status</label>
              <div className="flex items-center space-x-2">
                {log.success ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Success</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400">Failed</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Action</label>
            <p className="text-white text-lg font-semibold">{log.action}</p>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Description</label>
            <p className="text-gray-300">{log.details}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Category</label>
              <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${categoryColors[log.category]}`}>
                <span className="capitalize">{log.category.replace('_', ' ')}</span>
              </span>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Severity</label>
              <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${severityColors[log.severity]}`}>
                <span className="capitalize">{log.severity}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">User</label>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {log.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{log.username}</p>
                  <p className="text-gray-400 text-sm">{log.userRole}</p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Resource</label>
              <div>
                <p className="text-white">{log.resource}</p>
                {log.resourceId && (
                  <p className="text-gray-400 text-sm">ID: {log.resourceId}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">IP Address</label>
              <div className="flex items-center space-x-2 text-white">
                <MapPin className="w-4 h-4" />
                <span>{log.ipAddress}</span>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">User Agent</label>
              <p className="text-gray-300 text-sm break-all">{log.userAgent}</p>
            </div>
          </div>

          {log.changes && log.changes.length > 0 && (
            <div>
              <label className="block text-gray-400 text-sm mb-2">Changes Made</label>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="space-y-3">
                  {log.changes.map((change, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300 font-medium">{change.field}:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-red-400 text-sm">
                          {change.oldValue === null ? 'null' : String(change.oldValue)}
                        </span>
                        <span className="text-gray-500">→</span>
                        <span className="text-green-400 text-sm">
                          {String(change.newValue)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs; 