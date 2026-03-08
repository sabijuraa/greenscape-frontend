import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Icons } from '../../components/ui/Icons';
import { projectAPI, invoiceAPI } from '../../services/api';
import type { Project } from '../../types';

type PaymentType = 'deposit' | 'progress' | 'final' | 'full';

interface InvoiceFormData {
  project_id: string;
  payment_type: PaymentType;
  amount: string;
  due_days: string;
  notes: string;
}

const NewInvoicePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof InvoiceFormData, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const [formData, setFormData] = useState<InvoiceFormData>({
    project_id: '',
    payment_type: 'deposit',
    amount: '',
    due_days: '14',
    notes: '',
  });

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectAPI.list();
        // Filter to only show projects that can have invoices
        const eligibleProjects = data.filter((p: Project) => 
          ['quote_accepted', 'in_progress', 'completed'].includes(p.status)
        );
        setProjects(eligibleProjects);
      } catch (error: any) {
        console.error('Failed to fetch projects:', error);
        setApiError(error.message || 'Failed to load projects');
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const selectedProject = projects.find(p => p.id === formData.project_id);

  // Calculate VAT and totals (UK 20%)
  const calculateTotals = () => {
    const amount = parseFloat(formData.amount) || 0;
    const vatRate = 20; // UK VAT
    const vatAmount = amount * (vatRate / 100);
    const total = amount + vatAmount;
    return { amount, vatRate, vatAmount, total };
  };

  const totals = calculateTotals();

  const updateField = (field: keyof InvoiceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    setApiError(null);

    // Auto-generate notes based on payment type
    if (field === 'payment_type') {
      const descriptions: Record<PaymentType, string> = {
        deposit: '30% Deposit Payment',
        stage_payment: 'Stage Payment',
        final_payment: 'Final Payment - Project Complete',
        variation: 'Additional Works / Variation',
      };
      setFormData(prev => ({ ...prev, notes: descriptions[value as PaymentType] || '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof InvoiceFormData, string>> = {};

    if (!formData.project_id) {
      newErrors.project_id = 'Please select a project';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, sendImmediately: boolean = false) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);
    
    try {
      // Create invoice via API
      const invoice = await invoiceAPI.create({
        project_id: formData.project_id,
        payment_type: formData.payment_type,
        amount: parseFloat(formData.amount),
        due_days: parseInt(formData.due_days),
        notes: formData.notes || undefined,
      });

      // If send immediately, call the send endpoint
      if (sendImmediately && invoice.id) {
        await invoiceAPI.send(invoice.id);
      }

      navigate('/invoices');
    } catch (error: any) {
      console.error('Failed to create invoice:', error);
      setApiError(error.message || 'Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentTypes: { value: PaymentType; label: string; description: string }[] = [
    { value: 'deposit', label: 'Deposit', description: 'Initial payment (typically 30%)' },
    { value: 'stage_payment', label: 'Stage Payment', description: 'Payment for completed work stage' },
    { value: 'final_payment', label: 'Final Payment', description: 'Remaining balance on completion' },
    { value: 'variation', label: 'Variation', description: 'Extra work not in original quote' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/invoices"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icons.ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
          <p className="text-gray-500 mt-1">Generate an invoice for a project</p>
        </div>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <Icons.AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600">{apiError}</p>
          </div>
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {/* Project Selection */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Project</h2>
          {isLoadingProjects ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-sage-200 border-t-sage-600"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <Icons.Folder className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No eligible projects found</p>
              <p className="text-sm text-gray-400 mt-1">Projects must be approved or in progress</p>
            </div>
          ) : (
            <>
              <select
                value={formData.project_id}
                onChange={(e) => updateField('project_id', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 ${errors.project_id ? 'border-red-300' : 'border-gray-200'}`}
              >
                <option value="">Choose a project...</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name} - {project.client_name}
                  </option>
                ))}
              </select>
              {errors.project_id && <p className="text-sm text-red-600 mt-1">{errors.project_id}</p>}

              {selectedProject && (
                <div className="mt-4 p-4 bg-sage-50 rounded-xl border border-sage-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sage-200 rounded-lg flex items-center justify-center">
                      <Icons.Folder className="w-6 h-6 text-sage-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selectedProject.name}</p>
                      <p className="text-sm text-gray-600">{selectedProject.client_name}</p>
                      {selectedProject.client_email && (
                        <p className="text-sm text-gray-500">{selectedProject.client_email}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

        {/* Payment Type */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Type</h2>
          <div className="grid grid-cols-2 gap-3">
            {paymentTypes.map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => updateField('payment_type', type.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  formData.payment_type === type.value
                    ? 'border-sage-500 bg-sage-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className={`font-semibold ${formData.payment_type === type.value ? 'text-sage-700' : 'text-gray-900'}`}>
                  {type.label}
                </p>
                <p className="text-sm text-gray-500 mt-1">{type.description}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Invoice Details */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes / Description
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                placeholder="e.g., 30% Deposit Payment"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (excl. VAT) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">£</span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => updateField('amount', e.target.value)}
                    className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 ${errors.amount ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms (days)
                </label>
                <select
                  value={formData.due_days}
                  onChange={(e) => updateField('due_days', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                >
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="21">21 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Summary */}
        <Card className="bg-gradient-to-br from-sage-50 to-sage-100 border-sage-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">£{totals.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>VAT ({totals.vatRate}%)</span>
              <span className="font-medium">£{totals.vatAmount.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-sage-200 flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-sage-700">£{totals.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Link
            to="/invoices"
            className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 border border-sage-300 bg-sage-50 text-sage-700 rounded-xl font-medium hover:bg-sage-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-sage-300 border-t-sage-600"></div>
            ) : (
              <>
                <Icons.FileText className="w-5 h-5" />
                Save as Draft
              </>
            )}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700 transition-colors disabled:bg-sage-300 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
            ) : (
              <>
                <Icons.Mail className="w-5 h-5" />
                Create & Send
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewInvoicePage;
