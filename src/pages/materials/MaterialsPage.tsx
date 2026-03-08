import React, { useState } from 'react';
import { useAuthStore } from '../../context/authStore';
import { Card, Icons, SearchInput, EmptyState, Modal } from '../../components/ui/Icons';

interface Material {
  id: string;
  name: string;
  category: string;
  unit: string;
  qty_per_sqm: number;
  base_price: number;
  supplier_name?: string;
  is_active: boolean;
  stock_level?: number;
  reorder_point?: number;
}

interface MaterialRequest {
  id: string;
  project_name: string;
  material_name: string;
  quantity: number;
  unit: string;
  urgency: 'normal' | 'urgent' | 'critical';
  status: 'pending' | 'approved' | 'ordered' | 'delivered' | 'rejected';
  requested_by: string;
  requested_at: string;
}

const mockMaterials: Material[] = [
  { id: '1', name: 'Indian Sandstone Paving', category: 'Paving', unit: 'sqm', qty_per_sqm: 1, base_price: 45, supplier_name: 'Stone Supplies UK', is_active: true, stock_level: 150, reorder_point: 50 },
  { id: '2', name: 'Porcelain Paving 600x600', category: 'Paving', unit: 'sqm', qty_per_sqm: 1, base_price: 65, supplier_name: 'Premium Tiles Ltd', is_active: true, stock_level: 80, reorder_point: 30 },
  { id: '3', name: 'Block Paving - Charcoal', category: 'Paving', unit: 'sqm', qty_per_sqm: 50, base_price: 28, supplier_name: 'Marshalls', is_active: true, stock_level: 200, reorder_point: 100 },
  { id: '4', name: 'Sharp Sand', category: 'Aggregates', unit: 'tonne', qty_per_sqm: 0.05, base_price: 45, supplier_name: 'Local Aggregates', is_active: true, stock_level: 25, reorder_point: 10 },
  { id: '5', name: 'Building Sand', category: 'Aggregates', unit: 'tonne', qty_per_sqm: 0.03, base_price: 42, supplier_name: 'Local Aggregates', is_active: true, stock_level: 30, reorder_point: 10 },
  { id: '6', name: 'MOT Type 1', category: 'Aggregates', unit: 'tonne', qty_per_sqm: 0.15, base_price: 35, supplier_name: 'Local Aggregates', is_active: true, stock_level: 45, reorder_point: 20 },
  { id: '7', name: 'Cement (25kg bags)', category: 'Cement & Concrete', unit: 'bag', qty_per_sqm: 0.5, base_price: 6.50, supplier_name: 'Builders Merchant', is_active: true, stock_level: 100, reorder_point: 50 },
  { id: '8', name: 'Premium Topsoil', category: 'Soil & Turf', unit: 'tonne', qty_per_sqm: 0.1, base_price: 55, supplier_name: 'Garden Supplies', is_active: true, stock_level: 20, reorder_point: 10 },
  { id: '9', name: 'Turf Rolls', category: 'Soil & Turf', unit: 'sqm', qty_per_sqm: 1.05, base_price: 4.50, supplier_name: 'Turf Direct', is_active: true, stock_level: 500, reorder_point: 200 },
  { id: '10', name: 'Sleepers - New Oak', category: 'Timber', unit: 'each', qty_per_sqm: 0, base_price: 45, supplier_name: 'Timber World', is_active: true, stock_level: 30, reorder_point: 15 },
  { id: '11', name: 'Fence Panels 6x6', category: 'Timber', unit: 'each', qty_per_sqm: 0, base_price: 38, supplier_name: 'Fencing Direct', is_active: true, stock_level: 25, reorder_point: 10 },
  { id: '12', name: 'Granite Edging', category: 'Edging', unit: 'meter', qty_per_sqm: 0, base_price: 18, supplier_name: 'Stone Supplies UK', is_active: true, stock_level: 100, reorder_point: 40 },
];

const mockRequests: MaterialRequest[] = [
  { id: '1', project_name: 'Thompson Garden Renovation', material_name: 'Indian Sandstone Paving', quantity: 25, unit: 'sqm', urgency: 'normal', status: 'approved', requested_by: 'John Smith', requested_at: '2025-01-02' },
  { id: '2', project_name: 'Thompson Garden Renovation', material_name: 'Premium Topsoil', quantity: 5, unit: 'tonne', urgency: 'urgent', status: 'pending', requested_by: 'Mike Johnson', requested_at: '2025-01-03' },
  { id: '3', project_name: 'Brown Patio Extension', material_name: 'Porcelain Paving 600x600', quantity: 35, unit: 'sqm', urgency: 'normal', status: 'ordered', requested_by: 'John Smith', requested_at: '2025-01-01' },
  { id: '4', project_name: 'Henderson Complete Garden Design', material_name: 'Fence Panels 6x6', quantity: 12, unit: 'each', urgency: 'normal', status: 'pending', requested_by: 'Emma Wilson', requested_at: '2025-01-02' },
];

const categories = ['All', 'Paving', 'Aggregates', 'Cement & Concrete', 'Soil & Turf', 'Timber', 'Edging'];

const urgencyConfig = {
  normal: { label: 'Normal', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  urgent: { label: 'Urgent', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  critical: { label: 'Critical', color: 'text-red-700', bgColor: 'bg-red-100' },
};

const statusConfig = {
  pending: { label: 'Pending', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  approved: { label: 'Approved', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  ordered: { label: 'Ordered', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  delivered: { label: 'Delivered', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  rejected: { label: 'Rejected', color: 'text-red-700', bgColor: 'bg-red-100' },
};

const MaterialsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'catalog' | 'requests' | 'calculator'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Calculator state
  const [calcArea, setCalcArea] = useState<number>(0);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const canManageMaterials = user?.role === 'system_owner' || user?.role === 'project_manager';
  const canViewCosts = user?.role === 'system_owner' || user?.role === 'quantity_surveyor' || user?.role === 'project_manager';

  // Filter materials
  const filteredMaterials = mockMaterials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.supplier_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || material.category === categoryFilter;
    return matchesSearch && matchesCategory && material.is_active;
  });

  // Group materials by category
  const materialsByCategory = filteredMaterials.reduce((acc, material) => {
    if (!acc[material.category]) acc[material.category] = [];
    acc[material.category].push(material);
    return acc;
  }, {} as Record<string, Material[]>);

  // Calculate materials for area
  const calculateMaterials = () => {
    return selectedMaterials.map(id => {
      const material = mockMaterials.find(m => m.id === id);
      if (!material) return null;
      const quantity = material.qty_per_sqm > 0 ? Math.ceil(calcArea * material.qty_per_sqm) : 0;
      const cost = quantity * material.base_price;
      return { ...material, quantity, cost };
    }).filter(Boolean);
  };

  const calculatedMaterials = calculateMaterials();
  const totalCost = calculatedMaterials.reduce((sum, m) => sum + (m?.cost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Materials</h1>
          <p className="text-gray-500 mt-1">Manage materials catalog and requests</p>
        </div>
        {canManageMaterials && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-sage-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-sage-700 transition-colors"
          >
            <Icons.Plus className="w-5 h-5" />
            Add Material
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'catalog'
                ? 'border-sage-600 text-sage-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icons.Layers className="w-5 h-5" />
            Catalog
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'requests'
                ? 'border-sage-600 text-sage-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icons.ClipboardList className="w-5 h-5" />
            Requests
            {mockRequests.filter(r => r.status === 'pending').length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                {mockRequests.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'calculator'
                ? 'border-sage-600 text-sage-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icons.Tool className="w-5 h-5" />
            Calculator
          </button>
        </nav>
      </div>

      {/* Catalog Tab */}
      {activeTab === 'catalog' && (
        <>
          {/* Filters */}
          <Card>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search materials, suppliers..."
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      categoryFilter === cat
                        ? 'bg-sage-100 text-sage-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Materials Grid */}
          {Object.keys(materialsByCategory).length === 0 ? (
            <Card>
              <EmptyState
                icon={<Icons.Layers className="w-12 h-12" />}
                title="No materials found"
                description="Try adjusting your search or filter criteria"
              />
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(materialsByCategory).map(([category, materials]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {materials.map(material => (
                      <Card key={material.id} className="hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{material.name}</h4>
                            <p className="text-sm text-gray-500">{material.supplier_name}</p>
                          </div>
                          {canManageMaterials && (
                            <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                              <Icons.MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Unit: {material.unit}</span>
                          {canViewCosts && (
                            <span className="font-semibold text-gray-900">
                              £{material.base_price.toFixed(2)}/{material.unit}
                            </span>
                          )}
                        </div>
                        
                        {material.stock_level !== undefined && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Stock Level</span>
                              <span className={`font-medium ${
                                material.stock_level <= (material.reorder_point || 0)
                                  ? 'text-red-600'
                                  : 'text-gray-900'
                              }`}>
                                {material.stock_level} {material.unit}
                              </span>
                            </div>
                            {material.stock_level <= (material.reorder_point || 0) && (
                              <p className="text-xs text-red-600 mt-1">⚠️ Below reorder point</p>
                            )}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Material</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Project</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Quantity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Urgency</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Requested By</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {mockRequests.map(request => {
                  const urgency = urgencyConfig[request.urgency];
                  const status = statusConfig[request.status];
                  
                  return (
                    <tr key={request.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{request.material_name}</p>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{request.project_name}</td>
                      <td className="py-4 px-4 text-gray-700">{request.quantity} {request.unit}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${urgency.bgColor} ${urgency.color}`}>
                          {urgency.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{request.requested_by}</td>
                      <td className="py-4 px-4">
                        {canManageMaterials && request.status === 'pending' && (
                          <div className="flex gap-2">
                            <button className="p-1.5 hover:bg-sage-100 rounded-lg" title="Approve">
                              <Icons.Check className="w-4 h-4 text-sage-600" />
                            </button>
                            <button className="p-1.5 hover:bg-red-100 rounded-lg" title="Reject">
                              <Icons.X className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Calculator Tab */}
      {activeTab === 'calculator' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Material Calculator</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Area (sqm)
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="Enter area in square meters"
                  value={calcArea || ''}
                  onChange={(e) => setCalcArea(Number(e.target.value))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Materials
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {mockMaterials.filter(m => m.qty_per_sqm > 0).map(material => (
                    <label
                      key={material.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(material.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMaterials([...selectedMaterials, material.id]);
                          } else {
                            setSelectedMaterials(selectedMaterials.filter(id => id !== material.id));
                          }
                        }}
                        className="w-4 h-4 text-sage-600 rounded border-gray-300 focus:ring-sage-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{material.name}</p>
                        <p className="text-sm text-gray-500">
                          {material.qty_per_sqm} {material.unit}/sqm
                          {canViewCosts && ` • £${material.base_price}/${material.unit}`}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Calculated Quantities</h3>
            {calcArea > 0 && calculatedMaterials.length > 0 ? (
              <div className="space-y-3">
                {calculatedMaterials.map(material => material && (
                  <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{material.name}</p>
                      <p className="text-sm text-gray-500">
                        {material.quantity} {material.unit}
                      </p>
                    </div>
                    {canViewCosts && (
                      <p className="font-semibold text-gray-900">
                        £{material.cost.toFixed(2)}
                      </p>
                    )}
                  </div>
                ))}
                
                {canViewCosts && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total Estimated Cost</span>
                      <span className="text-2xl font-bold text-sage-600">£{totalCost.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Based on {calcArea} sqm project area
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icons.Tool className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Enter area and select materials to calculate quantities</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Add Material Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Material" size="lg">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material Name</label>
            <input type="text" className="input" placeholder="Enter material name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="input">
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select className="input">
                <option value="sqm">Square Meter (sqm)</option>
                <option value="meter">Meter</option>
                <option value="each">Each</option>
                <option value="tonne">Tonne</option>
                <option value="bag">Bag</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (£)</label>
              <input type="number" step="0.01" className="input" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qty per sqm</label>
              <input type="number" step="0.01" className="input" placeholder="0" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
            <input type="text" className="input" placeholder="Enter supplier name" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700"
            >
              Add Material
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MaterialsPage;