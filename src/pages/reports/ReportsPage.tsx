import React, { useState } from 'react';
import { Icons } from '../../components/ui/Icons';

const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('month');

  const stats = {
    revenue: 485600,
    profit: 145680,
    projects: 24,
    quotes: 42,
    conversionRate: 68,
  };

  const projectsByStatus = [
    { status: 'Completed', count: 12, color: 'bg-sage-500' },
    { status: 'In Progress', count: 8, color: 'bg-sage-400' },
    { status: 'Quoted', count: 4, color: 'bg-amber-500' },
  ];

  const topClients = [
    { name: 'James Thompson', revenue: 28500, projects: 3 },
    { name: 'Sarah Mitchell', revenue: 22000, projects: 2 },
    { name: 'Robert Parker', revenue: 18500, projects: 2 },
    { name: 'Emma Wilson', revenue: 15200, projects: 1 },
  ];

  const monthlyRevenue = [
    { month: 'Aug', amount: 38000 },
    { month: 'Sep', amount: 42000 },
    { month: 'Oct', amount: 55000 },
    { month: 'Nov', amount: 48000 },
    { month: 'Dec', amount: 62000 },
    { month: 'Jan', amount: 45000 },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.amount));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Business performance overview</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)} 
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 bg-white focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
            <Icons.Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-5 text-white shadow-lg shadow-sage-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sage-100 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">£{stats.revenue.toLocaleString()}</p>
              <p className="text-sage-200 text-sm mt-1 flex items-center gap-1">
                <Icons.TrendingUp className="w-4 h-4" /> +12% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Icons.Pound className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Net Profit</p>
              <p className="text-2xl font-bold text-sage-600 mt-1">£{stats.profit.toLocaleString()}</p>
              <p className="text-sage-600 text-sm mt-1 flex items-center gap-1">
                <Icons.TrendingUp className="w-4 h-4" /> +8% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-sage-100 to-sage-200 rounded-xl flex items-center justify-center">
              <Icons.BarChart className="w-6 h-6 text-sage-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Projects Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.projects}</p>
              <p className="text-gray-500 text-sm mt-1">This period</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-sage-100 to-sage-200 rounded-xl flex items-center justify-center">
              <Icons.Folder className="w-6 h-6 text-sage-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Quote Conversion</p>
              <p className="text-2xl font-bold text-sage-600 mt-1">{stats.conversionRate}%</p>
              <p className="text-sage-600 text-sm mt-1 flex items-center gap-1">
                <Icons.TrendingUp className="w-4 h-4" /> +5% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-sage-100 to-sage-200 rounded-xl flex items-center justify-center">
              <Icons.FileText className="w-6 h-6 text-sage-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Projects by Status */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Projects by Status</h2>
          <div className="space-y-5">
            {projectsByStatus.map(item => (
              <div key={item.status}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">{item.status}</span>
                  <span className="font-semibold text-gray-900">{item.count}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-500`} 
                    style={{ width: `${(item.count / 24) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Projects</span>
              <span className="font-semibold text-gray-900">24</span>
            </div>
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Clients</h2>
          <div className="space-y-3">
            {topClients.map((client, i) => (
              <div key={client.name} className="flex items-center gap-4 p-4 bg-sage-50 rounded-xl border border-sage-100">
                <div className="w-10 h-10 bg-sage-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{client.name}</p>
                  <p className="text-sm text-gray-500">{client.projects} projects</p>
                </div>
                <p className="font-bold text-sage-700">£{client.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h2>
        <div className="h-64">
          <div className="flex items-end justify-between h-full gap-4 px-4">
            {monthlyRevenue.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center justify-end h-48">
                  <p className="text-sm font-semibold text-sage-700 mb-2">
                    £{(month.amount / 1000).toFixed(0)}k
                  </p>
                  <div 
                    className="w-full bg-gradient-to-t from-sage-600 to-sage-400 rounded-t-lg transition-all duration-500 hover:from-sage-700 hover:to-sage-500"
                    style={{ height: `${(month.amount / maxRevenue) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3 font-medium">{month.month}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
              <Icons.Calendar className="w-5 h-5 text-sage-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Project Duration</p>
              <p className="font-bold text-gray-900">18 days</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
              <Icons.Pound className="w-5 h-5 text-sage-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Project Value</p>
              <p className="font-bold text-gray-900">£12,400</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
              <Icons.Users className="w-5 h-5 text-sage-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">New Clients</p>
              <p className="font-bold text-gray-900">8 this month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
              <Icons.Star className="w-5 h-5 text-sage-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Client Satisfaction</p>
              <p className="font-bold text-gray-900">4.8 / 5.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
