import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { Icons, SearchInput, EmptyState } from '../../components/ui/Icons';

type QuoteStatus = 'pending' | 'sent' | 'accepted' | 'rejected' | 'expired';

interface Quote {
  id: string;
  quote_number: string;
  project_id: string;
  project_name: string;
  client_name: string;
  client_email: string;
  total: number;
  deposit_amount: number;
  status: QuoteStatus;
  valid_until: string;
  sent_at?: string;
  viewed_at?: string;
  accepted_at?: string;
  created_by: string;
  created_at: string;
}

const mockQuotes: Quote[] = [
  {
    id: '1',
    quote_number: 'QT-2025-001',
    project_id: '1',
    project_name: 'Thompson Garden Renovation',
    client_name: 'James Thompson',
    client_email: 'james.thompson@email.com',
    total: 28500,
    deposit_amount: 8550,
    status: 'accepted',
    valid_until: '2025-01-15',
    sent_at: '2024-12-18',
    viewed_at: '2024-12-18',
    accepted_at: '2024-12-20',
    created_by: 'Sarah Johnson',
    created_at: '2024-12-16',
  },
  {
    id: '2',
    quote_number: 'QT-2025-002',
    project_id: '2',
    project_name: 'Mitchell Patio Installation',
    client_name: 'Sarah Mitchell',
    client_email: 'sarah.mitchell@email.com',
    total: 12800,
    deposit_amount: 3840,
    status: 'sent',
    valid_until: '2025-01-20',
    sent_at: '2024-12-28',
    viewed_at: '2024-12-29',
    created_by: 'Sarah Johnson',
    created_at: '2024-12-27',
  },
  {
    id: '3',
    quote_number: 'QT-2025-003',
    project_id: '4',
    project_name: 'Henderson Complete Garden Design',
    client_name: 'Emily Henderson',
    client_email: 'emily.henderson@email.com',
    total: 65000,
    deposit_amount: 19500,
    status: 'draft',
    valid_until: '2025-02-01',
    created_by: 'Sarah Johnson',
    created_at: '2025-01-02',
  },
  {
    id: '4',
    quote_number: 'QT-2025-004',
    project_id: '6',
    project_name: 'Brown Patio Extension',
    client_name: 'Lisa Brown',
    client_email: 'lisa.brown@email.com',
    total: 8900,
    deposit_amount: 2670,
    status: 'accepted',
    valid_until: '2025-01-10',
    sent_at: '2024-12-20',
    viewed_at: '2024-12-21',
    accepted_at: '2024-12-22',
    created_by: 'Sarah Johnson',
    created_at: '2024-12-19',
  },
  {
    id: '5',
    quote_number: 'QT-2024-089',
    project_id: '7',
    project_name: 'Roberts Lawn Renovation',
    client_name: 'Peter Roberts',
    client_email: 'peter.roberts@email.com',
    total: 5200,
    deposit_amount: 1560,
    status: 'expired',
    valid_until: '2024-12-20',
    sent_at: '2024-12-01',
    created_by: 'Sarah Johnson',
    created_at: '2024-11-28',
  },
  {
    id: '6',
    quote_number: 'QT-2024-088',
    project_id: '8',
    project_name: 'Clarke Driveway',
    client_name: 'Mark Clarke',
    client_email: 'mark.clarke@email.com',
    total: 15600,
    deposit_amount: 4680,
    status: 'rejected',
    valid_until: '2024-12-15',
    sent_at: '2024-11-28',
    viewed_at: '2024-11-29',
    created_by: 'Sarah Johnson',
    created_at: '2024-11-25',
  },
];

const statusConfig: Record<QuoteStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Draft', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  sent: { label: 'Sent', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  viewed: { label: 'Viewed', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  approved: { label: 'Approved', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  accepted: { label: 'Accepted', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  rejected: { label: 'Rejected', color: 'text-red-700', bgColor: 'bg-red-100' },
  expired: { label: 'Expired', color: 'text-amber-700', bgColor: 'bg-amber-100' },
};

const QuotesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const canViewFinancials = user?.role === 'system_owner' || user?.role === 'quantity_surveyor' || user?.role === 'project_manager';

  const filteredQuotes = mockQuotes.filter(quote => {
    const matchesSearch = 
      quote.quote_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.client_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockQuotes.length,
    draft: mockQuotes.filter(q => q.status === 'draft').length,
    pending: mockQuotes.filter(q => ['sent', 'viewed'].includes(q.status)).length,
    accepted: mockQuotes.filter(q => q.status === 'accepted').length,
    totalValue: mockQuotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.total, 0),
    pendingValue: mockQuotes.filter(q => ['sent', 'viewed'].includes(q.status)).reduce((sum, q) => sum + q.total, 0),
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
          <p className="text-gray-500 mt-1">Create and manage project quotes</p>
        </div>
        <Link
          to="/quotes/new"
          className="inline-flex items-center gap-2 bg-sage-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-sage-700 transition-colors shadow-sm"
        >
          <Icons.Plus className="w-5 h-5" />
          New Quote
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-5 text-white shadow-lg shadow-sage-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sage-100 text-sm font-medium">Accepted Value</p>
              <p className="text-2xl font-bold mt-1">£{stats.totalValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Icons.CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Value</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">£{stats.pendingValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
              <Icons.Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Drafts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.draft}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
              <Icons.Edit className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Win Rate</p>
              <p className="text-2xl font-bold text-sage-600 mt-1">67%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-sage-100 to-sage-200 rounded-xl flex items-center justify-center">
              <Icons.TrendingUp className="w-6 h-6 text-sage-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search quotes, projects, clients..."
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 bg-white focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
            >
              <option value="all">All Statuses</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quotes List */}
      {filteredQuotes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <EmptyState
            icon={<Icons.FileText className="w-12 h-12 text-gray-300" />}
            title="No quotes found"
            description="Try adjusting your search or filter criteria"
            action={
              <Link
                to="/quotes/new"
                className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-700 font-medium mt-4"
              >
                <Icons.Plus className="w-4 h-4" />
                Create a new quote
              </Link>
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuotes.map((quote) => {
            const status = statusConfig[quote.status];
            const isExpiringSoon = new Date(quote.valid_until) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && 
                                   !['accepted', 'rejected', 'expired'].includes(quote.status);
            
            return (
              <div key={quote.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-sage-200 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Quote Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${status.bgColor}`}>
                        <Icons.FileText className={`w-5 h-5 ${status.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{quote.quote_number}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                            {status.label}
                          </span>
                          {isExpiringSoon && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              Expiring Soon
                            </span>
                          )}
                        </div>
                        <Link 
                          to={`/projects/${quote.project_id}`}
                          className="text-gray-600 hover:text-sage-600 text-sm transition-colors"
                        >
                          {quote.project_name}
                        </Link>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Icons.User className="w-4 h-4" />
                            {quote.client_name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Icons.Calendar className="w-4 h-4" />
                            Valid until {formatDate(quote.valid_until)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-6">
                    {canViewFinancials && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">£{quote.total.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Deposit: £{quote.deposit_amount.toLocaleString()}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {quote.status === 'draft' && (
                        <>
                          <button className="p-2 hover:bg-sage-100 rounded-lg transition-colors" title="Edit">
                            <Icons.Edit className="w-5 h-5 text-gray-500" />
                          </button>
                          <button className="p-2 hover:bg-sage-100 rounded-lg transition-colors" title="Send">
                            <Icons.Send className="w-5 h-5 text-sage-600" />
                          </button>
                        </>
                      )}
                      {['sent', 'viewed'].includes(quote.status) && (
                        <button className="p-2 hover:bg-sage-100 rounded-lg transition-colors" title="Resend">
                          <Icons.RefreshCw className="w-5 h-5 text-gray-500" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-sage-100 rounded-lg transition-colors" title="Download PDF">
                        <Icons.Download className="w-5 h-5 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-sage-100 rounded-lg transition-colors" title="More">
                        <Icons.MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-6 text-sm flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-gray-500">Created {formatDate(quote.created_at)}</span>
                    </div>
                    {quote.sent_at && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-sage-500"></div>
                        <span className="text-gray-500">Sent {formatDate(quote.sent_at)}</span>
                      </div>
                    )}
                    {quote.viewed_at && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-sage-500"></div>
                        <span className="text-gray-500">Viewed {formatDate(quote.viewed_at)}</span>
                      </div>
                    )}
                    {quote.accepted_at && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-sage-600"></div>
                        <span className="text-gray-500">Accepted {formatDate(quote.accepted_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuotesPage;
