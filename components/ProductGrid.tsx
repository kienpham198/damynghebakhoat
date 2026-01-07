
import React, { useContext } from 'react';
import { ContentContext } from '../App';
import EditableText from './EditableText';
import EditableImage from './EditableImage';

const ProductGrid: React.FC = () => {
  const context = useContext(ContentContext);
  if (!context) return null;

  const { content } = context;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {content.products.map((p, idx) => (
        <div key={p.id} className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-stone-100">
          <div className="relative h-64 overflow-hidden">
            <EditableImage contentKey={`products.${idx}.img`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute bottom-4 left-4">
              <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Cao Cấp</span>
            </div>
          </div>
          <div className="p-6">
            <EditableText 
              tagName="h3" 
              contentKey={`products.${idx}.title`} 
              className="text-xl font-bold text-stone-800 mb-2 group-hover:text-amber-700 transition-colors" 
            />
            <EditableText 
              tagName="p" 
              contentKey={`products.${idx}.desc`} 
              className="text-stone-500 text-sm mb-4 leading-relaxed" 
            />
            <div className="flex justify-between items-center pt-4 border-t border-stone-50">
              <EditableText 
                contentKey={`products.${idx}.price`} 
                className="text-amber-600 font-bold" 
              />
              <a 
                href="#contact-inputs" 
                className="text-xs font-bold uppercase tracking-widest text-amber-600 hover:text-stone-800 flex items-center gap-1 transition-colors"
              >
                Tư vấn ngay <i className="fas fa-arrow-down text-[10px]"></i>
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
