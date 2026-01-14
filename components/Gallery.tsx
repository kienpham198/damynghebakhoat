
import React, { useContext, useState } from 'react';
import { ContentContext } from '../App';
import EditableImage from './EditableImage';

const Gallery: React.FC = () => {
  const context = useContext(ContentContext);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  if (!context) return null;
  const { content, isEditMode, updateContent } = context;

  const handleImageClick = (src: string) => {
    if (!isEditMode) {
      setSelectedImg(src);
    }
  };

  const removeGalleryImage = (idx: number) => {
    if (confirm("Xóa ảnh công trình này?")) {
      const newGallery = content.galleryImages.filter((_, i) => i !== idx);
      updateContent('galleryImages', newGallery);
    }
  };

  const addGalleryImage = () => {
    const newGallery = [...content.galleryImages, "https://via.placeholder.com/600x600?text=Công+trình+mới"];
    updateContent('galleryImages', newGallery);
  };

  return (
    <div className="py-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 uppercase tracking-tight">
          Các Công Trình Hoàn Thiện
        </h2>
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] w-12 bg-stone-300"></div>
          <div className="h-2 w-2 bg-amber-600 rotate-45"></div>
          <div className="h-[1px] w-12 bg-stone-300"></div>
        </div>
        <p className="text-stone-500 mt-6 max-w-2xl mx-auto italic">
          Hình ảnh thực tế từ các dự án lăng mộ, nhà thờ họ chúng tôi đã thi công trên khắp 63 tỉnh thành.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {content.galleryImages.map((src, i) => (
          <div 
            key={i} 
            className={`relative aspect-square overflow-hidden rounded-xl group border border-stone-200 shadow-sm transition-shadow ${isEditMode ? '' : 'cursor-pointer hover:shadow-xl'}`}
            onClick={() => handleImageClick(src)}
          >
            <EditableImage contentKey={`galleryImages.${i}`} className="w-full h-full group-hover:scale-110 transition-transform duration-700" />
            
            {isEditMode ? (
              <button 
                onClick={(e) => { e.stopPropagation(); removeGalleryImage(i); }}
                className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full shadow-lg z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <i className="fas fa-trash-alt text-xs"></i>
              </button>
            ) : (
              <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full border border-white/30">
                    <i className="fas fa-search-plus text-white text-2xl"></i>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* NÚT THÊM ẢNH CÔNG TRÌNH */}
        {isEditMode && (
          <button 
            onClick={addGalleryImage}
            className="aspect-square rounded-xl border-4 border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-300 hover:text-amber-600 hover:border-amber-600 hover:bg-amber-50 transition-all group"
          >
            <i className="fas fa-plus-circle text-3xl mb-2 group-hover:scale-110 transition-transform"></i>
            <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">Thêm công trình</span>
          </button>
        )}
      </div>

      {selectedImg && !isEditMode && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm cursor-zoom-out"
          onClick={() => setSelectedImg(null)}
        >
          <button className="absolute top-6 right-6 text-white text-3xl"><i className="fas fa-times"></i></button>
          <img src={selectedImg} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl scale-up" />
        </div>
      )}
    </div>
  );
};

export default Gallery;
