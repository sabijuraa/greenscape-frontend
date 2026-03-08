// Material Calculator Page
import React, { useState, useMemo } from 'react';
import {
  calculateProjectMaterials,
  aggregateMaterials,
  PROJECT_TYPE_NAMES,
  PROJECT_TYPE_UNITS,
  ProjectType,
  ProjectCalculation,
  MaterialRequirement
} from '../../services/materialCalculations';

interface ProjectEntry {
  id: string;
  type: ProjectType;
  quantity: number;
  additionalQuantity?: number;
}

const MaterialCalculatorPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [selectedType, setSelectedType] = useState<ProjectType>('clay_pavers');
  const [quantity, setQuantity] = useState<string>('');
  const [additionalQuantity, setAdditionalQuantity] = useState<string>('');

  const addProject = () => {
    if (!quantity || parseFloat(quantity) <= 0) return;
    
    const newProject: ProjectEntry = {
      id: Date.now().toString(),
      type: selectedType,
      quantity: parseFloat(quantity),
      additionalQuantity: additionalQuantity ? parseFloat(additionalQuantity) : undefined
    };
    
    setProjects([...projects, newProject]);
    setQuantity('');
    setAdditionalQuantity('');
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const calculatedMaterials = useMemo(() => {
    if (projects.length === 0) return [];
    
    const materialLists = projects.map(project => 
      calculateProjectMaterials({
        type: project.type,
        quantity: project.quantity,
        additionalQuantity: project.additionalQuantity
      })
    );
    
    return aggregateMaterials(materialLists);
  }, [projects]);

  const groupedMaterials = useMemo(() => {
    const groups: Record<string, MaterialRequirement[]> = {};
    
    for (const material of calculatedMaterials) {
      if (!groups[material.category]) {
        groups[material.category] = [];
      }
      groups[material.category].push(material);
    }
    
    return groups;
  }, [calculatedMaterials]);

  const projectTypes = Object.keys(PROJECT_TYPE_NAMES) as ProjectType[];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Material Calculator</h1>
          <p className="text-gray-600 mt-1">
            Calculate materials required for your landscaping projects
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Add Projects */}
          <div>
            {/* Add Project Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Project Item</h2>
              
              <div className="space-y-4">
                {/* Project Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as ProjectType)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  >
                    {projectTypes.map(type => (
                      <option key={type} value={type}>
                        {PROJECT_TYPE_NAMES[type]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity ({PROJECT_TYPE_UNITS[selectedType]})
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder={`Enter ${PROJECT_TYPE_UNITS[selectedType]}`}
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  />
                </div>

                {/* Additional Quantity for Screen Fencing */}
                {selectedType === 'screen_fencing' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Area (m²) - Optional
                    </label>
                    <input
                      type="number"
                      value={additionalQuantity}
                      onChange={(e) => setAdditionalQuantity(e.target.value)}
                      placeholder="For post calculation"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                    />
                  </div>
                )}

                <button
                  onClick={addProject}
                  disabled={!quantity || parseFloat(quantity) <= 0}
                  className="w-full px-4 py-2.5 bg-sage-600 text-white font-medium rounded-lg hover:bg-sage-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add to Calculation
                </button>
              </div>
            </div>

            {/* Project Items List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Items</h2>
              
              {projects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p>No project items added yet</p>
                  <p className="text-sm mt-1">Add items above to calculate materials</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {PROJECT_TYPE_NAMES[project.type]}
                        </p>
                        <p className="text-sm text-gray-500">
                          {project.quantity} {PROJECT_TYPE_UNITS[project.type]}
                          {project.additionalQuantity && ` (${project.additionalQuantity} m² total)`}
                        </p>
                      </div>
                      <button
                        onClick={() => removeProject(project.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  {projects.length > 0 && (
                    <button
                      onClick={() => setProjects([])}
                      className="w-full mt-4 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Clear All Items
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Materials Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Materials Required</h2>
              
              {calculatedMaterials.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p>No materials calculated</p>
                  <p className="text-sm mt-1">Add project items to see required materials</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedMaterials).map(([category, materials]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-sage-700 uppercase tracking-wider mb-3">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {materials.map((material, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                          >
                            <span className="text-gray-700">{material.name}</span>
                            <span className="font-semibold text-gray-900">
                              {material.quantity} {material.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Export Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        const text = calculatedMaterials
                          .map(m => `${m.name}: ${m.quantity} ${m.unit}`)
                          .join('\n');
                        navigator.clipboard.writeText(text);
                      }}
                      className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Copy Materials List
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Formula Reference */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Material Formulas Reference</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Edging */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Edging (per 1m)</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>10x Block paving OR 1m porcelain</li>
                <li>10kg Grit sand</li>
                <li>0.02 tonnes MOT</li>
                <li>1/10 Cement bag</li>
              </ul>
            </div>

            {/* Clay Pavers */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Clay Pavers (per m²)</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>1m² Clay pavers</li>
                <li>100kg Grit sand</li>
                <li>0.2 tonnes MOT</li>
              </ul>
            </div>

            {/* Resin */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Resin Two Layer (per m²)</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>1m² Resin kit (top and base)</li>
                <li>0.2 tonnes MOT</li>
              </ul>
            </div>

            {/* Composite Fencing */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Composite Fencing (per panel)</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>2x Aluminum posts</li>
                <li>11x Composite fence panels</li>
                <li>2x Post mix</li>
                <li>1x Composite top panel</li>
              </ul>
            </div>

            {/* Screen Fencing */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Screen Fencing (per 1.8m)</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>5x Fence battens</li>
                <li>30x Screws/pins</li>
                <li>0.6 posts per m² or 2 posts per 3.5m²</li>
                <li>6x Post mix or 2 per 3.5m²</li>
              </ul>
            </div>

            {/* Decking */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Decking (per m²)</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>2x Decking boards (3.6m)</li>
                <li>1m² Weed membrane</li>
                <li>0.5x Post mix</li>
                <li>1x Timber 5x10cm 4.8m</li>
                <li>1x Post 100x100mm 2.4m</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialCalculatorPage;
