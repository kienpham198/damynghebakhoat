
import React, { useContext } from 'react';
import { ContentContext } from '../App';
import EditableImage from './EditableImage';

const Gallery: React.FC = () => {
  const context = useContext(ContentContext);
  if (!context) return null;

  const { content } = context;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {content.galleryImages.map((src, i) => (
        <div key={i} className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer border border-stone-200 shadow-sm">
          <EditableImage contentKey={`galleryImages.${i}`} className="w-full h-full group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
             <i className="fas fa-search-plus text-white text-3xl"></i>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
