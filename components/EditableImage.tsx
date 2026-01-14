
import React, { useContext, useRef, useState, useId } from 'react';
import { ContentContext } from '../App';

interface Props {
  contentKey: string;
  className?: string;
  alt?: string;
}

const EditableImage: React.FC<Props> = ({ contentKey, className = "", alt = "" }) => {
  const context = useContext(ContentContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputId = useId(); // Tạo ID duy nhất để liên kết label và input
  
  if (!context) return null;

  const { content, isEditMode, updateContent } = context;
  
  const getValue = (key: string) => {
    return key.split('.').reduce((obj: any, i) => (obj ? obj[i] : null), content);
  };

  const imageUrl = getValue(contentKey);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("Vui lòng chỉ chọn tệp hình ảnh.");
        return;
      }

      if (file.size > 1 * 1024 * 1024) {
        alert("Ảnh này quá nặng (trên 1MB). Vui lòng dùng ảnh đã nén hoặc giảm kích thước để đảm bảo website không bị đơ.");
        return;
      }

      setIsProcessing(true);
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64String = reader.result as string;
        try {
          updateContent(contentKey, base64String);
          setIsProcessing(false);
        } catch (err) {
          alert("Bộ nhớ trình duyệt đầy, không thể lưu ảnh nặng. Hãy thử ảnh nhỏ hơn.");
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Ngăn chặn việc mở Gallery khi đang ở chế độ sửa
  const handleContainerClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.stopPropagation();
    }
  };

  return (
    <div 
      className={`relative overflow-hidden group ${className}`} 
      onClick={handleContainerClick}
    >
      {/* Label này sẽ bao phủ toàn bộ vùng ảnh khi ở chế độ sửa */}
      {isEditMode ? (
        <label 
          htmlFor={inputId}
          className="cursor-pointer block w-full h-full relative"
        >
          <img 
            src={imageUrl || 'https://via.placeholder.com/400x300?text=Chưa+có+ảnh'} 
            alt={alt} 
            className="w-full h-full object-cover ring-2 ring-amber-400 ring-inset" 
          />
          
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 p-4">
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <i className="fas fa-circle-notch animate-spin text-white text-3xl mb-2"></i>
                <span className="text-white text-xs font-bold">ĐANG XỬ LÝ...</span>
              </div>
            ) : (
              <>
                <div className="bg-amber-600 text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-2xl mb-2 flex items-center gap-2 transform group-hover:scale-110 transition-transform">
                  <i className="fas fa-upload"></i> CHỌN ẢNH TỪ MÁY
                </div>
                <p className="text-white text-[10px] font-medium opacity-70">Nhấp vào bất kỳ đâu trên ảnh này</p>
              </>
            )}
          </div>
        </label>
      ) : (
        <img 
          src={imageUrl} 
          alt={alt} 
          className="w-full h-full object-cover" 
        />
      )}
      
      {/* Ô chọn file thực sự, được ẩn đi nhưng liên kết với label qua ID */}
      <input 
        id={inputId}
        type="file" 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/png, image/jpeg, image/webp"
      />
    </div>
  );
};

export default EditableImage;
