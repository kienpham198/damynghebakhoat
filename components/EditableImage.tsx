
import React, { useContext, useRef } from 'react';
import { ContentContext } from '../App';

interface Props {
  contentKey: string;
  className?: string;
  alt?: string;
}

const EditableImage: React.FC<Props> = ({ contentKey, className = "", alt = "" }) => {
  const context = useContext(ContentContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if (!context) return null;

  const { content, isEditMode, updateContent } = context;
  
  const getValue = (key: string) => {
    return key.split('.').reduce((obj: any, i) => (obj ? obj[i] : null), content);
  };

  const imageUrl = getValue(contentKey);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateContent(contentKey, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    if (isEditMode) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`relative group cursor-pointer ${className}`} onClick={handleClick}>
      <img src={imageUrl} alt={alt} className="w-full h-full object-cover" />
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
      {isEditMode && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 p-4 text-center">
          <div className="bg-amber-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-xl hover:bg-amber-700 mb-2">
            <i className="fas fa-upload mr-2"></i> Chọn ảnh từ máy tính
          </div>
          <p className="text-white text-[10px] uppercase font-bold tracking-wider">Bấm để thay đổi</p>
        </div>
      )}
    </div>
  );
};

export default EditableImage;
