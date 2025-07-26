import React, { useState } from 'react';
import { FirmwareUpdate } from '../types';
import { 
  Download, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Shield,
  Package,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

const FirmwareManager: React.FC = () => {
  const [updates] = useState<FirmwareUpdate[]>([
    {
      id: 'fw-001',
      version: '2.1.5',
      deviceTypes: ['sensor', 'gateway'],
      status: 'deploying',
      progress: 65,
      releaseDate: new Date('2024-01-15'),
      securityPatch: true
    },
    {
      id: 'fw-002',
      version: '3.2.2',
      deviceTypes: ['camera'],
      status: 'pending',
      progress: 0,
      releaseDate: new Date('2024-01-10'),
      securityPatch: false
    },
    {
      id: 'fw-003',
      version: '1.8.3',
      deviceTypes: ['actuator'],
      status: 'completed',
      progress: 100,
      releaseDate: new Date('2024-01-05'),
      securityPatch: true
    }
  ]);

  const getStatusColor = (status: FirmwareUpdate['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'deploying': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'failed': return 'text-red-400 bg-red-500/20 border-red-500/30';
    }
  };

  const getStatusIcon = (status: FirmwareUpdate['status']) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'deploying': return RefreshCw;
      case 'pending': return Clock;
      case 'failed': return AlertTriangle;
    }
  };

  const UpdateCard: React.FC<{ update: FirmwareUpdate }> = ({ update }) => {
    const StatusIcon = getStatusIcon(update.status);

    return (
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <Package className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-white">Version {update.version}</h3>
                {update.securityPatch && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
                    <Shield className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-red-400 font-medium">Security</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-400">
                Compatible: {update.deviceTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(', ')}
              </p>
            </div>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(update.status)}`}>
            <StatusIcon className={`w-4 h-4 ${update.status === 'deploying' ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium capitalize">{update.status}</span>
          </div>
        </div>

        {/* Progress Bar for Deploying Updates */}
        {update.status === 'deploying' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Deployment Progress</span>
              <span className="text-sm text-cyan-400 font-medium">{update.progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${update.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Released: {update.releaseDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            {update.status === 'pending' && (
              <button className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 transition-colors">
                <Play className="w-4 h-4" />
                <span className="text-sm">Deploy</span>
              </button>
            )}
            {update.status === 'deploying' && (
              <button className="flex items-center space-x-1 px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-yellow-400 transition-colors">
                <Pause className="w-4 h-4" />
                <span className="text-sm">Pause</span>
              </button>
            )}
            <button className="flex items-center space-x-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm">Details</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Firmware Management</h2>
        <p className="text-gray-400">Deploy and manage firmware updates across your IoT fleet</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Active Deployments</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">
                {updates.filter(u => u.status === 'deploying').length}
              </p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Pending Updates</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">
                {updates.filter(u => u.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Security Patches</p>
              <p className="text-2xl font-bold text-red-400 mt-1">
                {updates.filter(u => u.securityPatch).length}
              </p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Upload New Firmware */}
      <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Upload New Firmware</h3>
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-cyan-500/50 transition-colors cursor-pointer">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-white font-medium mb-2">Drag & drop firmware files here</p>
          <p className="text-gray-400 text-sm mb-4">or click to browse</p>
          <button className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
            Select Files
          </button>
        </div>
      </div>

      {/* Updates List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Available Updates</h3>
        {updates.map(update => (
          <UpdateCard key={update.id} update={update} />
        ))}
      </div>

      {/* Deployment Strategy */}
      <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Deployment Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <span className="text-cyan-400 font-semibold text-sm">1</span>
              </div>
              <div>
                <p className="text-white font-medium">Canary Deployment</p>
                <p className="text-gray-400 text-sm">Deploy to 5% of devices first</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <span className="text-cyan-400 font-semibold text-sm">2</span>
              </div>
              <div>
                <p className="text-white font-medium">Gradual Rollout</p>
                <p className="text-gray-400 text-sm">Increase to 25%, then 50%</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <span className="text-cyan-400 font-semibold text-sm">3</span>
              </div>
              <div>
                <p className="text-white font-medium">Full Deployment</p>
                <p className="text-gray-400 text-sm">Complete rollout to all devices</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Automatic Rollback</span>
              </div>
              <p className="text-gray-300 text-sm">Failed deployments are automatically reverted</p>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Cryptographic Verification</span>
              </div>
              <p className="text-gray-300 text-sm">All updates are signed and verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirmwareManager;