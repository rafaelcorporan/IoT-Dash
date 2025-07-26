import { useState, useEffect } from 'react';
import { Device, SecurityAlert } from '../types';

// Mock data generators
const generateMockDevices = (): Device[] => {
  const devices: Device[] = [
    {
      id: 'dev-001',
      name: 'Temperature Sensor Alpha',
      type: 'sensor',
      status: 'online',
      location: { lat: 40.7128, lng: -74.0060, address: 'New York, NY' },
      lastSeen: new Date(),
      firmwareVersion: '2.1.4',
      batteryLevel: 87,
      temperature: 22.5,
      securityLevel: 'high',
      dataPoints: []
    },
    {
      id: 'dev-002',
      name: 'Gateway Node Beta',
      type: 'gateway',
      status: 'online',
      location: { lat: 34.0522, lng: -118.2437, address: 'Los Angeles, CA' },
      lastSeen: new Date(),
      firmwareVersion: '1.8.2',
      securityLevel: 'high',
      dataPoints: []
    },
    {
      id: 'dev-003',
      name: 'Security Camera Gamma',
      type: 'camera',
      status: 'warning',
      location: { lat: 41.8781, lng: -87.6298, address: 'Chicago, IL' },
      lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
      firmwareVersion: '3.2.1',
      securityLevel: 'medium',
      dataPoints: []
    },
    {
      id: 'dev-004',
      name: 'Actuator Delta',
      type: 'actuator',
      status: 'offline',
      location: { lat: 29.7604, lng: -95.3698, address: 'Houston, TX' },
      lastSeen: new Date(Date.now() - 1800000), // 30 minutes ago
      firmwareVersion: '1.5.8',
      batteryLevel: 23,
      securityLevel: 'low',
      dataPoints: []
    }
  ];

  return devices.map(device => ({
    ...device,
    dataPoints: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000),
      value: Math.random() * 100,
      metric: device.type === 'sensor' ? 'temperature' : 'activity'
    }))
  }));
};

const generateMockAlerts = (): SecurityAlert[] => [
  {
    id: 'alert-001',
    deviceId: 'dev-003',
    type: 'anomaly',
    severity: 'high',
    message: 'Unusual data pattern detected - possible tampering',
    timestamp: new Date(Date.now() - 120000),
    resolved: false
  },
  {
    id: 'alert-002',
    deviceId: 'dev-004',
    type: 'network',
    severity: 'medium',
    message: 'Device offline for extended period',
    timestamp: new Date(Date.now() - 1800000),
    resolved: false
  },
  {
    id: 'alert-003',
    deviceId: 'dev-001',
    type: 'authentication',
    severity: 'low',
    message: 'Certificate renewal recommended',
    timestamp: new Date(Date.now() - 3600000),
    resolved: true
  }
];

export const useRealTimeData = () => {
  const [devices, setDevices] = useState<Device[]>(generateMockDevices());
  const [alerts, setAlerts] = useState<SecurityAlert[]>(generateMockAlerts());

  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prevDevices => 
        prevDevices.map(device => ({
          ...device,
          lastSeen: device.status === 'online' ? new Date() : device.lastSeen,
          batteryLevel: device.batteryLevel ? Math.max(0, device.batteryLevel - Math.random() * 0.1) : undefined,
          temperature: device.type === 'sensor' ? 20 + Math.random() * 10 : undefined,
          dataPoints: [
            ...device.dataPoints.slice(1),
            {
              timestamp: new Date(),
              value: Math.random() * 100,
              metric: device.type === 'sensor' ? 'temperature' : 'activity'
            }
          ]
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { devices, alerts };
};