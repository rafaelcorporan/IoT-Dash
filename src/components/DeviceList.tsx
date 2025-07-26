import React, { useState } from 'react';
import { Device } from '../types';
import CustomSelect from './CustomSelect';
import { 
  Search, 
  Filter, 
  Cpu, 
  Camera, 
  Radio, 
  Zap,
  MapPin,
  Battery,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Shield,
  Clock
} from 'lucide-react';

// Mock data - same as Dashboard
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
  },
  {
    id: 'dev-005',
    name: 'Smart Actuator E1',
    type: 'actuator',
    status: 'online',
    location: { lat: 40.7614, lng: -73.9776, address: 'Building E, Floor 1' },
    lastSeen: new Date(),
    firmwareVersion: '2.0.1',
    batteryLevel: 92,
    securityLevel: 'medium',
    dataPoints: [
      { timestamp: new Date(), value: 1, metric: 'actuator_state' },
      { timestamp: new Date(Date.now() - 900000), value: 0, metric: 'actuator_state' }
    ]
  }
];

const DeviceList: React.FC = () => {
  const devices = mockDevices;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || device.status === filterStatus;
    const matchesType = filterType === 'all' || device.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'sensor': return Cpu;
      case 'camera': return Camera;
      case 'gateway': return Radio;
      case 'actuator': return Zap;
      default: return Cpu;
    }
  };

  const getStatusColor = (status: Device['status']) => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'offline': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'error': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getSecurityColor = (level: Device['securityLevel']) => {
    switch (level) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const StatusIcon = ({ status }: { status: Device['status'] }) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4" />;
      case 'offline': return <WifiOff className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Wifi className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Device Management</h2>
        <p className="text-gray-400">Monitor and manage all connected IoT devices</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-gray-800/20 p-4 rounded-xl border border-gray-700/50">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>
        
        <CustomSelect
          value={filterStatus}
          onChange={(value) => setFilterStatus(value)}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'online', label: 'Online' },
            { value: 'offline', label: 'Offline' },
            { value: 'warning', label: 'Warning' },
            { value: 'error', label: 'Error' }
          ]}
          className="min-w-[120px]"
        />

        <CustomSelect
          value={filterType}
          onChange={(value) => setFilterType(value)}
          options={[
            { value: 'all', label: 'All Types' },
            { value: 'sensor', label: 'Sensors' },
            { value: 'gateway', label: 'Gateways' },
            { value: 'camera', label: 'Cameras' },
            { value: 'actuator', label: 'Actuators' }
          ]}
          className="min-w-[120px]"
        />
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map(device => {
          const DeviceIcon = getDeviceIcon(device.type);
          
          return (
            <div
              key={device.id}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 hover:bg-gray-800/50 transition-all duration-300 cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <DeviceIcon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{device.name}</h3>
                    <p className="text-sm text-gray-400 capitalize">{device.type}</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs ${getStatusColor(device.status)}`}>
                  <StatusIcon status={device.status} />
                  <span className="capitalize">{device.status}</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">{device.location.address}</span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {device.batteryLevel && (
                  <div className="flex items-center space-x-2">
                    <Battery className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{Math.round(device.batteryLevel)}%</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Shield className={`w-4 h-4 ${getSecurityColor(device.securityLevel)}`} />
                  <span className={`text-sm capitalize ${getSecurityColor(device.securityLevel)}`}>
                    {device.securityLevel}
                  </span>
                </div>
              </div>

              {/* Last Seen */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>Last seen: {new Date(device.lastSeen).toLocaleTimeString()}</span>
                </div>
                <span className="text-gray-500">v{device.firmwareVersion}</span>
              </div>

              {/* Mini Chart Placeholder */}
              <div className="mt-4 h-16 bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700/30">
                <div className="flex space-x-1">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-cyan-400/60 rounded"
                      style={{ 
                        height: `${Math.random() * 32 + 8}px`,
                        animationDelay: `${i * 100}ms`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No devices match your current filters</p>
        </div>
      )}
    </div>
  );
};

export default DeviceList;