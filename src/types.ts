export interface Device {
  id: string;
  name: string;
  type: 'sensor' | 'gateway' | 'actuator' | 'camera';
  status: 'online' | 'offline' | 'warning' | 'error';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  lastSeen: Date;
  firmwareVersion: string;
  batteryLevel?: number;
  temperature?: number;
  securityLevel: 'high' | 'medium' | 'low';
  dataPoints: Array<{
    timestamp: Date;
    value: number;
    metric: string;
  }>;
}

export interface SecurityAlert {
  id: string;
  deviceId: string;
  type: 'anomaly' | 'authentication' | 'network' | 'firmware';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface FirmwareUpdate {
  id: string;
  version: string;
  deviceTypes: string[];
  status: 'pending' | 'deploying' | 'completed' | 'failed';
  progress: number;
  releaseDate: Date;
  securityPatch: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'operator' | 'viewer' | 'security_analyst';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date | null;
  createdAt: Date;
  permissions: UserPermission[];
  department?: string;
  phoneNumber?: string;
  twoFactorEnabled: boolean;
}

export interface UserPermission {
  id: string;
  name: string;
  description: string;
  category: 'devices' | 'security' | 'users' | 'firmware' | 'audit';
}

export interface CreateUserRequest {
  username: string;
  email: string;
  fullName: string;
  role: User['role'];
  department?: string;
  phoneNumber?: string;
  permissions: string[];
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  username: string;
  userRole: string;
  action: string;
  category: 'authentication' | 'user_management' | 'device_management' | 'security' | 'system' | 'firmware' | 'configuration';
  severity: 'info' | 'warning' | 'error' | 'critical';
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  changes?: AuditLogChange[];
}

export interface AuditLogChange {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface AuditLogFilter {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  category?: string;
  severity?: string;
  success?: boolean;
  searchTerm?: string;
}

export interface SystemSettings {
  general: {
    platformName: string;
    timezone: string;
    language: string;
    dateFormat: string;
    theme: 'dark' | 'light' | 'auto';
    sessionTimeout: number;
    maxLoginAttempts: number;
  };
  security: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      passwordExpiry: number;
    };
    twoFactorAuth: {
      enforced: boolean;
      methods: string[];
      backupCodes: boolean;
    };
    encryption: {
      algorithm: string;
      keyLength: number;
      rotationInterval: number;
    };
    auditRetention: number;
  };
  notifications: {
    email: {
      enabled: boolean;
      smtpServer: string;
      smtpPort: number;
      smtpSecurity: 'none' | 'tls' | 'ssl';
      senderEmail: string;
      senderName: string;
      templates: {
        alerts: boolean;
        reports: boolean;
        maintenance: boolean;
      };
    };
    push: {
      enabled: boolean;
      urgentOnly: boolean;
      quietHours: {
        enabled: boolean;
        startTime: string;
        endTime: string;
      };
    };
    sms: {
      enabled: boolean;
      provider: string;
      criticalOnly: boolean;
    };
  };
  network: {
    apiRateLimit: number;
    maxConcurrentConnections: number;
    allowedIpRanges: string[];
    blockedIpAddresses: string[];
    sslCertificate: {
      issuer: string;
      expiryDate: Date;
      autoRenewal: boolean;
    };
  };
  monitoring: {
    healthCheckInterval: number;
    performanceMetrics: boolean;
    resourceUsageAlerts: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    retentionPeriod: number;
  };
  backup: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    retentionCount: number;
    location: string;
    encryption: boolean;
    lastBackup?: Date;
  };
  integration: {
    apiKeys: {
      name: string;
      key: string;
      permissions: string[];
      lastUsed?: Date;
    }[];
    webhooks: {
      url: string;
      events: string[];
      enabled: boolean;
      secret?: string;
    }[];
    thirdPartyServices: {
      name: string;
      enabled: boolean;
      config: Record<string, any>;
    }[];
  };
}

export interface SettingsCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface SettingField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'password' | 'email' | 'url' | 'time' | 'date';
  value: any;
  description?: string;
  required?: boolean;
  options?: { label: string; value: any }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}