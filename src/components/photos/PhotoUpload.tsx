import React, { useState } from 'react';
import { photoAPI } from '../../services/api';

interface PhotoUploadProps {
  relatedTo: 'project' | 'site_visit' | 'receipt' | 'design';
  relatedId: string;
  onUploadComplete?: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ relatedTo, relatedId, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await photoAPI.upload(file, relatedTo, relatedId);
      if (onUploadComplete) {
        onUploadComplete();
      }
      // Reset input
      e.target.value = '';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="photo-upload">
      <label className="block">
        <span className="sr-only">Choose photo</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-green-50 file:text-green-700
            hover:file:bg-green-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </label>
      
      {uploading && (
        <p className="mt-2 text-sm text-gray-600">Uploading...</p>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default PhotoUpload;
