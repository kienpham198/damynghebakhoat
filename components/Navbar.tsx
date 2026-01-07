
import React, { useState, useContext } from 'react';
import EditableText from './EditableText';
import { ContentContext } from '../App';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const context = useContext(ContentContext);

  const navLinks = [
    { name: 'Sản Phẩm', href: '#products', type: 'scroll' },
    { name: 'Giới Thiệu', href: '#about', type: 'scroll' },
    { name: 'Công Trình', href: '#gallery', type: 'scroll' },
    { name: 'Liên Hệ', href: `tel:${context?.content.hotline.replace(/\./g, '')}`, type: 'phone' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: any) => {
    if (link.type === 'scroll') {
      e.preventDefault();
      const element = document.querySelector(link.href);
      if (element) {
        // Cuộn trang mượt mà đến vị trí id
        const offset = 80; // Trừ đi chiều cao của navbar
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      setIsOpen(false);
    }
    // Với type 'phone', trình duyệt sẽ tự xử lý tel:
  };

  return (
    <nav className="bg-stone-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="bg-amber-600 p-2 rounded">
                 <i className="fas fa-gem text-2xl"></i>
              </div>
              <div className="leading-tight">
                <EditableText contentKey="brandName" tagName="h1" className="text-xl font-bold tracking-wider font-serif uppercase" />
                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.2em]">Đá Mỹ Nghệ Cao Cấp</p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {/* Trang chủ as non-clickable text */}
              <span className="px-3 py-2 text-sm font-medium text-stone-500 uppercase tracking-widest cursor-default select-none border-b-2 border-transparent">
                Trang Chủ
              </span>
              
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`px-3 py-2 text-sm font-medium hover:text-amber-500 transition-colors uppercase tracking-widest ${link.type === 'phone' ? 'text-amber-500 font-bold' : ''}`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 focus:outline-none"
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-stone-800 border-t border-stone-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <span className="block px-3 py-2 text-base font-medium text-stone-600 uppercase tracking-widest border-l-4 border-transparent">
              Trang Chủ
            </span>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 text-base font-medium hover:bg-stone-700 rounded-md ${link.type === 'phone' ? 'text-amber-500' : ''}`}
                onClick={(e) => handleLinkClick(e, link)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
