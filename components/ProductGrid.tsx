
import React, { useContext, useState } from 'react';
import { ContentContext } from '../App';
import EditableText from './EditableText';
import EditableImage from './EditableImage';
import { Product } from '../types';

const ProductGrid: React.FC = () => {
  const context = useContext(ContentContext);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  if (!context) return null;
  const { content, isEditMode, updateContent } = context;

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('contact-inputs');
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const openGallery = (product: Product) => {
    if (!isEditMode) {
      setSelectedProduct(product);
      setActiveImgIdx(0);
    }
  };

  const addProductImage = (idx: number) => {
    const product = content.products[idx];
    const newImages = [...(product.images || [product.img])];
    newImages.push("https://via.placeholder.com/800x600?text=Ảnh+chi+tiết+mới");
    updateContent(`products.${idx}.images`, newImages);
  };

  const removeProductImage = (pIdx: number, imgIdx: number) => {
    if (confirm("Xóa ảnh này khỏi bộ sưu tập?")) {
      const newImages = content.products[pIdx].images?.filter((_, i) => i !== imgIdx);
      updateContent(`products.${pIdx}.images`, newImages);
    }
  };

  return (
    <div className="py-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 uppercase tracking-tight">
          Giới Thiệu Sản Phẩm
        </h2>
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] w-12 bg-stone-300"></div>
          <div className="h-2 w-2 bg-amber-600 rotate-45"></div>
          <div className="h-[1px] w-12 bg-stone-300"></div>
        </div>
        <p className="text-stone-500 mt-6 max-w-2xl mx-auto italic">
          Tinh hoa chế tác đá mỹ nghệ từ những khối đá tự nhiên nguyên khối, bền vững cùng thời gian.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {content.products.map((p, idx) => (
          <div key={p.id} className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-stone-100 flex flex-col">
            <div 
              className={`relative h-72 overflow-hidden ${isEditMode ? '' : 'cursor-pointer'}`} 
              onClick={() => openGallery(p)}
            >
              <EditableImage contentKey={`products.${idx}.img`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              {!isEditMode && (
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/90 text-stone-900 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform">
                    Xem chi tiết bộ ảnh
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 flex-grow flex flex-col">
              <EditableText 
                tagName="h3" 
                contentKey={`products.${idx}.title`} 
                className="text-xl font-bold text-stone-800 mb-2 group-hover:text-amber-700 transition-colors" 
              />
              <EditableText 
                tagName="p" 
                contentKey={`products.${idx}.desc`} 
                className="text-stone-500 text-sm mb-4 leading-relaxed flex-grow" 
              />
              
              {/* PHẦN SỬA ẢNH CHI TIẾT KHI Ở CHẾ ĐỘ SỬA */}
              {isEditMode && (
                <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-dashed border-stone-300 mb-4">
                  <p className="text-[10px] font-bold text-stone-400 uppercase mb-2">Ảnh chi tiết (Click để thay):</p>
                  <div className="flex flex-wrap gap-2">
                    {p.images?.map((img, imgIdx) => (
                      <div key={imgIdx} className="relative group/img">
                        <EditableImage 
                          contentKey={`products.${idx}.images.${imgIdx}`} 
                          className="w-12 h-12 rounded border border-stone-300 shadow-sm" 
                        />
                        <button 
                          onClick={() => removeProductImage(idx, imgIdx)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full text-[8px] flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity z-30"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => addProductImage(idx)}
                      className="w-12 h-12 rounded border-2 border-dashed border-stone-300 flex items-center justify-center text-stone-400 hover:text-amber-600 hover:border-amber-600 transition-all bg-white"
                      title="Thêm ảnh chi tiết"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-stone-50">
                <EditableText 
                  contentKey={`products.${idx}.price`} 
                  className="text-amber-600 font-bold" 
                />
                <button 
                  onClick={scrollToContact}
                  className="bg-stone-900 text-white px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-md"
                >
                  Tư vấn ngay
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* NÚT THÊM SẢN PHẨM MỚI */}
        {isEditMode && (
          <button 
            onClick={() => {
              const newProducts = [...content.products];
              newProducts.push({
                id: Date.now().toString(),
                title: "Tên sản phẩm mới",
                desc: "Mô tả ngắn gọn về sản phẩm này.",
                img: "https://via.placeholder.com/600x400?text=Sản+phẩm+mới",
                images: [],
                price: "Liên hệ"
              });
              updateContent('products', newProducts);
            }}
            className="flex flex-col items-center justify-center border-4 border-dashed border-stone-200 rounded-xl p-10 text-stone-300 hover:text-amber-600 hover:border-amber-600 hover:bg-amber-50 transition-all group"
          >
            <i className="fas fa-plus-circle text-4xl mb-4 group-hover:scale-110 transition-transform"></i>
            <span className="font-bold uppercase tracking-widest text-sm">Thêm sản phẩm mới</span>
          </button>
        )}
      </div>

      {/* Lightbox - chỉ hiện khi KHÔNG sửa */}
      {selectedProduct && !isEditMode && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 md:p-10 animate-fade-in backdrop-blur-sm">
          <button 
            onClick={() => setSelectedProduct(null)}
            className="absolute top-6 right-6 text-white text-3xl hover:text-amber-500 transition-colors z-[110]"
          >
            <i className="fas fa-times"></i>
          </button>

          <div className="relative w-full max-w-5xl h-[60vh] md:h-[75vh] flex items-center justify-center">
            <img 
              src={selectedProduct.images?.[activeImgIdx] || selectedProduct.img} 
              alt={selectedProduct.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl scale-up"
            />
            
            {(selectedProduct.images?.length || 0) > 1 && (
              <>
                <button 
                  onClick={() => setActiveImgIdx(prev => (prev === 0 ? (selectedProduct.images?.length || 1) - 1 : prev - 1))}
                  className="absolute left-0 text-white/50 hover:text-white text-4xl p-4 transition-colors"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button 
                  onClick={() => setActiveImgIdx(prev => (prev === (selectedProduct.images?.length || 1) - 1 ? 0 : prev + 1))}
                  className="absolute right-0 text-white/50 hover:text-white text-4xl p-4 transition-colors"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </>
            )}
          </div>

          <div className="mt-8 text-center">
            <h4 className="text-white text-2xl font-serif font-bold mb-2">{selectedProduct.title}</h4>
            <div className="flex gap-2 justify-center mt-4 overflow-x-auto pb-2 max-w-full px-4">
              {(selectedProduct.images || [selectedProduct.img]).map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImgIdx(i)}
                  className={`w-16 h-16 rounded overflow-hidden border-2 transition-all flex-shrink-0 ${activeImgIdx === i ? 'border-amber-500 scale-110' : 'border-transparent opacity-50'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
