import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
import { uploadImageApi } from '../services/api';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  helpText?: string;
  previewHeight?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  helpText = 'Choose a photo from your computer (JPG, PNG, WEBP up to 15MB)',
  previewHeight = '140px',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP, GIF)');
      return;
    }

    setUploadError(null);
    setFileName(file.name);
    setIsUploading(true);

    try {
      const uploadedUrl = await uploadImageApi(file);
      if (uploadedUrl) {
        onChange(uploadedUrl);
      } else {
        setUploadError('Could not process image. Please try again.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      // Reset input value so re-selecting the same file triggers change
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setFileName('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="form-group mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <label className="input-sublabel !mb-0">
          {label} {required && <span className="text-amber-600 font-bold">*</span>}
        </label>
        {value && (
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 size={12} /> Photo Attached
          </span>
        )}
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* When Image Exists: Show Preview Card with Replace / Remove Actions */}
      {value ? (
        <div className="image-upload-preview-card">
          <div
            className="preview-img-box"
            style={{ height: previewHeight }}
          >
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          <div className="preview-action-bar">
            <div className="preview-meta">
              <ImageIcon size={14} className="text-amber-800" />
              <span className="text-xs font-semibold text-stone-700 line-clamp-1">
                {fileName || 'Uploaded Photo'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="btn-upload-replace"
              >
                {isUploading ? (
                  <Loader2 size={13} className="animate-spin text-amber-700" />
                ) : (
                  <RefreshCw size={13} />
                )}
                <span>{isUploading ? 'Uploading...' : 'Change Photo'}</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="btn-upload-remove"
                title="Remove photo"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State: File Dropzone / Picker */
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`image-upload-dropzone ${isUploading ? 'uploading' : ''}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-5">
              <Loader2 size={28} className="animate-spin text-amber-700 mb-2" />
              <span className="text-sm font-bold text-amber-950">Uploading Photo to Server...</span>
              <span className="text-xs text-stone-500 mt-1">Please wait a moment</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-5 px-4 text-center cursor-pointer">
              <div className="upload-icon-circle mb-2">
                <UploadCloud size={24} className="text-amber-800" />
              </div>
              <span className="text-sm font-bold text-amber-950 hover:text-amber-700 transition-colors">
                Click to Choose Photo from Device
              </span>
              <p className="text-xs text-stone-500 mt-1 max-w-sm">{helpText}</p>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-red-600 mt-1.5 font-semibold flex items-center gap-1">
          <X size={12} /> {uploadError}
        </p>
      )}
    </div>
  );
};
