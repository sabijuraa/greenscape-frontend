import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { Card, Icons, SearchInput, EmptyState, Modal } from '../../components/ui/Icons';

type InvoiceStatus = 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'cancelled';
type PaymentType = 'deposit' | 'stage_payment' | 'final_payment' | 'variation';

interface Invoice {
  id: string;
  invoice_number: string;
  project_id: string;
  project_name: string;
  client_name: string;
  client_email: string;
  payment_type: PaymentType;
  description: string;
  amount: number;
  tax_amount: number;
  total: number;
  status: InvoiceStatus;
  due_date: string;
  sent_at?: string;
  paid_at?: string;
  paid_amount: number;
  created_at: string;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoice_number: 'INV-2025-001',
    project_id: '1',
    project_name: 'Thompson Garden Renovation',
    client_name: 'James Thompson',
    client_email: 'james.thompson@email.com',
    payment_type: 'deposit',
    description: '30% Deposit Payment',
    amount: 7125,
    tax_amount: 1425,
    total: 8550,
    status: 'paid',
    due_date: '2024-12-27',
    sent_at: '2024-12-20',
    paid_at: '2024-12-22',
    paid_amount: 8550,
    created_at: '2024-12-20',
  },
  {
    id: '2',
    invoice_number: 'INV-2025-002',
    project_id: '1',
    project_name: 'Thompson Garden Renovation',
    client_name: 'James Thompson',
    client_email: 'james.thompson@email.com',
    payment_type: 'stage_payment',
    description: 'Stage 1 - Groundwork Complete',
    amount: 4750,
    tax_amount: 950,
    total: 5700,
    status: 'paid',
    due_date: '2025-01-05',
    sent_at: '2024-12-30',
    paid_at: '2025-01-02',
    paid_amount: 5700,
    created_at: '2024-12-30',
  },
  {
    id: '3',
    invoice_number: 'INV-2025-003',
    project_id: '1',
    project_name: 'Thompson Garden Renovation',
    client_name: 'James Thompson',
    client_email: 'james.thompson@email.com',
    payment_type: 'stage_payment',
    description: 'Stage 2 - Patio Installation',
    amount: 4750,
    tax_amount: 950,
    total: 5700,
    status: 'sent',
    due_date: '2025-01-15',
    sent_at: '2025-01-03',
    paid_amount: 0,
    created_at: '2025-01-03',
  },
  {
    id: '4',
    invoice_number: 'INV-2025-004',
    project_id: '6',
    project_name: 'Brown Patio Extension',
    client_name: 'Lisa Brown',
    client_email: 'lisa.brown@email.com',
    payment_type: 'deposit',
    description: '30% Deposit Payment',
    amount: 2225,
    tax_amount: 445,
    total: 2670,
    status: 'paid',
    due_date: '2024-12-29',
    sent_at: '2024-12-22',
    paid_at: '2024-12-24',
    paid_amount: 2670,
    created_at: '2024-12-22',
  },
  {
    id: '5',
    invoice_number: 'INV-2024-098',
    project_id: '3',
    project_name: 'Parker Driveway & Landscaping',
    client_name: 'Robert Parker',
    client_email: 'robert.parker@email.com',
    payment_type: 'final_payment',
    description: 'Final Payment - Project Complete',
    amount: 10500,
    tax_amount: 2100,
    total: 12600,
    status: 'overdue',
    due_date: '2024-12-30',
    sent_at: '2024-12-20',
    paid_amount: 0,
    created_at: '2024-12-20',
  },
  {
    id: '6',
    invoice_number: 'INV-2025-005',
    project_id: '4',
    project_name: 'Henderson Complete Garden Design',
    client_name: 'Emily Henderson',
    client_email: 'emily.henderson@email.com',
    payment_type: 'deposit',
    description: '30% Deposit Payment',
    amount: 16250,
    tax_amount: 3250,
    total: 19500,
    status: 'draft',
    due_date: '2025-02-08',
    paid_amount: 0,
    created_at: '2025-01-02',
  },
];

const statusConfig: Record<InvoiceStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Draft', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  sent: { label: 'Sent', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  partial: { label: 'Partial', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  paid: { label: 'Paid', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  overdue: { label: 'Overdue', color: 'text-red-700', bgColor: 'bg-red-100' },
  cancelled: { label: 'Cancelled', color: 'text-gray-500', bgColor: 'bg-gray-100' },
};

const paymentTypeLabels: Record<PaymentType, string> = {
  deposit: 'Deposit',
  stage_payment: 'Stage Payment',
  final_payment: 'Final Payment',
  variation: 'Variation',
};

const InvoicesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const canViewFinancials = user?.role === 'system_owner' || user?.role === 'quantity_surveyor' || user?.role === 'project_manager';

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalPaid: mockInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0),
    outstanding: mockInvoices.filter(i => ['sent', 'partial'].includes(i.status)).reduce((sum, i) => sum + (i.total - i.paid_amount), 0),
    overdue: mockInvoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0),
    draft: mockInvoices.filter(i => i.status === 'draft').length,
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = now.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleRecordPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 mt-1">Manage invoices and track payments</p>
        </div>
        <Link
          to="/invoices/new"
          className="inline-flex items-center gap-2 bg-sage-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-sage-700 transition-colors shadow-sm"
        >
          <Icons.Plus className="w-5 h-5" />
          New Invoice
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-5 text-white shadow-lg shadow-sage-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sage-100 text-sm font-medium">Paid This Month</p>
              <p className="text-2xl font-bold mt-1">£{stats.totalPaid.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Icons.CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Outstanding</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">£{stats.outstanding.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
              <Icons.Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Overdue</p>
              <p className="text-2xl font-bold text-red-600 mt-1">£{stats.overdue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
              <Icons.AlertCircle className="w-6 h-6 text-red-600" />
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
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search invoices, projects, clients..."
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

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <EmptyState
            icon={<Icons.FileText className="w-12 h-12 text-gray-300" />}
            title="No invoices found"
            description="Try adjusting your search or filter criteria"
            action={
              <Link
                to="/invoices/new"
                className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-700 font-medium mt-4"
              >
                <Icons.Plus className="w-4 h-4" />
                Create a new invoice
              </Link>
            }
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project / Client</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                  {canViewFinancials && (
                    <th className="text-right py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  )}
                  <th className="py-4 px-5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredInvoices.map((invoice) => {
                  const status = statusConfig[invoice.status];
                  const daysOverdue = invoice.status === 'overdue' ? getDaysOverdue(invoice.due_date) : 0;
                  
                  return (
                    <tr key={invoice.id} className="hover:bg-sage-50/30 transition-colors">
                      <td className="py-4 px-5">
                        <p className="font-medium text-gray-900">{invoice.invoice_number}</p>
                        <p className="text-sm text-gray-500">{invoice.description}</p>
                      </td>
                      <td className="py-4 px-5">
                        <Link 
                          to={`/projects/${invoice.project_id}`}
                          className="font-medium text-gray-900 hover:text-sage-600 transition-colors"
                        >
                          {invoice.project_name}
                        </Link>
                        <p className="text-sm text-gray-500">{invoice.client_name}</p>
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-gray-700">{paymentTypeLabels[invoice.payment_type]}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                          {status.label}
                        </span>
                        {invoice.status === 'overdue' && (
                          <p className="text-xs text-red-600 mt-1">{daysOverdue} days overdue</p>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`text-sm font-medium ${invoice.status === 'overdue' ? 'text-red-600' : 'text-gray-700'}`}>
                          {formatDate(invoice.due_date)}
                        </span>
                      </td>
                      {canViewFinancials && (
                        <td className="py-4 px-5 text-right">
                          <p className="font-semibold text-gray-900">£{invoice.total.toLocaleString()}</p>
                          {invoice.status === 'partial' && (
                            <p className="text-sm text-sage-600">
                              £{invoice.paid_amount.toLocaleString()} paid
                            </p>
                          )}
                        </td>
                      )}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1 justify-end">
                          {invoice.status === 'draft' && (
                            <>
                              <button className="p-2 hover:bg-sage-100 rounded-lg transition-colors" title="Edit">
                                <Icons.Edit className="w-4 h-4 text-gray-500" />
                              </button>
                              <button className="p-2 hover:bg-sage-100 rounded-lg transition-colors" title="Send">
                                <Icons.Mail className="w-4 h-4 text-sage-600" />
                              </button>
                            </>
                          )}
                          {['sent', 'partial', 'overdue'].includes(invoice.status) && (
                            <button 
                              onClick={() => handleRecordPayment(invoice)}
                              className="p-2 hover:bg-sage-100 rounded-lg transition-colors" 
                              title="Record Payment"
                            >
                              <Icons.Pound className="w-4 h-4 text-sage-600" />
                            </button>
                          )}
                          <button className="p-2 hover:bg-sage-100 rounded-lg transition-colors" title="Download PDF">
                            <Icons.Download className="w-4 h-4 text-gray-500" />
                          </button>
                          <button className="p-2 hover:bg-sage-100 rounded-lg transition-colors" title="More">
                            <Icons.MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      <Modal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        title="Record Payment"
      >
        {selectedInvoice && (
          <form className="space-y-5">
            <div className="p-4 bg-sage-50 rounded-xl border border-sage-100">
              <p className="text-sm text-gray-500">Invoice</p>
              <p className="font-medium text-gray-900">{selectedInvoice.invoice_number}</p>
              <p className="text-sm text-gray-500 mt-1">{selectedInvoice.project_name}</p>
              <div className="mt-3 pt-3 border-t border-sage-200">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Amount</span>
                  <span className="font-medium">£{selectedInvoice.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-500">Already Paid</span>
                  <span className="font-medium text-sage-600">£{selectedInvoice.paid_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-700 font-medium">Outstanding</span>
                  <span className="font-semibold text-amber-600">
                    £{(selectedInvoice.total - selectedInvoice.paid_amount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                <input 
                  type="number" 
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
                  placeholder="0.00"
                  defaultValue={selectedInvoice.total - selectedInvoice.paid_amount}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Method</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors">
                <option value="bank_transfer">Bank Transfer</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Date</label>
              <input 
                type="date" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
                defaultValue={new Date().toISOString().split('T')[0]} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reference (optional)</label>
              <input 
                type="text" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
                placeholder="e.g. Bank reference number" 
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
              <button 
                type="button" 
                onClick={() => setShowPaymentModal(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2.5 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700 transition-colors shadow-sm"
              >
                Record Payment
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default InvoicesPage;
