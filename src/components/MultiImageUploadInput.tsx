import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  Plus,
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  CheckCircle2,
  Link as LinkIcon,
} from 'lucide-react';
import { uploadImageApi, getSafeImageUrl } from '../services/api';

interface MultiImageUploadInputProps {
  label?: string;
  images: string[];
  coverImage?: string;
  onChange: (images: string[], coverImage?: string) => void;
  helpText?: string;
}

export const MultiImageUploadInput: React.FC<MultiImageUploadInputProps> = ({
  label = 'Event Photographs (Multiple)',
  images = [],
  coverImage,
  onChange,
  helpText = 'Upload multiple photos from your computer or phone (JPG, PNG, WEBP). Drag or use arrows to organize.',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Normalize image list: ensure cover image is included
  const currentImages = React.useMemo(() => {
    const list = Array.isArray(images) ? images.filter(Boolean) : [];
    if (coverImage && !list.includes(coverImage)) {
      return [coverImage, ...list];
    }
    return list;
  }, [images, coverImage]);

  const activeCover = coverImage || currentImages[0] || '';

  const handleMultipleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMsg(null);
    setIsUploading(true);
    const newUrls: string[] = [];
    const total = files.length;

    try {
      for (let i = 0; i < total; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        setUploadProgress(`Uploading photo ${i + 1} of ${total}...`);
        const url = await uploadImageApi(file);
        if (url) {
          newUrls.push(url);
        }
      }

      if (newUrls.length > 0) {
        const updated = [...currentImages, ...newUrls];
        const newCover = activeCover || updated[0];
        onChange(updated, newCover);
      } else {
        setErrorMsg('Could not upload selected images. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Multiple upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (currentImages.includes(trimmed)) {
      setErrorMsg('This photo URL has already been added.');
      return;
    }
    const updated = [...currentImages, trimmed];
    onChange(updated, activeCover || updated[0]);
    setUrlInput('');
    setShowUrlField(false);
    setErrorMsg(null);
  };

  const handleSetCover = (imgUrl: string) => {
    // Put cover image first in the list
    const remaining = currentImages.filter((u) => u !== imgUrl);
    const updated = [imgUrl, ...remaining];
    onChange(updated, imgUrl);
  };

  const handleRemoveImage = (imgUrl: string) => {
    const updated = currentImages.filter((u) => u !== imgUrl);
    const newCover = activeCover === imgUrl ? (updated[0] || '') : activeCover;
    onChange(updated, newCover);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentImages.length) return;
    const copy = [...currentImages];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    onChange(copy, copy[0]);
  };

  return (
    <div className="form-group mb-4 multi-image-manager">
      <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
        <label className="input-sublabel !mb-0 font-bold text-amber-950 flex items-center gap-1.5">
          <ImageIcon size={15} className="text-amber-700" />
          {label}
        </label>
        <span className="text-xs text-stone-600 font-medium">
          {currentImages.length === 0 ? (
            <span className="text-stone-400">No photos attached yet</span>
          ) : (
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 size={13} /> {currentImages.length} photo{currentImages.length > 1 ? 's' : ''} attached
            </span>
          )}
        </span>
      </div>

      <p className="text-xs text-stone-500 mb-2.5">{helpText}</p>

      {/* Hidden File Input supporting multiple photos */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleMultipleFiles}
        style={{ display: 'none' }}
      />

      {/* Image Thumbnails Grid */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200/70">
          {currentImages.map((imgUrl, idx) => {
            const isCover = imgUrl === activeCover || idx === 0;
            return (
              <div
                key={`${imgUrl}-${idx}`}
                className={`relative group rounded-lg overflow-hidden border-2 transition-all bg-white shadow-sm flex flex-col ${
                  isCover ? 'border-amber-600 ring-2 ring-amber-300' : 'border-stone-200 hover:border-amber-400'
                }`}
              >
                {/* Photo Preview Box */}
                <div className="relative h-28 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={getSafeImageUrl(imgUrl)}
                    alt={`Event Photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80';
                    }}
                  />

                  {/* Cover Badge */}
                  {isCover && (
                    <span className="absolute top-1.5 left-1.5 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1 z-10">
                      <Star size={10} className="fill-white" /> Cover
                    </span>
                  )}

                  {/* Quick Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(imgUrl)}
                    className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow opacity-90 hover:opacity-100 transition-opacity z-10"
                    title="Remove this photo"
                  >
                    <X size={12} />
                  </button>

                  {/* Reorder Arrows on Hover */}
                  <div className="absolute bottom-1 inset-x-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'left')}
                      className="bg-black/70 hover:bg-black text-white p-1 rounded text-xs disabled:opacity-30"
                      title="Move left"
                    >
                      <ChevronLeft size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === currentImages.length - 1}
                      onClick={() => handleMove(idx, 'right')}
                      className="bg-black/70 hover:bg-black text-white p-1 rounded text-xs disabled:opacity-30"
                      title="Move right"
                    >
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-1.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500 font-mono">#{idx + 1}</span>
                  {!isCover ? (
                    <button
                      type="button"
                      onClick={() => handleSetCover(imgUrl)}
                      className="text-amber-800 hover:text-amber-950 font-semibold hover:underline flex items-center gap-0.5"
                      title="Make this photo the primary event cover"
                    >
                      <Star size={11} /> Set Cover
                    </button>
                  ) : (
                    <span className="text-amber-700 font-semibold text-[10px]">Primary</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Buttons: Upload More Photos / Add by URL */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary !py-2 !px-3.5 !text-xs !bg-amber-800 hover:!bg-amber-900 flex items-center gap-1.5 shadow-sm"
        >
          {isUploading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>{uploadProgress || 'Uploading...'}</span>
            </>
          ) : (
            <>
              <UploadCloud size={15} />
              <span>{currentImages.length > 0 ? '+ Add More Photos' : 'Upload Event Photos'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowUrlField(!showUrlField)}
          className="btn-outline !py-2 !px-3 !text-xs !border-stone-300 text-stone-700 hover:!bg-stone-100 flex items-center gap-1.5"
        >
          <LinkIcon size={13} />
          <span>{showUrlField ? 'Cancel URL' : '+ Add via URL'}</span>
        </button>
      </div>

      {/* Add URL Field */}
      {showUrlField && (
        <form onSubmit={handleAddUrl} className="mt-2.5 flex items-center gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image URL (e.g. https://... or /api/uploads/...)"
            className="form-input !text-xs flex-1"
          />
          <button
            type="submit"
            className="btn-primary !py-1.5 !px-3 !text-xs !bg-amber-700"
          >
            <Plus size={14} /> Add
          </button>
        </form>
      )}

      {/* Error Message */}
      {errorMsg && (
        <p className="text-xs text-red-600 mt-2 font-medium bg-red-50 p-2 rounded border border-red-200">
          ⚠️ {errorMsg}
        </p>
      )}
    </div>
  );
};
