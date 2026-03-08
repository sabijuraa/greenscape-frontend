import React, { useEffect, useState } from 'react';
import { photoAPI } from '../../services/api';
import type { Photo } from '../../types';

interface PhotoGalleryProps {
  relatedTo: 'project' | 'site_visit' | 'receipt' | 'design';
  relatedId: string;
  canDelete?: boolean;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ relatedTo, relatedId, canDelete = false }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPhotos = async () => {
    try {
      const response = await photoAPI.list(relatedTo, relatedId);
      setPhotos(response.data);
    } catch (err) {
      console.error('Failed to load photos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, [relatedTo, relatedId]);

  const handleDelete = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      await photoAPI.delete(photoId);
      setPhotos(photos.filter(p => p.id !== photoId));
    } catch (err) {
      alert('Failed to delete photo');
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading photos...</div>;
  }

  if (photos.length === 0) {
    return <div className="text-gray-500">No photos uploaded yet</div>;
  }

  return (
    <div className="photo-gallery grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="relative group">
          <img
            src={`${import.meta.env.VITE_API_URL}/${photo.file_path}`}
            alt={photo.filename}
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
          {canDelete && (
            <button
              onClick={() => handleDelete(photo.id)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <p className="mt-1 text-xs text-gray-500 truncate">{photo.filename}</p>
        </div>
      ))}
    </div>
  );
};

export default PhotoGallery;
