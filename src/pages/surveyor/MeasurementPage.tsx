import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI, measurementAPI } from '../../services/api';
import PhotoUpload from '../../components/photos/PhotoUpload';
import PhotoGallery from '../../components/photos/PhotoGallery';
import type { Project, CreateMeasurementRequest } from '../../types';

const MeasurementPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [measurements, setMeasurements] = useState<CreateMeasurementRequest[]>([{
    project_id: projectId || '',
    area_name: '',
    length: 0,
    width: 0,
    area: 0,
    preferred_material: '',
    notes: '',
  }]);
  const [loading, setLoading] = useState(false);
  const [photoRefresh, setPhotoRefresh] = useState(0);

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const response = await projectAPI.get(projectId!);
      setProject(response.data);
    } catch (err) {
      console.error('Failed to load project:', err);
    }
  };

  const addMeasurement = () => {
    setMeasurements([...measurements, {
      project_id: projectId || '',
      area_name: '',
      length: 0,
      width: 0,
      area: 0,
      preferred_material: '',
      notes: '',
    }]);
  };

  const updateMeasurement = (index: number, field: keyof CreateMeasurementRequest, value: any) => {
    const updated = [...measurements];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-calculate area if length and width are provided
    if (field === 'length' || field === 'width') {
      const length = field === 'length' ? value : updated[index].length;
      const width = field === 'width' ? value : updated[index].width;
      if (length && width) {
        updated[index].area = length * width;
      }
    }
    
    setMeasurements(updated);
  };

  const removeMeasurement = (index: number) => {
    setMeasurements(measurements.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create all measurements
      for (const measurement of measurements) {
        await measurementAPI.create(measurement);
      }
      
      alert('Measurements saved successfully!');
      navigate('/surveyor');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save measurements');
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return <div className="p-6">Loading project...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Site Measurement</h1>
        <p className="text-gray-600 mt-2">{project.name} - {project.client_name}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Measurements */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Area Measurements</h2>
            <button
              type="button"
              onClick={addMeasurement}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Add Area
            </button>
          </div>

          <div className="space-y-6">
            {measurements.map((measurement, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-900">Area {index + 1}</h3>
                  {measurements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMeasurement(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={measurement.area_name}
                      onChange={(e) => updateMeasurement(index, 'area_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., Front Garden, Backyard"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Length (m)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={measurement.length || ''}
                      onChange={(e) => updateMeasurement(index, 'length', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Width (m)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={measurement.width || ''}
                      onChange={(e) => updateMeasurement(index, 'width', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Area (m²) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={measurement.area}
                      onChange={(e) => updateMeasurement(index, 'area', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Material
                    </label>
                    <input
                      type="text"
                      value={measurement.preferred_material || ''}
                      onChange={(e) => updateMeasurement(index, 'preferred_material', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., Grass, Gravel, Paving"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={measurement.notes || ''}
                      onChange={(e) => updateMeasurement(index, 'notes', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      placeholder="Any additional notes about this area..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Site Photos</h2>
          <div className="mb-4">
            <PhotoUpload
              relatedTo="project"
              relatedId={projectId!}
              onUploadComplete={() => setPhotoRefresh(prev => prev + 1)}
            />
          </div>
          <PhotoGallery
            key={photoRefresh}
            relatedTo="project"
            relatedId={projectId!}
            canDelete={true}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/surveyor')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Complete Survey'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MeasurementPage;
