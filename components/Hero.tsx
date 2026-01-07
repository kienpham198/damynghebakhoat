
import React from 'react';
import EditableText from './EditableText';
import EditableImage from './EditableImage';

const Hero: React.FC = () => {
  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      const offset = 80;
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

  return (
    <div className="relative h-[85vh] flex items-center overflow-hidden bg-stone-900">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0 opacity-50">
        <EditableImage contentKey="heroImage" className="w-full h-full grayscale brightness-75" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-[1]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="max-w-3xl">
          <EditableText 
            contentKey="heroTagline" 
            className="inline-block text-amber-500 font-bold tracking-[0.3em] uppercase mb-4 text-sm" 
          />
          <EditableText 
            tagName="h1" 
            contentKey="heroTitle" 
            className="text-5xl sm:text-7xl font-serif text-white font-bold leading-tight mb-6" 
          />
          <EditableText 
            tagName="p" 
            contentKey="heroDescription" 
            className="text-lg text-stone-300 mb-10 leading-relaxed max-w-2xl" 
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
            <a 
              href="#products" 
              onClick={(e) => scrollTo(e, '#products')}
              className="bg-amber-600 text-white px-8 py-4 rounded font-bold uppercase tracking-widest hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              Xem mẫu sản phẩm <i className="fas fa-arrow-down text-xs"></i>
            </a>
            <a 
              href="#contact-inputs" 
              onClick={(e) => scrollTo(e, '#contact-inputs')}
              className="border-2 border-white text-white px-8 py-4 rounded font-bold uppercase tracking-widest hover:bg-white hover:text-stone-900 transition-all flex items-center justify-center gap-2"
            >
              Liên hệ tư vấn
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md py-8 hidden md:block border-t border-white/10 z-10">
        <div className="max-w-7xl mx-auto px-4 flex justify-around">
          <div className="text-center group">
            <EditableText contentKey="stats.experience" className="text-3xl font-bold text-amber-600 group-hover:scale-110 transition-transform block" />
            <p className="text-xs text-stone-400 uppercase tracking-widest">Năm Kinh Nghiệm</p>
          </div>
          <div className="text-center group">
            <EditableText contentKey="stats.projects" className="text-3xl font-bold text-amber-600 group-hover:scale-110 transition-transform block" />
            <p className="text-xs text-stone-400 uppercase tracking-widest">Công Trình Hoàn Thành</p>
          </div>
          <div className="text-center group">
            <EditableText contentKey="stats.artisans" className="text-3xl font-bold text-amber-600 group-hover:scale-110 transition-transform block" />
            <p className="text-xs text-stone-400 uppercase tracking-widest">Nghệ Nhân Tay Nghề Cao</p>
          </div>
          <div className="text-center group">
            <EditableText contentKey="stats.provinces" className="text-3xl font-bold text-amber-600 group-hover:scale-110 transition-transform block" />
            <p className="text-xs text-stone-400 uppercase tracking-widest">Tỉnh Thành Phủ Sóng</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
