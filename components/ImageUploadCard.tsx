import React, { useState, useRef } from 'react';
import { ImageData } from '../types';

interface ImageUploadCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: ImageData | null;
  onImageSelect: (data: ImageData) => void;
  onRemove: () => void;
  disabled?: boolean;
}

const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  title,
  description,
  icon,
  image,
  onImageSelect,
  onRemove,
  disabled = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert('الرجاء اختيار ملف صورة صالح');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      // split to get raw base64
      const base64 = result.split(',')[1];
      
      onImageSelect({
        file,
        previewUrl: result,
        base64,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerInput = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div 
        className={`
          relative w-full h-80 rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden group
          ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-gray-300 hover:border-indigo-400 bg-white'}
          ${image ? 'border-solid border-transparent shadow-lg' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={image ? undefined : triggerInput}
      >
        <input 
          type="file" 
          ref={inputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
          disabled={disabled}
        />

        {image ? (
          <div className="relative w-full h-full">
            <img 
              src={image.previewUrl} 
              alt="Uploaded" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            
            {/* Remove Button */}
            {!disabled && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="absolute top-4 left-4 p-2 bg-white/90 rounded-full shadow-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-all transform hover:scale-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            
            {/* Label Badge */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm font-semibold text-gray-800">
               {title}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-gray-500">
            <div className={`p-4 rounded-full bg-gray-50 mb-4 transition-transform duration-300 ${isDragging ? 'scale-110 bg-indigo-100' : 'group-hover:scale-110'}`}>
              {icon}
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 max-w-[200px]">{description}</p>
            <span className="mt-4 text-xs text-indigo-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              اضغط للاختيار أو اسحب الصورة هنا
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadCard;
