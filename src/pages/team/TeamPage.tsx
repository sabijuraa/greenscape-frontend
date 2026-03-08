import React, { useState } from 'react';
import { Card, Icons, SearchInput, Avatar, Modal, EmptyState } from '../../components/ui/Icons';

const mockTeam = [
  { id: '1', full_name: 'John Smith', email: 'john@greenscape.com', phone: '+44 7700 900001', role: 'worker', is_active: true, projects_count: 5, tasks_completed: 47 },
  { id: '2', full_name: 'Sarah Williams', email: 'sarah@greenscape.com', phone: '+44 7700 900002', role: 'project_manager', is_active: true, projects_count: 8, tasks_completed: 0 },
  { id: '3', full_name: 'Mike Johnson', email: 'mike@greenscape.com', phone: '+44 7700 900003', role: 'worker', is_active: true, projects_count: 4, tasks_completed: 32 },
  { id: '4', full_name: 'Emma Davis', email: 'emma@greenscape.com', phone: '+44 7700 900004', role: 'quantity_surveyor', is_active: true, projects_count: 12, tasks_completed: 0 },
  { id: '5', full_name: 'Tom Brown', email: 'tom@greenscape.com', phone: '+44 7700 900005', role: 'designer', is_active: true, projects_count: 6, tasks_completed: 0 },
];

const roleConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  system_owner: { label: 'Owner', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  sales_admin: { label: 'Sales Admin', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  quantity_surveyor: { label: 'QS', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  designer: { label: 'Designer', color: 'text-pink-700', bgColor: 'bg-pink-100' },
  project_manager: { label: 'PM', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  worker: { label: 'Worker', color: 'text-gray-700', bgColor: 'bg-gray-100' },
};

const TeamPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredTeam = mockTeam.filter(member =>
    member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-500 mt-1">{mockTeam.length} team members</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 bg-sage-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-sage-700">
          <Icons.Plus className="w-5 h-5" />
          Add Team Member
        </button>
      </div>

      <Card>
        <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search team members..." />
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeam.map(member => {
          const role = roleConfig[member.role] || roleConfig.worker;
          return (
            <Card key={member.id}>
              <div className="flex items-start gap-4">
                <Avatar name={member.full_name} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{member.full_name}</h3>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${role.bgColor} ${role.color}`}>{role.label}</span>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Icons.Mail className="w-4 h-4" /><span className="truncate">{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Icons.Phone className="w-4 h-4" /><span>{member.phone}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500">Projects: <span className="font-medium text-gray-900">{member.projects_count}</span></span>
                <button className="p-2 hover:bg-gray-100 rounded-lg"><Icons.MoreVertical className="w-4 h-4 text-gray-400" /></button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Team Member">
        <form className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" className="input" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className="input" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select className="input">
              {Object.entries(roleConfig).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-sage-600 text-white rounded-lg">Add Member</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeamPage;
