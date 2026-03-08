import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../context/authStore';
import { Icons, Avatar, Modal } from '../../components/ui/Icons';

const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'notifications' | 'security'>('profile');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [notifications, setNotifications] = useState({
    new_task: true,
    task_due: true,
    project_update: true,
    quote_status: true,
    payment: true,
    push_urgent: false,
    push_messages: true,
  });

  const canManageSettings = user?.role === 'system_owner';

  const [companyData, setCompanyData] = useState({
    name: 'GreenScape Landscaping Ltd',
    email: 'info@greenscape.com',
    phone: '020 7123 4567',
    address: '123 Garden Way, Richmond, Surrey',
    postcode: 'TW9 1AB',
    vatNumber: 'GB123456789',
    companyNumber: '12345678',
    website: 'www.greenscape.com',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      if (updateProfile) {
        await updateProfile({
          full_name: profileData.full_name,
          phone: profileData.phone,
        });
      }
      setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage({ type: 'success', text: 'Company information updated successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to update company information.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setSaveMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (passwordData.new_password.length < 8) {
      setSaveMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowPasswordModal(false);
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setSaveMessage({ type: 'success', text: 'Password updated successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to update password.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = (key: string) => {
    setNotifications({ ...notifications, [key]: !notifications[key as keyof typeof notifications] });
  };

  const handleNotificationSubmit = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSaveMessage({ type: 'success', text: 'Notification preferences saved!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to save preferences.' });
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleDisplay = (role?: string) => {
    const roleMap: Record<string, string> = {
      system_owner: 'System Owner',
      project_manager: 'Project Manager',
      quantity_surveyor: 'Quantity Surveyor',
      sales_admin: 'Sales Admin',
      designer: 'Designer',
      site_worker: 'Site Worker',
      worker: 'Worker',
    };
    return roleMap[role || ''] || role;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and system preferences</p>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          saveMessage.type === 'success' 
            ? 'bg-sage-50 border border-sage-200 text-sage-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {saveMessage.type === 'success' ? (
            <Icons.CheckCircle className="w-5 h-5" />
          ) : (
            <Icons.AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{saveMessage.text}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === 'profile' ? 'bg-sage-100 text-sage-700 font-medium' : 'text-gray-700 hover:bg-sage-50'
                }`}
              >
                <Icons.User className="w-5 h-5" />
                Profile
              </button>
              {canManageSettings && (
                <button
                  onClick={() => setActiveTab('company')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === 'company' ? 'bg-sage-100 text-sage-700 font-medium' : 'text-gray-700 hover:bg-sage-50'
                  }`}
                >
                  <Icons.Building className="w-5 h-5" />
                  Company
                </button>
              )}
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === 'notifications' ? 'bg-sage-100 text-sage-700 font-medium' : 'text-gray-700 hover:bg-sage-50'
                }`}
              >
                <Icons.Bell className="w-5 h-5" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === 'security' ? 'bg-sage-100 text-sage-700 font-medium' : 'text-gray-700 hover:bg-sage-50'
                }`}
              >
                <Icons.Shield className="w-5 h-5" />
                Security
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h2>
              
              {/* Profile Header with Avatar */}
              <div className="flex items-center gap-6 mb-8 p-6 bg-sage-50 rounded-xl border border-sage-100">
                <Avatar name={user?.full_name || ''} size="xl" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{user?.full_name}</h3>
                  <p className="text-gray-500">{user?.email}</p>
                  <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-sm font-medium bg-sage-100 text-sage-700">
                    {getRoleDisplay(user?.role)}
                  </span>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      name="full_name"
                      value={profileData.full_name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
                      placeholder="Enter phone number" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500" 
                      value={getRoleDisplay(user?.role)} 
                      disabled 
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Company Settings */}
          {activeTab === 'company' && canManageSettings && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Company Information</h2>
              
              <form onSubmit={handleCompanySubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                    <input 
                      type="text" 
                      value={companyData.name}
                      onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input 
                      type="email" 
                      value={companyData.email}
                      onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input 
                      type="tel" 
                      value={companyData.phone}
                      onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
                    <input 
                      type="url" 
                      value={companyData.website}
                      onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                  <input 
                    type="text" 
                    value={companyData.address}
                    onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Postcode</label>
                    <input 
                      type="text" 
                      value={companyData.postcode}
                      onChange={(e) => setCompanyData({ ...companyData, postcode: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">VAT Number</label>
                    <input 
                      type="text" 
                      value={companyData.vatNumber}
                      onChange={(e) => setCompanyData({ ...companyData, vatNumber: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Number</label>
                    <input 
                      type="text" 
                      value={companyData.companyNumber}
                      onChange={(e) => setCompanyData({ ...companyData, companyNumber: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'new_task', label: 'New task assigned', description: 'Get notified when a task is assigned to you' },
                      { id: 'task_due', label: 'Task due reminders', description: 'Receive reminders before tasks are due' },
                      { id: 'project_update', label: 'Project updates', description: 'Get notified about project status changes' },
                      { id: 'quote_status', label: 'Quote status changes', description: 'Know when quotes are viewed or accepted' },
                      { id: 'payment', label: 'Payment received', description: 'Get notified when payments are recorded' },
                    ].map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-sage-50 rounded-xl border border-sage-100">
                        <div>
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notifications[item.id as keyof typeof notifications]}
                            onChange={() => handleNotificationChange(item.id)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">Push Notifications</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'push_urgent', label: 'Urgent tasks only', description: 'Only receive push notifications for urgent items' },
                      { id: 'push_messages', label: 'Direct messages', description: 'Get notified about new messages' },
                    ].map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-sage-50 rounded-xl border border-sage-100">
                        <div>
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notifications[item.id as keyof typeof notifications]}
                            onChange={() => handleNotificationChange(item.id)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button 
                    onClick={handleNotificationSubmit}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {isSaving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Password</h2>
                <p className="text-gray-500 mb-4">Change your password to keep your account secure.</p>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="px-5 py-2.5 border border-sage-600 text-sage-600 rounded-xl font-medium hover:bg-sage-50 transition-colors"
                >
                  Change Password
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h2>
                <div className="flex items-center justify-between p-4 bg-sage-50 rounded-xl border border-sage-100">
                  <div>
                    <p className="font-medium text-gray-900">Two-factor authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <button className="px-4 py-2 border border-sage-600 text-sage-600 rounded-xl font-medium hover:bg-sage-100 transition-colors">
                    Enable
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-sage-50 rounded-xl border border-sage-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-sage-200 rounded-lg flex items-center justify-center">
                        <Icons.Monitor className="w-5 h-5 text-sage-700" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Chrome on Windows</p>
                        <p className="text-sm text-gray-500">London, UK - Current session</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-sage-100 text-sage-700 text-xs font-medium rounded-full">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Icons.Phone className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Safari on iPhone</p>
                        <p className="text-sm text-gray-500">London, UK - 2 days ago</p>
                      </div>
                    </div>
                    <button className="text-sm text-red-600 hover:text-red-700 font-medium">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Password">
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
            <input 
              type="password" 
              value={passwordData.current_password}
              onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
              placeholder="Enter current password" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <input 
              type="password" 
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
              placeholder="Enter new password" 
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <input 
              type="password" 
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
              placeholder="Confirm new password" 
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => setShowPasswordModal(false)}
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {isSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SettingsPage;
