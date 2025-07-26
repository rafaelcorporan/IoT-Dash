import React, { useState, useEffect } from 'react';
import { Device, SecurityAlert } from '../types';
import { 
  Cpu, 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  WifiOff,
  Battery,
  Thermometer,
  TrendingUp,
  TrendingDown,
  Globe,
  Server,
  Download,
  Upload,
  Zap,
  Users,
  Clock,
  BarChart3
} from 'lucide-react';

// Mock data
const mockDevices: Device[] = [
  {
    id: 'dev-001',
    name: 'Temperature Sensor A1',
    type: 'sensor',
    status: 'online',
    location: { lat: 40.7128, lng: -74.0060, address: 'Building A, Floor 1' },
    lastSeen: new Date(),
    firmwareVersion: '2.1.3',
    batteryLevel: 85,
    temperature: 22.5,
    securityLevel: 'high',
    dataPoints: [
      { timestamp: new Date(), value: 22.5, metric: 'temperature' },
      { timestamp: new Date(Date.now() - 300000), value: 22.3, metric: 'temperature' }
    ]
  },
  {
    id: 'dev-002',
    name: 'Security Camera B2',
    type: 'camera',
    status: 'online',
    location: { lat: 40.7580, lng: -73.9855, address: 'Building B, Floor 2' },
    lastSeen: new Date(),
    firmwareVersion: '1.8.5',
    temperature: 28.1,
    securityLevel: 'medium',
    dataPoints: [
      { timestamp: new Date(), value: 1, metric: 'recording_status' },
      { timestamp: new Date(Date.now() - 600000), value: 1, metric: 'recording_status' }
    ]
  },
  {
    id: 'dev-003',
    name: 'Gateway C1',
    type: 'gateway',
    status: 'warning',
    location: { lat: 40.7505, lng: -73.9934, address: 'Building C, Floor 1' },
    lastSeen: new Date(Date.now() - 300000),
    firmwareVersion: '3.2.1',
    batteryLevel: 45,
    securityLevel: 'high',
    dataPoints: [
      { timestamp: new Date(), value: 150, metric: 'throughput' },
      { timestamp: new Date(Date.now() - 300000), value: 145, metric: 'throughput' }
    ]
  },
  {
    id: 'dev-004',
    name: 'Motion Detector D3',
    type: 'sensor',
    status: 'offline',
    location: { lat: 40.7282, lng: -73.7949, address: 'Building D, Floor 3' },
    lastSeen: new Date(Date.now() - 3600000),
    firmwareVersion: '1.5.2',
    batteryLevel: 12,
    securityLevel: 'low',
    dataPoints: [
      { timestamp: new Date(Date.now() - 3600000), value: 0, metric: 'motion_detected' },
      { timestamp: new Date(Date.now() - 4200000), value: 1, metric: 'motion_detected' }
    ]
  }
];

const mockAlerts: SecurityAlert[] = [
  {
    id: 'alert-001',
    deviceId: 'dev-003',
    type: 'anomaly',
    severity: 'high',
    message: 'Unusual network traffic detected',
    timestamp: new Date(Date.now() - 600000),
    resolved: false
  },
  {
    id: 'alert-002',
    deviceId: 'dev-004',
    type: 'authentication',
    severity: 'critical',
    message: 'Multiple failed authentication attempts',
    timestamp: new Date(Date.now() - 1200000),
    resolved: false
  },
  {
    id: 'alert-003',
    deviceId: 'dev-001',
    type: 'network',
    severity: 'medium',
    message: 'High latency detected',
    timestamp: new Date(Date.now() - 1800000),
    resolved: true
  }
];

// Mock Network Activity Data
interface NetworkMetric {
  timestamp: Date;
  inbound: number;
  outbound: number;
  latency: number;
  packetLoss: number;
  activeConnections: number;
}

interface NetworkDevice {
  id: string;
  name: string;
  ip: string;
  status: 'active' | 'idle' | 'disconnected';
  bandwidth: number;
  packets: number;
  lastActivity: Date;
}

const generateNetworkData = (): NetworkMetric[] => {
  const data: NetworkMetric[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 5 * 60 * 1000)); // 5-minute intervals
    data.push({
      timestamp,
      inbound: Math.random() * 100 + 20, // 20-120 Mbps
      outbound: Math.random() * 80 + 10,  // 10-90 Mbps
      latency: Math.random() * 50 + 10,   // 10-60 ms
      packetLoss: Math.random() * 2,      // 0-2%
      activeConnections: Math.floor(Math.random() * 50) + 20 // 20-70 connections
    });
  }
  
  return data;
};

const mockNetworkDevices: NetworkDevice[] = [
  {
    id: 'net-001',
    name: 'Main Gateway',
    ip: '192.168.1.1',
    status: 'active',
    bandwidth: 87.3,
    packets: 15420,
    lastActivity: new Date()
  },
  {
    id: 'net-002',
    name: 'IoT Hub Alpha',
    ip: '192.168.1.10',
    status: 'active',
    bandwidth: 42.1,
    packets: 8932,
    lastActivity: new Date(Date.now() - 30000)
  },
  {
    id: 'net-003',
    name: 'Security Bridge',
    ip: '192.168.1.15',
    status: 'idle',
    bandwidth: 12.7,
    packets: 2341,
    lastActivity: new Date(Date.now() - 120000)
  },
  {
    id: 'net-004',
    name: 'Sensor Network',
    ip: '192.168.1.20',
    status: 'active',
    bandwidth: 28.9,
    packets: 5672,
    lastActivity: new Date(Date.now() - 15000)
  },
  {
    id: 'net-005',
    name: 'Backup Router',
    ip: '192.168.1.5',
    status: 'disconnected',
    bandwidth: 0,
    packets: 0,
    lastActivity: new Date(Date.now() - 3600000)
  }
];

const Dashboard: React.FC = () => {
  const devices = mockDevices;
  const alerts = mockAlerts;
  const [networkData, setNetworkData] = useState<NetworkMetric[]>(generateNetworkData());
  const [networkDevices, setNetworkDevices] = useState<NetworkDevice[]>(mockNetworkDevices);
  const [selectedTimeRange, setSelectedTimeRange] = useState('2h');
  
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;
  const warningDevices = devices.filter(d => d.status === 'warning').length;
  const activeAlerts = alerts.filter(a => !a.resolved).length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.resolved).length;

  // Real-time network data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkData(prevData => {
        const newData = [...prevData];
        const now = new Date();
        
        // Add new data point
        newData.push({
          timestamp: now,
          inbound: Math.random() * 100 + 20,
          outbound: Math.random() * 80 + 10,
          latency: Math.random() * 50 + 10,
          packetLoss: Math.random() * 2,
          activeConnections: Math.floor(Math.random() * 50) + 20
        });
        
        // Keep only last 24 points (2 hours of 5-minute intervals)
        return newData.slice(-24);
      });
      
      // Update network devices
      setNetworkDevices(prevDevices => 
        prevDevices.map(device => ({
          ...device,
          bandwidth: device.status === 'active' ? Math.random() * 100 : device.bandwidth * 0.9,
          packets: device.status === 'active' ? device.packets + Math.floor(Math.random() * 100) : device.packets,
          lastActivity: device.status === 'active' ? new Date() : device.lastActivity
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const currentNetworkStats = networkData[networkData.length - 1];
  const previousNetworkStats = networkData[networkData.length - 2];

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Activity className="w-4 h-4 text-gray-400" />;
  };

  const getDeviceStatusColor = (status: NetworkDevice['status']) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'idle': return 'text-yellow-400 bg-yellow-500/20';
      case 'disconnected': return 'text-red-400 bg-red-500/20';
    }
  };

  const StatusCard: React.FC<{
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    color: string;
    trend?: string;
  }> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${color} mt-2`}>{value}</p>
          {trend && (
            <p className="text-sm text-gray-500 mt-1">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-opacity-20 ${color.includes('green') ? 'bg-green-500' : color.includes('red') ? 'bg-red-500' : color.includes('yellow') ? 'bg-yellow-500' : 'bg-cyan-500'}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const RecentAlert: React.FC<{ alert: SecurityAlert }> = ({ alert }) => {
    const severityColors = {
      critical: 'text-red-400 bg-red-500/20 border-red-500/30',
      high: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
      medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
      low: 'text-blue-400 bg-blue-500/20 border-blue-500/30'
    };

    return (
      <div className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
        <div className={`p-2 rounded-lg border ${severityColors[alert.severity]}`}>
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{alert.message}</p>
          <p className="text-gray-400 text-sm">
            Device: {devices.find(d => d.id === alert.deviceId)?.name || 'Unknown'}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-medium ${severityColors[alert.severity].split(' ')[0]}`}>
            {alert.severity.toUpperCase()}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(alert.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  };

  const DeviceStatus: React.FC<{ device: Device }> = ({ device }) => {
    const statusColors = {
      online: 'text-green-400 bg-green-500/20',
      offline: 'text-red-400 bg-red-500/20',
      warning: 'text-yellow-400 bg-yellow-500/20',
      error: 'text-red-400 bg-red-500/20'
    };

    const StatusIcon = device.status === 'online' ? CheckCircle : 
                      device.status === 'offline' ? WifiOff : AlertTriangle;

    return (
      <div className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
        <div className={`p-2 rounded-lg ${statusColors[device.status]}`}>
          <StatusIcon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-white font-medium">{device.name}</p>
          <p className="text-gray-400 text-sm">{device.location.address}</p>
        </div>
        <div className="text-right space-y-1">
          {device.batteryLevel && (
            <div className="flex items-center space-x-1">
              <Battery className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">{Math.round(device.batteryLevel)}%</span>
            </div>
          )}
          {device.temperature && (
            <div className="flex items-center space-x-1">
              <Thermometer className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">{device.temperature.toFixed(1)}°C</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const NetworkChart: React.FC = () => {
    const maxInbound = Math.max(...networkData.map(d => d.inbound));
    const maxOutbound = Math.max(...networkData.map(d => d.outbound));
    const maxValue = Math.max(maxInbound, maxOutbound);

    return (
      <div className="h-64 flex items-end space-x-1 px-4">
        {networkData.slice(-12).map((data, index) => {
          const inboundHeight = (data.inbound / maxValue) * 100;
          const outboundHeight = (data.outbound / maxValue) * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center space-y-1">
              <div className="w-full flex flex-col items-center space-y-1">
                <div 
                  className="w-3 bg-cyan-400 rounded-t transition-all duration-300 hover:bg-cyan-300"
                  style={{ height: `${inboundHeight}%`, minHeight: '2px' }}
                  title={`Inbound: ${data.inbound.toFixed(1)} Mbps`}
                />
                <div 
                  className="w-3 bg-blue-400 rounded-b transition-all duration-300 hover:bg-blue-300"
                  style={{ height: `${outboundHeight}%`, minHeight: '2px' }}
                  title={`Outbound: ${data.outbound.toFixed(1)} Mbps`}
                />
              </div>
              <span className="text-xs text-gray-500 transform rotate-45 origin-bottom-left">
                {data.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-gray-400">Real-time overview of your IoT infrastructure</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="Online Devices"
          value={onlineDevices}
          icon={Cpu}
          color="text-green-400"
          trend="+2 since last hour"
        />
        <StatusCard
          title="Security Alerts"
          value={activeAlerts}
          icon={Shield}
          color="text-red-400"
          trend={`${criticalAlerts} critical`}
        />
        <StatusCard
          title="Warning Devices"
          value={warningDevices}
          icon={AlertTriangle}
          color="text-yellow-400"
        />
        <StatusCard
          title="Offline Devices"
          value={offlineDevices}
          icon={WifiOff}
          color="text-red-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Alerts */}
        <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Security Alerts</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Live</span>
            </div>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 5).map(alert => (
              <RecentAlert key={alert.id} alert={alert} />
            ))}
          </div>
        </div>

        {/* Device Status */}
        <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Device Status</h3>
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="space-y-3">
            {devices.slice(0, 5).map(device => (
              <DeviceStatus key={device.id} device={device} />
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Network Activity Module */}
      <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-semibold text-white">Network Activity</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400">Real-time</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="1h">Last Hour</option>
              <option value="2h">Last 2 Hours</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
            </select>
            <BarChart3 className="w-5 h-5 text-cyan-400" />
          </div>
        </div>

        {/* Network Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">Inbound</p>
                <p className="text-cyan-400 text-lg font-bold">
                  {currentNetworkStats?.inbound.toFixed(1)} Mbps
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="w-4 h-4 text-cyan-400" />
                {previousNetworkStats && getTrendIcon(currentNetworkStats?.inbound || 0, previousNetworkStats.inbound)}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">Outbound</p>
                <p className="text-blue-400 text-lg font-bold">
                  {currentNetworkStats?.outbound.toFixed(1)} Mbps
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <Upload className="w-4 h-4 text-blue-400" />
                {previousNetworkStats && getTrendIcon(currentNetworkStats?.outbound || 0, previousNetworkStats.outbound)}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">Latency</p>
                <p className="text-yellow-400 text-lg font-bold">
                  {currentNetworkStats?.latency.toFixed(0)} ms
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-yellow-400" />
                {previousNetworkStats && getTrendIcon(previousNetworkStats.latency, currentNetworkStats?.latency || 0)}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">Packet Loss</p>
                <p className="text-red-400 text-lg font-bold">
                  {currentNetworkStats?.packetLoss.toFixed(2)}%
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-red-400" />
                {previousNetworkStats && getTrendIcon(previousNetworkStats.packetLoss, currentNetworkStats?.packetLoss || 0)}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">Connections</p>
                <p className="text-purple-400 text-lg font-bold">
                  {currentNetworkStats?.activeConnections}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-purple-400" />
                {previousNetworkStats && getTrendIcon(currentNetworkStats?.activeConnections || 0, previousNetworkStats.activeConnections)}
              </div>
            </div>
          </div>
        </div>

        {/* Network Chart */}
        <div className="bg-gray-900/50 rounded-lg border border-gray-700/50 mb-6">
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium">Traffic Overview</h4>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded"></div>
                  <span className="text-gray-400">Inbound</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded"></div>
                  <span className="text-gray-400">Outbound</span>
                </div>
              </div>
            </div>
          </div>
          <NetworkChart />
        </div>

        {/* Network Devices */}
        <div className="bg-gray-900/50 rounded-lg border border-gray-700/50">
          <div className="p-4 border-b border-gray-700/50">
            <h4 className="text-white font-medium flex items-center">
              <Server className="w-4 h-4 mr-2" />
              Active Network Devices
            </h4>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {networkDevices.map(device => (
                <div key={device.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getDeviceStatusColor(device.status)}`}></div>
                    <div>
                      <p className="text-white font-medium">{device.name}</p>
                      <p className="text-gray-400 text-sm">{device.ip}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-medium">{device.bandwidth.toFixed(1)} Mbps</p>
                    <p className="text-gray-400 text-sm">{device.packets.toLocaleString()} packets</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;