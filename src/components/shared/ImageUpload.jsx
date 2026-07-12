import React, { useRef, useState, useCallback } from 'react';
import { Upload, ImageIcon, X } from 'lucide-react';

const MAX_SIZE_MB = 5;

export default function ImageUpload({ value, onChange, label = 'Profile Image', hint = 'PNG, JPG up to 5MB', accept = 'image/png,image/jpeg', className = '' }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const readFile = useCallback((file) => {
    if (!file) return;
    setError('');

    if (!accept.split(',').map(a => a.trim()).includes(file.type)) {
      setError('Invalid file type. Please use PNG or JPG.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Max ${MAX_SIZE_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange?.(ev.target.result);
    };
    reader.readAsDataURL(file);
  }, [accept, onChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    readFile(file);
  }, [readFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleClear = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onChange?.('');
    if (inputRef.current) inputRef.current.value = '';
  }, [onChange]);

  return (
    <div className={className}>
      {label && <p className="text-sm font-medium text-[#0F172A] mb-1">{label}</p>}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex items-center gap-3 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
          dragging ? 'border-[#0F766E] bg-[#E6F7F6]' : 'border-[#DCE5EA] hover:border-[#0F766E] hover:bg-[#F4F7F9]'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-[#F4F7F9] flex items-center justify-center flex-shrink-0 overflow-hidden">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-5 h-5 text-[#64748B]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#0F766E]">
            {dragging ? 'Drop to upload' : 'Click to upload or drag & drop'}
          </p>
          <p className="text-xs text-[#64748B]">{hint}</p>
          {error && <p className="text-xs text-[#DC2626] mt-0.5">{error}</p>}
        </div>
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-lg bg-white border border-[#DCE5EA] hover:bg-red-50 hover:border-red-200 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-[#DC2626]" />
          </button>
        ) : (
          <Upload className="w-5 h-5 text-[#64748B] flex-shrink-0" />
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => readFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
