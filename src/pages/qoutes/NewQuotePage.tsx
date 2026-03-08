import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Icons } from '../../components/ui/Icons';

interface QuoteItem {
  id: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
}

interface QuoteFormData {
  project_id: string;
  items: QuoteItem[];
  discount_percentage: string;
  discount_reason: string;
  deposit_percentage: string;
  payment_terms: string;
  notes: string;
  valid_days: string;
}

const mockProjects = [
  { id: '1', name: 'Thompson Garden Renovation', client: 'James Thompson', area_sqm: 120 },
  { id: '2', name: 'Mitchell Patio Installation', client: 'Sarah Mitchell', area_sqm: 45 },
  { id: '3', name: 'Wilson Garden Design', client: 'Emma Wilson', area_sqm: 200 },
];

const NewQuotePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);

  const [formData, setFormData] = useState<QuoteFormData>({
    project_id: '',
    items: [],
    discount_percentage: '0',
    discount_reason: '',
    deposit_percentage: '30',
    payment_terms: 'stage',
    notes: '',
    valid_days: '30',
  });

  const [newItem, setNewItem] = useState({
    description: '',
    category: '',
    quantity: '1',
    unit: 'sqm',
    unit_price: '',
  });

  const selectedProject = mockProjects.find(p => p.id === formData.project_id);

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = subtotal * (parseFloat(formData.discount_percentage) || 0) / 100;
    const preVat = subtotal - discountAmount;
    const vatAmount = preVat * 0.2;
    const total = preVat + vatAmount;
    const depositAmount = total * (parseFloat(formData.deposit_percentage) || 30) / 100;
    
    return { subtotal, discountAmount, preVat, vatAmount, total, depositAmount };
  };

  const totals = calculateTotals();

  const addItem = () => {
    if (!newItem.description || !newItem.unit_price) return;

    const quantity = parseFloat(newItem.quantity) || 1;
    const unitPrice = parseFloat(newItem.unit_price) || 0;

    const item: QuoteItem = {
      id: Date.now().toString(),
      description: newItem.description,
      category: newItem.category,
      quantity,
      unit: newItem.unit,
      unit_price: unitPrice,
      total: quantity * unitPrice,
    };

    setFormData(prev => ({ ...prev, items: [...prev.items, item] }));
    setNewItem({ description: '', category: '', quantity: '1', unit: 'sqm', unit_price: '' });
    setShowAddItem(false);
  };

  const removeItem = (id: string) => {
    setFormData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/quotes');
    } catch (error) {
      console.error('Failed to create quote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/quotes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Icons.ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Quote</h1>
          <p className="text-gray-500 mt-1">Generate a quote for a project</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Project</h2>
          <select
            value={formData.project_id}
            onChange={(e) => setFormData(prev => ({ ...prev, project_id: e.target.value }))}
            className="input"
          >
            <option value="">Choose a project...</option>
            {mockProjects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name} - {project.client} ({project.area_sqm} sqm)
              </option>
            ))}
          </select>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quote Items</h2>
            <button
              type="button"
              onClick={() => setShowAddItem(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-sage-100 text-sage-700 rounded-lg text-sm font-medium hover:bg-sage-200"
            >
              <Icons.Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {formData.items.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <Icons.FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No items added yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {formData.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.description}</p>
                  </div>
                  <p className="text-gray-500">{item.quantity} {item.unit} × £{item.unit_price}</p>
                  <p className="font-semibold text-gray-900">£{item.total.toLocaleString()}</p>
                  <button type="button" onClick={() => removeItem(item.id)} className="p-1 hover:bg-red-100 rounded text-red-500">
                    <Icons.X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {showAddItem && (
            <div className="mt-4 p-4 border-2 border-dashed border-gray-200 rounded-xl">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-2">
                  <input type="text" value={newItem.description} onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))} className="input" placeholder="Description" />
                </div>
                <input type="number" value={newItem.quantity} onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))} className="input" placeholder="Qty" />
                <input type="number" value={newItem.unit_price} onChange={(e) => setNewItem(prev => ({ ...prev, unit_price: e.target.value }))} className="input" placeholder="£ Price" />
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={() => setShowAddItem(false)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
                <button type="button" onClick={addItem} className="px-3 py-1.5 bg-sage-600 text-white rounded-lg text-sm">Add</button>
              </div>
            </div>
          )}
        </Card>

        <Card className="bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>£{totals.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>VAT (20%)</span><span>£{totals.vatAmount.toLocaleString()}</span></div>
            <div className="pt-3 border-t flex justify-between text-lg font-bold"><span>Total</span><span>£{totals.total.toLocaleString()}</span></div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link to="/quotes" className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50">Cancel</Link>
          <button type="submit" disabled={isSubmitting || formData.items.length === 0} className="px-6 py-2.5 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700 disabled:bg-sage-300">
            {isSubmitting ? 'Creating...' : 'Create Quote'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewQuotePage;
