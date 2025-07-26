import React, { useState, useEffect } from 'react';
import { SecurityAlert } from '../types';
import CustomSelect from './CustomSelect';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Filter,
  Eye,
  X,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Globe,
  Server,
  Users,
  Lock,
  Unlock,
  Brain,
  Target,
  Wifi,
  Database,
  FileX,
  Bug
} from 'lucide-react';

// Mock data - same as Dashboard
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
  },
  {
    id: 'alert-004',
    deviceId: 'dev-002',
    type: 'firmware',
    severity: 'low',
    message: 'Firmware update available',
    timestamp: new Date(Date.now() - 2400000),
    resolved: false
  },
  {
    id: 'alert-005',
    deviceId: 'dev-005',
    type: 'anomaly',
    severity: 'critical',
    message: 'Unauthorized access attempt detected',
    timestamp: new Date(Date.now() - 3000000),
    resolved: false
  }
];

// Enhanced Threat Detection Data
interface ThreatEvent {
  id: string;
  timestamp: Date;
  type: 'malware' | 'intrusion' | 'anomaly' | 'ddos' | 'data_breach' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  target: string;
  description: string;
  status: 'detected' | 'investigating' | 'mitigated' | 'resolved';
  confidence: number; // ML confidence score 0-100
  affectedDevices: number;
  dataSize?: string;
  attackVector?: string;
  mitigationAction?: string;
}

interface ThreatMetrics {
  timestamp: Date;
  threatsDetected: number;
  threatsBlocked: number;
  riskScore: number;
  mlAccuracy: number;
  falsePositives: number;
}

const generateThreatTimeline = (): ThreatEvent[] => {
  const threats: ThreatEvent[] = [];
  const now = new Date();
  
  const threatTypes: ThreatEvent['type'][] = ['malware', 'intrusion', 'anomaly', 'ddos', 'data_breach', 'unauthorized_access'];
  const severities: ThreatEvent['severity'][] = ['low', 'medium', 'high', 'critical'];
  const statuses: ThreatEvent['status'][] = ['detected', 'investigating', 'mitigated', 'resolved'];
  
  const sources = ['External IP: 203.0.113.45', 'Internal: 192.168.1.156', 'Unknown Origin', 'Compromised Device', 'External Network'];
  const targets = ['IoT Gateway', 'Database Server', 'Sensor Network', 'Admin Panel', 'API Endpoint'];
  
  for (let i = 0; i < 15; i++) {
    const timestamp = new Date(now.getTime() - (Math.random() * 24 * 60 * 60 * 1000)); // Last 24 hours
    const type = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    threats.push({
      id: `threat-${i + 1}`,
      timestamp,
      type,
      severity,
      source: sources[Math.floor(Math.random() * sources.length)],
      target: targets[Math.floor(Math.random() * targets.length)],
      description: getThreatDescription(type, severity),
      status,
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100% confidence
      affectedDevices: Math.floor(Math.random() * 10) + 1,
      dataSize: type === 'data_breach' ? `${Math.floor(Math.random() * 500) + 50} MB` : undefined,
      attackVector: getAttackVector(type),
      mitigationAction: status === 'mitigated' || status === 'resolved' ? getMitigationAction(type) : undefined
    });
  }
  
  return threats.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const getThreatDescription = (type: ThreatEvent['type'], severity: ThreatEvent['severity']): string => {
  const descriptions = {
    malware: [
      'Suspicious executable detected in IoT device memory',
      'Potential trojan attempting to establish backdoor',
      'Ransomware signature identified in network traffic'
    ],
    intrusion: [
      'Unauthorized login attempt from foreign IP address',
      'Privilege escalation detected on admin account',
      'Suspicious lateral movement across network segments'
    ],
    anomaly: [
      'Unusual data transmission pattern detected',
      'Abnormal device behavior outside baseline parameters',
      'Unexpected communication protocol usage identified'
    ],
    ddos: [
      'Distributed denial of service attack in progress',
      'High volume of requests overwhelming gateway',
      'Coordinated botnet activity targeting infrastructure'
    ],
    data_breach: [
      'Unauthorized data exfiltration attempt detected',
      'Sensitive information accessed without authorization',
      'Database query patterns indicate potential breach'
    ],
    unauthorized_access: [
      'Failed authentication attempts exceeding threshold',
      'Access attempt using compromised credentials',
      'Unauthorized device attempting network connection'
    ]
  };
  
  const typeDescriptions = descriptions[type];
  return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
};

const getAttackVector = (type: ThreatEvent['type']): string => {
  const vectors = {
    malware: ['Email Attachment', 'USB Device', 'Network Download', 'Firmware Injection'],
    intrusion: ['SSH Brute Force', 'Web Application', 'VPN Exploit', 'Credential Stuffing'],
    anomaly: ['Machine Learning Detection', 'Behavioral Analysis', 'Statistical Deviation', 'Pattern Recognition'],
    ddos: ['UDP Flood', 'SYN Flood', 'HTTP Flood', 'DNS Amplification'],
    data_breach: ['SQL Injection', 'API Exploitation', 'Insider Threat', 'Privilege Abuse'],
    unauthorized_access: ['Password Attack', 'Social Engineering', 'Physical Access', 'Token Theft']
  };
  
  const typeVectors = vectors[type];
  return typeVectors[Math.floor(Math.random() * typeVectors.length)];
};

const getMitigationAction = (type: ThreatEvent['type']): string => {
  const actions = {
    malware: ['Quarantined infected files', 'Updated antivirus signatures', 'Isolated affected devices'],
    intrusion: ['Blocked source IP address', 'Reset compromised credentials', 'Enhanced monitoring activated'],
    anomaly: ['Adjusted ML baseline parameters', 'Manual investigation completed', 'Device behavior normalized'],
    ddos: ['Rate limiting applied', 'Traffic filtering enabled', 'Upstream mitigation activated'],
    data_breach: ['Access permissions revoked', 'Data encryption enhanced', 'Audit trail preserved'],
    unauthorized_access: ['Account locked temporarily', 'Multi-factor auth enforced', 'Access logs reviewed']
  };
  
  const typeActions = actions[type];
  return typeActions[Math.floor(Math.random() * typeActions.length)];
};

const generateThreatMetrics = (): ThreatMetrics[] => {
  const metrics: ThreatMetrics[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000)); // Hourly data for 24 hours
    metrics.push({
      timestamp,
      threatsDetected: Math.floor(Math.random() * 20) + 5,
      threatsBlocked: Math.floor(Math.random() * 15) + 3,
      riskScore: Math.floor(Math.random() * 40) + 30, // 30-70 risk score
      mlAccuracy: Math.floor(Math.random() * 10) + 90, // 90-100% accuracy
      falsePositives: Math.floor(Math.random() * 3)
    });
  }
  
  return metrics;
};

const SecurityPanel: React.FC = () => {
  const alerts = mockAlerts;
  const [threatEvents, setThreatEvents] = useState<ThreatEvent[]>(generateThreatTimeline());
  const [threatMetrics, setThreatMetrics] = useState<ThreatMetrics[]>(generateThreatMetrics());
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [selectedThreat, setSelectedThreat] = useState<ThreatEvent | null>(null);
  const [timelineView, setTimelineView] = useState<'events' | 'metrics'>('events');

  const activeAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');
  const highAlerts = activeAlerts.filter(a => a.severity === 'high');

  // Real-time threat detection simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Occasionally add new threat events
      if (Math.random() < 0.3) { // 30% chance every 30 seconds
        const newThreat: ThreatEvent = {
          id: `threat-${Date.now()}`,
          timestamp: new Date(),
          type: ['anomaly', 'intrusion', 'unauthorized_access'][Math.floor(Math.random() * 3)] as ThreatEvent['type'],
          severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as ThreatEvent['severity'],
          source: 'Real-time Detection',
          target: 'IoT Network',
          description: 'Automated threat detection identified suspicious activity',
          status: 'detected',
          confidence: Math.floor(Math.random() * 20) + 80,
          affectedDevices: Math.floor(Math.random() * 3) + 1
        };
        
        setThreatEvents(prev => [newThreat, ...prev.slice(0, 14)]);
      }
      
      // Update metrics
      setThreatMetrics(prev => {
        const newMetric: ThreatMetrics = {
          timestamp: new Date(),
          threatsDetected: Math.floor(Math.random() * 20) + 5,
          threatsBlocked: Math.floor(Math.random() * 15) + 3,
          riskScore: Math.floor(Math.random() * 40) + 30,
          mlAccuracy: Math.floor(Math.random() * 10) + 90,
          falsePositives: Math.floor(Math.random() * 3)
        };
        
        return [newMetric, ...prev.slice(0, 23)];
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesType = filterType === 'all' || alert.type === filterType;
    return matchesSeverity && matchesType;
  });

  const getSeverityColor = (severity: SecurityAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  const getThreatTypeIcon = (type: ThreatEvent['type']) => {
    switch (type) {
      case 'malware': return Bug;
      case 'intrusion': return Unlock;
      case 'anomaly': return Activity;
      case 'ddos': return Zap;
      case 'data_breach': return Database;
      case 'unauthorized_access': return Lock;
      default: return Shield;
    }
  };

  const getThreatStatusColor = (status: ThreatEvent['status']) => {
    switch (status) {
      case 'detected': return 'text-red-400 bg-red-500/20';
      case 'investigating': return 'text-yellow-400 bg-yellow-500/20';
      case 'mitigated': return 'text-blue-400 bg-blue-500/20';
      case 'resolved': return 'text-green-400 bg-green-500/20';
    }
  };

  const getTypeIcon = (type: SecurityAlert['type']) => {
    switch (type) {
      case 'anomaly': return Activity;
      case 'authentication': return Shield;
      case 'network': return TrendingUp;
      case 'firmware': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const SecurityMetric: React.FC<{
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    trend: 'up' | 'down' | 'neutral';
    color: string;
  }> = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${color.includes('red') ? 'bg-red-500/20' : color.includes('green') ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          {trend === 'up' && <TrendingUp className="w-4 h-4 text-red-400" />}
          {trend === 'down' && <TrendingDown className="w-4 h-4 text-green-400" />}
        </div>
      </div>
    </div>
  );

  const AlertCard: React.FC<{ alert: SecurityAlert }> = ({ alert }) => {
    const TypeIcon = getTypeIcon(alert.type);
    
    return (
      <div
        onClick={() => setSelectedAlert(alert)}
        className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 hover:border-gray-600/50 transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg border ${getSeverityColor(alert.severity)}`}>
              <TypeIcon className="w-4 h-4" />
            </div>
            <div>
              <p className={`text-sm font-medium uppercase tracking-wider ${getSeverityColor(alert.severity).split(' ')[0]}`}>
                {alert.severity}
              </p>
              <p className="text-xs text-gray-400 capitalize">{alert.type} Alert</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {alert.resolved ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />
            )}
            <span className="text-xs text-gray-400">
              {new Date(alert.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
        
        <p className="text-white font-medium mb-2">{alert.message}</p>
        <p className="text-sm text-gray-400">Device ID: {alert.deviceId}</p>
      </div>
    );
  };

  const ThreatTimelineChart: React.FC = () => {
    if (timelineView === 'metrics') {
      return (
        <div className="h-64 flex items-end space-x-1 px-4">
          {threatMetrics.slice(-12).map((metric, index) => {
            const maxThreats = Math.max(...threatMetrics.map(m => m.threatsDetected));
            const height = (metric.threatsDetected / maxThreats) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center space-y-1">
                <div 
                  className="w-4 bg-red-400 rounded-t transition-all duration-300 hover:bg-red-300"
                  style={{ height: `${height}%`, minHeight: '4px' }}
                  title={`${metric.threatsDetected} threats detected`}
                />
                <span className="text-xs text-gray-500 transform rotate-45 origin-bottom-left">
                  {metric.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="space-y-4 max-h-64 overflow-y-auto">
        {threatEvents.slice(0, 8).map((threat, index) => {
          const ThreatIcon = getThreatTypeIcon(threat.type);
          
          return (
            <div key={threat.id} className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-full ${getSeverityColor(threat.severity)}`}>
                  <ThreatIcon className="w-4 h-4" />
                </div>
                {index < threatEvents.slice(0, 8).length - 1 && (
                  <div className="w-px h-12 bg-gray-600 mt-2" />
                )}
              </div>
              <div 
                className="flex-1 cursor-pointer hover:bg-gray-700/20 p-3 rounded-lg transition-colors"
                onClick={() => setSelectedThreat(threat)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                      {threat.severity.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getThreatStatusColor(threat.status)}`}>
                      {threat.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {threat.confidence}% confidence
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {threat.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-white font-medium mb-1">{threat.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span>Source: {threat.source}</span>
                  <span>Target: {threat.target}</span>
                  <span>{threat.affectedDevices} devices affected</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Security Center</h2>
        <p className="text-gray-400">Monitor threats and security events across your IoT infrastructure</p>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SecurityMetric
          title="Active Threats"
          value={activeAlerts.length}
          icon={AlertTriangle}
          trend="up"
          color="text-red-400"
        />
        <SecurityMetric
          title="Critical Alerts"
          value={criticalAlerts.length}
          icon={Shield}
          trend="neutral"
          color="text-red-400"
        />
        <SecurityMetric
          title="Resolved Today"
          value={resolvedAlerts.length}
          icon={CheckCircle}
          trend="down"
          color="text-green-400"
        />
        <SecurityMetric
          title="High Priority"
          value={highAlerts.length}
          icon={TrendingUp}
          trend="up"
          color="text-yellow-400"
        />
      </div>

      {/* Enhanced Threat Timeline */}
      <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-semibold text-white">Threat Detection Timeline</h3>
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-cyan-400">ML-powered detection</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-700/50 rounded-lg p-1">
              <button
                onClick={() => setTimelineView('events')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  timelineView === 'events' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Events
              </button>
              <button
                onClick={() => setTimelineView('metrics')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  timelineView === 'metrics' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Metrics
              </button>
            </div>
            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
        </div>

        {/* Threat Statistics */}
        {timelineView === 'metrics' && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <p className="text-gray-400 text-xs">Threats Detected</p>
              <p className="text-red-400 text-lg font-bold">
                {threatMetrics[threatMetrics.length - 1]?.threatsDetected || 0}
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4">
              <p className="text-gray-400 text-xs">Threats Blocked</p>
              <p className="text-green-400 text-lg font-bold">
                {threatMetrics[threatMetrics.length - 1]?.threatsBlocked || 0}
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4">
              <p className="text-gray-400 text-xs">Risk Score</p>
              <p className="text-yellow-400 text-lg font-bold">
                {threatMetrics[threatMetrics.length - 1]?.riskScore || 0}
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4">
              <p className="text-gray-400 text-xs">ML Accuracy</p>
              <p className="text-cyan-400 text-lg font-bold">
                {threatMetrics[threatMetrics.length - 1]?.mlAccuracy || 0}%
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4">
              <p className="text-gray-400 text-xs">False Positives</p>
              <p className="text-purple-400 text-lg font-bold">
                {threatMetrics[threatMetrics.length - 1]?.falsePositives || 0}
              </p>
            </div>
          </div>
        )}

        <div className="bg-gray-900/50 rounded-lg border border-gray-700/50">
          <div className="p-4 border-b border-gray-700/50">
            <h4 className="text-white font-medium">
              {timelineView === 'events' ? 'Recent Threat Events' : 'Threat Detection Metrics'}
            </h4>
          </div>
          <div className="p-4">
            <ThreatTimelineChart />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-gray-800/20 p-4 rounded-xl border border-gray-700/50">
        <CustomSelect
          value={filterSeverity}
          onChange={(value) => setFilterSeverity(value)}
          options={[
            { value: 'all', label: 'All Severities' },
            { value: 'critical', label: 'Critical' },
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' }
          ]}
          className="min-w-[140px]"
        />

        <CustomSelect
          value={filterType}
          onChange={(value) => setFilterType(value)}
          options={[
            { value: 'all', label: 'All Types' },
            { value: 'anomaly', label: 'Anomaly' },
            { value: 'authentication', label: 'Authentication' },
            { value: 'network', label: 'Network' },
            { value: 'firmware', label: 'Firmware' }
          ]}
          className="min-w-[140px]"
        />

        <div className="flex items-center space-x-2 text-gray-400">
          <Filter className="w-4 h-4" />
          <span className="text-sm">{filteredAlerts.length} alerts</span>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Alert Details</h3>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getSeverityColor(selectedAlert.severity)}`}>
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium uppercase">{selectedAlert.severity}</span>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">Message</h4>
                <p className="text-gray-300">{selectedAlert.message}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-1">Type</h4>
                  <p className="text-gray-300 capitalize">{selectedAlert.type}</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Device</h4>
                  <p className="text-gray-300">{selectedAlert.deviceId}</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Timestamp</h4>
                  <p className="text-gray-300">{new Date(selectedAlert.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Status</h4>
                  <p className={selectedAlert.resolved ? 'text-green-400' : 'text-yellow-400'}>
                    {selectedAlert.resolved ? 'Resolved' : 'Active'}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
                  Acknowledge
                </button>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                  Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Threat Detail Modal */}
      {selectedThreat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Threat Analysis</h3>
              <button
                onClick={() => setSelectedThreat(null)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${getSeverityColor(selectedThreat.severity)}`}>
                  {React.createElement(getThreatTypeIcon(selectedThreat.type), { className: "w-6 h-6" })}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">{selectedThreat.description}</h4>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(selectedThreat.severity)}`}>
                      {selectedThreat.severity.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getThreatStatusColor(selectedThreat.status)}`}>
                      {selectedThreat.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="text-white font-medium mb-3">Threat Details</h5>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Type:</span>
                      <p className="text-white capitalize">{selectedThreat.type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Confidence Score:</span>
                      <p className="text-cyan-400 font-medium">{selectedThreat.confidence}%</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Attack Vector:</span>
                      <p className="text-white">{selectedThreat.attackVector}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Affected Devices:</span>
                      <p className="text-orange-400 font-medium">{selectedThreat.affectedDevices}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-white font-medium mb-3">Network Information</h5>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Source:</span>
                      <p className="text-white">{selectedThreat.source}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Target:</span>
                      <p className="text-white">{selectedThreat.target}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Timestamp:</span>
                      <p className="text-gray-300">{selectedThreat.timestamp.toLocaleString()}</p>
                    </div>
                    {selectedThreat.dataSize && (
                      <div>
                        <span className="text-gray-400 text-sm">Data Size:</span>
                        <p className="text-red-400 font-medium">{selectedThreat.dataSize}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedThreat.mitigationAction && (
                <div>
                  <h5 className="text-white font-medium mb-2">Mitigation Action</h5>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="text-green-400">{selectedThreat.mitigationAction}</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                  Block Source
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Investigate
                </button>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                  Mark as False Positive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityPanel;