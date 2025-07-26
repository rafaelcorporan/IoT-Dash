import React, { useState, useEffect } from 'react';
import { SystemSettings, SettingsCategory } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import CustomSelect from './CustomSelect';
import { 
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Shield,
  Bell,
  Globe,
  Monitor,
  Database,
  Key,
  Upload,
  Download,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Clock,
  Mail,
  Smartphone,
  Server,
  Lock,
  Unlock,
  RefreshCw,
  Calendar,
  Palette,
  Languages,
  MapPin,
  Wifi,
  HardDrive,
  Activity,
  Zap
} from 'lucide-react';

// Mock settings data
const defaultSettings: SystemSettings = {
  general: {
    platformName: 'SecureIoT Platform',
    timezone: 'America/New_York',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    theme: 'dark',
    sessionTimeout: 30,
    maxLoginAttempts: 5
  },
  security: {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      passwordExpiry: 90
    },
    twoFactorAuth: {
      enforced: false,
      methods: ['authenticator', 'sms'],
      backupCodes: true
    },
    encryption: {
      algorithm: 'AES-256',
      keyLength: 256,
      rotationInterval: 365
    },
    auditRetention: 365
  },
  notifications: {
    email: {
      enabled: true,
      smtpServer: 'smtp.secureiot.com',
      smtpPort: 587,
      smtpSecurity: 'tls',
      senderEmail: 'noreply@secureiot.com',
      senderName: 'SecureIoT Platform',
      templates: {
        alerts: true,
        reports: true,
        maintenance: false
      }
    },
    push: {
      enabled: true,
      urgentOnly: false,
      quietHours: {
        enabled: true,
        startTime: '22:00',
        endTime: '08:00'
      }
    },
    sms: {
      enabled: false,
      provider: 'twilio',
      criticalOnly: true
    }
  },
  network: {
    apiRateLimit: 1000,
    maxConcurrentConnections: 500,
    allowedIpRanges: ['10.0.0.0/8', '192.168.0.0/16'],
    blockedIpAddresses: [],
    sslCertificate: {
      issuer: 'Let\'s Encrypt',
      expiryDate: new Date('2024-12-31'),
      autoRenewal: true
    }
  },
  monitoring: {
    healthCheckInterval: 30,
    performanceMetrics: true,
    resourceUsageAlerts: true,
    logLevel: 'info',
    retentionPeriod: 30
  },
  backup: {
    enabled: true,
    frequency: 'daily',
    retentionCount: 7,
    location: '/var/backups/secureiot',
    encryption: true,
    lastBackup: new Date('2024-01-15T03:00:00Z')
  },
  integration: {
    apiKeys: [
      {
        name: 'Dashboard API',
        key: 'sk_live_...',
        permissions: ['read', 'write'],
        lastUsed: new Date('2024-01-15T10:30:00Z')
      }
    ],
    webhooks: [
      {
        url: 'https://external-service.com/webhook',
        events: ['device.connected', 'alert.created'],
        enabled: true,
        secret: 'whsec_...'
      }
    ],
    thirdPartyServices: [
      {
        name: 'AWS IoT Core',
        enabled: false,
        config: {}
      }
    ]
  }
};

const settingsCategories: SettingsCategory[] = [
  {
    id: 'general',
    name: 'General',
    description: 'Basic platform settings and preferences',
    icon: 'settings'
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Authentication, encryption, and security policies',
    icon: 'shield'
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Email, SMS, and push notification settings',
    icon: 'bell'
  },
  {
    id: 'network',
    name: 'Network',
    description: 'API limits, SSL certificates, and network security',
    icon: 'globe'
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    description: 'Performance monitoring and logging configuration',
    icon: 'monitor'
  },
  {
    id: 'backup',
    name: 'Backup & Recovery',
    description: 'Data backup and disaster recovery settings',
    icon: 'database'
  },
  {
    id: 'integration',
    name: 'Integrations',
    description: 'API keys, webhooks, and third-party services',
    icon: 'key'
  }
];

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<SystemSettings>(() => ({
    ...defaultSettings,
    general: {
      ...defaultSettings.general,
      theme: theme
    }
  }));
  const [activeCategory, setActiveCategory] = useState('general');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [testingConnection, setTestingConnection] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Update theme when settings change
  useEffect(() => {
    if (settings.general.theme !== theme) {
      setTheme(settings.general.theme);
    }
  }, [settings.general.theme, theme, setTheme]);

  const updateSetting = (category: keyof SystemSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const updateNestedSetting = (category: keyof SystemSettings, section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [section]: {
          ...(prev[category] as any)[section],
          [field]: value
        }
      }
    }));
    setUnsavedChanges(true);
  };

  const saveSettings = async () => {
    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUnsavedChanges(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setUnsavedChanges(false);
  };

  const testEmailConnection = async () => {
    setTestingConnection(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Email connection test successful!');
    } catch (error) {
      alert('Email connection test failed!');
    } finally {
      setTestingConnection(false);
    }
  };

  const triggerBackup = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettings(prev => ({
        ...prev,
        backup: {
          ...prev.backup,
          lastBackup: new Date()
        }
      }));
      alert('Backup completed successfully!');
    } catch (error) {
      alert('Backup failed!');
    }
  };

  const getCategoryIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      settings: <SettingsIcon className="w-5 h-5" />,
      shield: <Shield className="w-5 h-5" />,
      bell: <Bell className="w-5 h-5" />,
      globe: <Globe className="w-5 h-5" />,
      monitor: <Monitor className="w-5 h-5" />,
      database: <Database className="w-5 h-5" />,
      key: <Key className="w-5 h-5" />
    };
    return iconMap[iconName] || <SettingsIcon className="w-5 h-5" />;
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          General Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Platform Name</label>
            <input
              type="text"
              value={settings.general.platformName}
              onChange={(e) => updateSetting('general', 'platformName', e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Theme</label>
            <CustomSelect
              value={settings.general.theme}
              onChange={(value) => updateSetting('general', 'theme', value)}
              options={[
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' },
                { value: 'auto', label: 'Auto' }
              ]}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Timezone</label>
            <CustomSelect
              value={settings.general.timezone}
              onChange={(value) => updateSetting('general', 'timezone', value)}
              options={[
                { value: 'America/New_York', label: 'Eastern Time' },
                { value: 'America/Chicago', label: 'Central Time' },
                { value: 'America/Denver', label: 'Mountain Time' },
                { value: 'America/Los_Angeles', label: 'Pacific Time' },
                { value: 'UTC', label: 'UTC' }
              ]}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Language</label>
            <CustomSelect
              value={settings.general.language}
              onChange={(value) => updateSetting('general', 'language', value)}
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'de', label: 'German' }
              ]}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              value={settings.general.sessionTimeout}
              onChange={(e) => updateSetting('general', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Max Login Attempts</label>
            <input
              type="number"
              value={settings.general.maxLoginAttempts}
              onChange={(e) => updateSetting('general', 'maxLoginAttempts', parseInt(e.target.value))}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          Password Policy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Minimum Length</label>
            <input
              type="number"
              value={settings.security.passwordPolicy.minLength}
              onChange={(e) => updateNestedSetting('security', 'passwordPolicy', 'minLength', parseInt(e.target.value))}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Password Expiry (days)</label>
            <input
              type="number"
              value={settings.security.passwordPolicy.passwordExpiry}
              onChange={(e) => updateNestedSetting('security', 'passwordPolicy', 'passwordExpiry', parseInt(e.target.value))}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {[
            { key: 'requireUppercase', label: 'Require Uppercase Letters' },
            { key: 'requireLowercase', label: 'Require Lowercase Letters' },
            { key: 'requireNumbers', label: 'Require Numbers' },
            { key: 'requireSpecialChars', label: 'Require Special Characters' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={key}
                checked={settings.security.passwordPolicy[key as keyof typeof settings.security.passwordPolicy] as boolean}
                onChange={(e) => updateNestedSetting('security', 'passwordPolicy', key, e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <label htmlFor={key} className="text-gray-300">{label}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Two-Factor Authentication
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="enforce2fa"
              checked={settings.security.twoFactorAuth.enforced}
              onChange={(e) => updateNestedSetting('security', 'twoFactorAuth', 'enforced', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="enforce2fa" className="text-gray-300">Enforce 2FA for all users</label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="backupCodes"
              checked={settings.security.twoFactorAuth.backupCodes}
              onChange={(e) => updateNestedSetting('security', 'twoFactorAuth', 'backupCodes', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="backupCodes" className="text-gray-300">Enable backup codes</label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Key className="w-5 h-5 mr-2" />
          Encryption
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Algorithm</label>
            <CustomSelect
              value={settings.security.encryption.algorithm}
              onChange={(value) => updateNestedSetting('security', 'encryption', 'algorithm', value)}
              options={[
                { value: 'AES-256', label: 'AES-256' },
                { value: 'AES-128', label: 'AES-128' },
                { value: 'ChaCha20', label: 'ChaCha20' }
              ]}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Key Rotation (days)</label>
            <input
              type="number"
              value={settings.security.encryption.rotationInterval}
              onChange={(e) => updateNestedSetting('security', 'encryption', 'rotationInterval', parseInt(e.target.value))}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Mail className="w-5 h-5 mr-2" />
          Email Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="emailEnabled"
              checked={settings.notifications.email.enabled}
              onChange={(e) => updateNestedSetting('notifications', 'email', 'enabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="emailEnabled" className="text-gray-300">Enable email notifications</label>
          </div>
          {settings.notifications.email.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">SMTP Server</label>
                <input
                  type="text"
                  value={settings.notifications.email.smtpServer}
                  onChange={(e) => updateNestedSetting('notifications', 'email', 'smtpServer', e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">SMTP Port</label>
                <input
                  type="number"
                  value={settings.notifications.email.smtpPort}
                  onChange={(e) => updateNestedSetting('notifications', 'email', 'smtpPort', parseInt(e.target.value))}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Sender Email</label>
                <input
                  type="email"
                  value={settings.notifications.email.senderEmail}
                  onChange={(e) => updateNestedSetting('notifications', 'email', 'senderEmail', e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Security</label>
                <CustomSelect
                  value={settings.notifications.email.smtpSecurity}
                  onChange={(value) => updateNestedSetting('notifications', 'email', 'smtpSecurity', value)}
                  options={[
                    { value: 'none', label: 'None' },
                    { value: 'tls', label: 'TLS' },
                    { value: 'ssl', label: 'SSL' }
                  ]}
                  className="w-full"
                />
              </div>
            </div>
          )}
          <div className="flex items-center space-x-3">
            <button
              onClick={testEmailConnection}
              disabled={testingConnection}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {testingConnection ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              <span>{testingConnection ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Smartphone className="w-5 h-5 mr-2" />
          Push Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="pushEnabled"
              checked={settings.notifications.push.enabled}
              onChange={(e) => updateNestedSetting('notifications', 'push', 'enabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="pushEnabled" className="text-gray-300">Enable push notifications</label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="urgentOnly"
              checked={settings.notifications.push.urgentOnly}
              onChange={(e) => updateNestedSetting('notifications', 'push', 'urgentOnly', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="urgentOnly" className="text-gray-300">Urgent notifications only</label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNetworkSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Wifi className="w-5 h-5 mr-2" />
          API Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">API Rate Limit (requests/hour)</label>
            <input
              type="number"
              value={settings.network.apiRateLimit}
              onChange={(e) => updateSetting('network', 'apiRateLimit', parseInt(e.target.value))}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Max Concurrent Connections</label>
            <input
              type="number"
              value={settings.network.maxConcurrentConnections}
              onChange={(e) => updateSetting('network', 'maxConcurrentConnections', parseInt(e.target.value))}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          SSL Certificate
        </h3>
        <div className="bg-gray-700/30 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Issuer:</span>
            <span className="text-white">{settings.network.sslCertificate.issuer}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Expires:</span>
            <span className="text-white">{settings.network.sslCertificate.expiryDate.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Auto Renewal:</span>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.network.sslCertificate.autoRenewal}
                onChange={(e) => updateNestedSetting('network', 'sslCertificate', 'autoRenewal', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">{settings.network.sslCertificate.autoRenewal ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMonitoringSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Performance Monitoring
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Health Check Interval (seconds)</label>
            <input
              type="number"
              value={settings.monitoring.healthCheckInterval}
              onChange={(e) => updateSetting('monitoring', 'healthCheckInterval', parseInt(e.target.value))}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Log Level</label>
            <CustomSelect
              value={settings.monitoring.logLevel}
              onChange={(value) => updateSetting('monitoring', 'logLevel', value)}
              options={[
                { value: 'debug', label: 'Debug' },
                { value: 'info', label: 'Info' },
                { value: 'warn', label: 'Warning' },
                { value: 'error', label: 'Error' }
              ]}
              className="w-full"
            />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="performanceMetrics"
              checked={settings.monitoring.performanceMetrics}
              onChange={(e) => updateSetting('monitoring', 'performanceMetrics', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="performanceMetrics" className="text-gray-300">Enable performance metrics collection</label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="resourceUsageAlerts"
              checked={settings.monitoring.resourceUsageAlerts}
              onChange={(e) => updateSetting('monitoring', 'resourceUsageAlerts', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="resourceUsageAlerts" className="text-gray-300">Resource usage alerts</label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <HardDrive className="w-5 h-5 mr-2" />
          Backup Configuration
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="backupEnabled"
              checked={settings.backup.enabled}
              onChange={(e) => updateSetting('backup', 'enabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="backupEnabled" className="text-gray-300">Enable automatic backups</label>
          </div>
          {settings.backup.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Frequency</label>
                <CustomSelect
                  value={settings.backup.frequency}
                  onChange={(value) => updateSetting('backup', 'frequency', value)}
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' }
                  ]}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Retention Count</label>
                <input
                  type="number"
                  value={settings.backup.retentionCount}
                  onChange={(e) => updateSetting('backup', 'retentionCount', parseInt(e.target.value))}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">Backup Location</label>
                <input
                  type="text"
                  value={settings.backup.location}
                  onChange={(e) => updateSetting('backup', 'location', e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
          )}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="backupEncryption"
              checked={settings.backup.encryption}
              onChange={(e) => updateSetting('backup', 'encryption', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="backupEncryption" className="text-gray-300">Encrypt backups</label>
          </div>
          {settings.backup.lastBackup && (
            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Last Backup:</span>
                <span className="text-white">{settings.backup.lastBackup.toLocaleString()}</span>
              </div>
            </div>
          )}
          <button
            onClick={triggerBackup}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Trigger Backup Now</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Key className="w-5 h-5 mr-2" />
          API Keys
        </h3>
        <div className="space-y-4">
          {settings.integration.apiKeys.map((apiKey, index) => (
            <div key={index} className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-white font-medium">{apiKey.name}</h4>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-gray-400 font-mono text-sm">
                      {showPasswords[`api-${index}`] ? apiKey.key : apiKey.key.substring(0, 10) + '...'}
                    </span>
                    <button
                      onClick={() => togglePasswordVisibility(`api-${index}`)}
                      className="text-gray-400 hover:text-white"
                    >
                      {showPasswords[`api-${index}`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-gray-400 text-sm">Permissions:</span>
                    <div className="flex space-x-1">
                      {apiKey.permissions.map(perm => (
                        <span key={perm} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                  {apiKey.lastUsed && (
                    <p className="text-gray-400 text-sm mt-1">
                      Last used: {apiKey.lastUsed.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Webhooks
        </h3>
        <div className="space-y-4">
          {settings.integration.webhooks.map((webhook, index) => (
            <div key={index} className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{webhook.url}</span>
                    <span className={`px-2 py-1 rounded text-xs ${webhook.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {webhook.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-gray-400 text-sm">Events:</span>
                    <div className="flex space-x-1">
                      {webhook.events.map(event => (
                        <span key={event} className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeCategory) {
      case 'general': return renderGeneralSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'network': return renderNetworkSettings();
      case 'monitoring': return renderMonitoringSettings();
      case 'backup': return renderBackupSettings();
      case 'integration': return renderIntegrationSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">System Settings</h2>
          <p className="text-gray-400">Configure platform settings and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          {unsavedChanges && (
            <span className="flex items-center space-x-2 text-yellow-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Unsaved changes</span>
            </span>
          )}
          <button
            onClick={resetSettings}
            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={saveSettings}
            disabled={!unsavedChanges || saveStatus === 'saving'}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              saveStatus === 'saved' 
                ? 'bg-green-600 text-white' 
                : saveStatus === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600'
            }`}
          >
            {saveStatus === 'saving' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : saveStatus === 'saved' ? (
              <Check className="w-4 h-4" />
            ) : saveStatus === 'error' ? (
              <X className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>
              {saveStatus === 'saving' ? 'Saving...' : 
               saveStatus === 'saved' ? 'Saved!' : 
               saveStatus === 'error' ? 'Error!' : 'Save Settings'}
            </span>
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
          <nav className="space-y-2">
            {settingsCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {getCategoryIcon(category.icon)}
                <div>
                  <div className="font-medium">{category.name}</div>
                  <div className="text-xs opacity-75">{category.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings; 