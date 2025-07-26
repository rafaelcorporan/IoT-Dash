import React, { useState, useMemo } from 'react';
import { User, UserPermission, CreateUserRequest } from '../types';
import CustomSelect from './CustomSelect';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldCheck, 
  ShieldX,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@secureiot.com',
    fullName: 'System Administrator',
    role: 'admin',
    status: 'active',
    lastLogin: new Date('2024-01-15T10:30:00'),
    createdAt: new Date('2023-06-01T09:00:00'),
    department: 'IT Operations',
    phoneNumber: '+1-555-0101',
    twoFactorEnabled: true,
    permissions: []
  },
  {
    id: '2',
    username: 'operator1',
    email: 'john.doe@secureiot.com',
    fullName: 'John Doe',
    role: 'operator',
    status: 'active',
    lastLogin: new Date('2024-01-15T14:20:00'),
    createdAt: new Date('2023-08-15T10:00:00'),
    department: 'Operations',
    phoneNumber: '+1-555-0102',
    twoFactorEnabled: true,
    permissions: []
  },
  {
    id: '3',
    username: 'security_analyst',
    email: 'jane.smith@secureiot.com',
    fullName: 'Jane Smith',
    role: 'security_analyst',
    status: 'active',
    lastLogin: new Date('2024-01-15T16:45:00'),
    createdAt: new Date('2023-09-10T11:30:00'),
    department: 'Security',
    phoneNumber: '+1-555-0103',
    twoFactorEnabled: true,
    permissions: []
  },
  {
    id: '4',
    username: 'viewer1',
    email: 'bob.wilson@secureiot.com',
    fullName: 'Bob Wilson',
    role: 'viewer',
    status: 'inactive',
    lastLogin: new Date('2024-01-10T09:15:00'),
    createdAt: new Date('2023-11-20T14:00:00'),
    department: 'Monitoring',
    phoneNumber: '+1-555-0104',
    twoFactorEnabled: false,
    permissions: []
  },
  {
    id: '5',
    username: 'temp_user',
    email: 'temp@secureiot.com',
    fullName: 'Temporary User',
    role: 'viewer',
    status: 'suspended',
    lastLogin: null,
    createdAt: new Date('2024-01-01T12:00:00'),
    department: 'Temp',
    twoFactorEnabled: false,
    permissions: []
  }
];

const roleColors = {
  admin: 'bg-red-500/20 text-red-400 border-red-500/30',
  operator: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  security_analyst: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  viewer: 'bg-green-500/20 text-green-400 border-green-500/30'
};

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  inactive: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  suspended: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleCreateUser = (userData: CreateUserRequest) => {
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      status: 'active',
      lastLogin: null,
      createdAt: new Date(),
      twoFactorEnabled: false,
      permissions: []
    };
    setUsers([...users, newUser]);
    setShowCreateModal(false);
  };

  const handleEditUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'security_analyst': return <ShieldCheck className="w-4 h-4" />;
      case 'operator': return <Users className="w-4 h-4" />;
      case 'viewer': return <Eye className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <Clock className="w-4 h-4" />;
      case 'suspended': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">User Management</h2>
          <p className="text-gray-400">Manage user access and permissions for the SecureIoT platform</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-green-400">{users.filter(u => u.status === 'active').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Admins</p>
              <p className="text-2xl font-bold text-red-400">{users.filter(u => u.role === 'admin').length}</p>
            </div>
            <Shield className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">2FA Enabled</p>
              <p className="text-2xl font-bold text-purple-400">{users.filter(u => u.twoFactorEnabled).length}</p>
            </div>
            <ShieldCheck className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div className="flex gap-4">
            <CustomSelect
              value={roleFilter}
              onChange={(value) => setRoleFilter(value)}
              options={[
                { value: 'all', label: 'All Roles' },
                { value: 'admin', label: 'Admin' },
                { value: 'operator', label: 'Operator' },
                { value: 'security_analyst', label: 'Security Analyst' },
                { value: 'viewer', label: 'Viewer' }
              ]}
              className="min-w-[140px]"
            />
            <CustomSelect
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'suspended', label: 'Suspended' }
              ]}
              className="min-w-[140px]"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">User</th>
                <th className="text-left p-4 text-gray-300 font-medium">Role</th>
                <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                <th className="text-left p-4 text-gray-300 font-medium">Last Login</th>
                <th className="text-left p-4 text-gray-300 font-medium">2FA</th>
                <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-gray-700/50 hover:bg-gray-700/20">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.fullName}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        <p className="text-gray-500 text-xs">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${roleColors[user.role]}`}>
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[user.status]}`}>
                      {getStatusIcon(user.status)}
                      <span className="capitalize">{user.status}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-300 text-sm">{formatDate(user.lastLogin)}</p>
                  </td>
                  <td className="p-4">
                    {user.twoFactorEnabled ? (
                      <ShieldCheck className="w-5 h-5 text-green-400" />
                    ) : (
                      <ShieldX className="w-5 h-5 text-red-400" />
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserDetails(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`p-2 transition-colors rounded-lg ${
                          user.status === 'active' 
                            ? 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10' 
                            : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
                        }`}
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {user.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No users found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateUser}
        />
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSubmit={handleEditUser}
        />
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => {
            setShowUserDetails(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

// Create User Modal Component
const CreateUserModal: React.FC<{
  onClose: () => void;
  onSubmit: (userData: CreateUserRequest) => void;
}> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    email: '',
    fullName: '',
    role: 'viewer',
    department: '',
    phoneNumber: '',
    permissions: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-white mb-4">Create New User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Role</label>
            <CustomSelect
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value as User['role'] })}
              options={[
                { value: 'viewer', label: 'Viewer' },
                { value: 'operator', label: 'Operator' },
                { value: 'security_analyst', label: 'Security Analyst' },
                { value: 'admin', label: 'Admin' }
              ]}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit User Modal Component
const EditUserModal: React.FC<{
  user: User;
  onClose: () => void;
  onSubmit: (user: User) => void;
}> = ({ user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<User>(user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-white mb-4">Edit User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Role</label>
            <CustomSelect
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value as User['role'] })}
              options={[
                { value: 'viewer', label: 'Viewer' },
                { value: 'operator', label: 'Operator' },
                { value: 'security_analyst', label: 'Security Analyst' },
                { value: 'admin', label: 'Admin' }
              ]}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Department</label>
            <input
              type="text"
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="twoFactor"
              checked={formData.twoFactorEnabled}
              onChange={(e) => setFormData({ ...formData, twoFactorEnabled: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="twoFactor" className="text-gray-300 text-sm">Enable Two-Factor Authentication</label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// User Details Modal Component
const UserDetailsModal: React.FC<{
  user: User;
  onClose: () => void;
}> = ({ user, onClose }) => {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">User Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">{user.fullName}</h4>
              <p className="text-gray-400">@{user.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Email</label>
              <div className="flex items-center space-x-2 text-white">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Phone</label>
              <div className="flex items-center space-x-2 text-white">
                <Phone className="w-4 h-4" />
                <span>{user.phoneNumber || 'Not provided'}</span>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Department</label>
              <p className="text-white">{user.department || 'Not assigned'}</p>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Role</label>
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${roleColors[user.role]}`}>
                <span className="capitalize">{user.role.replace('_', ' ')}</span>
              </span>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Status</label>
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[user.status]}`}>
                <span className="capitalize">{user.status}</span>
              </span>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">2FA Status</label>
              <div className="flex items-center space-x-2">
                {user.twoFactorEnabled ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">Enabled</span>
                  </>
                ) : (
                  <>
                    <ShieldX className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm">Disabled</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Account Information</label>
            <div className="bg-gray-700/30 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Created:</span>
                <div className="flex items-center space-x-2 text-white">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(user.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Last Login:</span>
                <div className="flex items-center space-x-2 text-white">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(user.lastLogin)}</span>
                </div>
              </div>
            </div>
          </div>
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

export default UserManagement; 