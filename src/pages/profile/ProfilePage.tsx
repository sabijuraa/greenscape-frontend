import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { Card, Icons, Avatar } from '../../components/ui/Icons';
import { UserRole } from '../../types';

const roleLabels: Record<UserRole, string> = {
  system_owner: 'Business Owner',
  sales_admin: 'Sales Administrator',
  quantity_surveyor: 'Quantity Surveyor',
  designer: 'Designer',
  project_manager: 'Project Manager',
  worker: 'Worker',
};

const roleDescriptions: Record<UserRole, string> = {
  system_owner: 'Full system access including financials, team management, and all operations',
  sales_admin: 'Client management, enquiries, social media, and documentation',
  quantity_surveyor: 'Site visits, measurements, quotes, and client pricing',
  designer: 'Design creation, material selection, and client presentations',
  project_manager: 'Project stages, task assignment, quality control, and team coordination',
  worker: 'Task completion, material requests, and on-site work',
};

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  // Mock additional profile data
  const profileStats = {
    projects_completed: 24,
    tasks_completed: 156,
    member_since: '2024-01-15',
  };

  const recentActivity = [
    { action: 'Completed task', detail: 'Lay patio foundation', project: 'Thompson Garden', time: '2 hours ago' },
    { action: 'Started task', detail: 'Install edging stones', project: 'Thompson Garden', time: '5 hours ago' },
    { action: 'Requested materials', detail: '5 bags cement', project: 'Brown Patio', time: 'Yesterday' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          <p className="text-gray-500 mt-1">View and manage your profile information</p>
        </div>
        <Link
          to="/profile/edit"
          className="inline-flex items-center gap-2 bg-sage-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-sage-700 transition-colors"
        >
          <Icons.Edit className="w-5 h-5" />
          Edit Profile
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <Avatar name={user.full_name} size="xl" />
              <h2 className="text-xl font-semibold text-gray-900 mt-4">{user.full_name}</h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-sage-100 text-sage-700 mt-2">
                {roleLabels[user.role]}
              </span>
              <p className="text-sm text-gray-500 mt-4 max-w-xs">
                {roleDescriptions[user.role]}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{profileStats.projects_completed}</p>
                  <p className="text-sm text-gray-500">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{profileStats.tasks_completed}</p>
                  <p className="text-sm text-gray-500">Tasks</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Member since {new Date(profileStats.member_since).toLocaleDateString('en-GB', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </Card>
        </div>

        {/* Details & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icons.Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icons.Phone className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{user.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Account Status */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
            <div className="flex items-center justify-between p-4 bg-sage-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-sage-500 rounded-full" />
                <span className="font-medium text-sage-700">Active</span>
              </div>
              <span className="text-sm text-sage-600">Your account is in good standing</span>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icons.Clock className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">
                      {activity.detail} • {activity.project}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400 flex-shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Permissions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Permissions</h3>
            <div className="grid grid-cols-2 gap-3">
              {getPermissionsForRole(user.role).map((permission, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Icons.Check className="w-4 h-4 text-sage-500" />
                  <span className="text-gray-700">{permission}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

function getPermissionsForRole(role: UserRole): string[] {
  const permissions: Record<UserRole, string[]> = {
    system_owner: [
      'View all projects',
      'View profit & costs',
      'Manage team members',
      'Approve discounts',
      'Delete projects',
      'System settings',
      'Generate reports',
      'Override permissions',
    ],
    sales_admin: [
      'Handle enquiries',
      'Upload documents',
      'Manage social media',
      'Create projects',
      'View pricing',
    ],
    quantity_surveyor: [
      'Conduct site visits',
      'Create quotes',
      'View costs',
      'Create projects',
      'Request payments',
      'Upload photos',
    ],
    designer: [
      'Create designs',
      'Select materials',
      'Upload designs',
      'View assigned projects',
    ],
    project_manager: [
      'Manage project stages',
      'Assign tasks',
      'View costs',
      'Approve materials',
      'Manage quality',
      'Request sign-off',
    ],
    worker: [
      'View assigned tasks',
      'Complete tasks',
      'Request materials',
      'Upload photos',
    ],
  };
  
  return permissions[role] || [];
}

export default ProfilePage;
