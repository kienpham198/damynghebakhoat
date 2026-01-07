
import React, { useState, useEffect, createContext } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import AboutSection from './components/AboutSection';
import Gallery from './components/Gallery';
import ContactSection from './components/ContactSection';
import AIConsultant from './components/AIConsultant';
import Footer from './components/Footer';
import { SiteContent } from './types';

// Nội dung mặc định
const defaultContent: SiteContent = {
  "brandName": "Bá Khoát",
  "hotline": "0587.750.999",
  "email": "modabakhoat@gmail.com",
  "heroTagline": "Làng nghề đá mỹ nghệ Ninh Vân",
  "heroTitle": "Lưu Giữ Nguyên Giá Trị Qua Thời Gian",
  "heroDescription": "Cơ sở Mộ đá Bá Khoát tự hào là đơn vị tiên phong trong chế tác lăng mộ đá xanh nguyên khối cao cấp. Tinh hoa chạm khắc, uy tín hàng đầu.",
  "aboutTitle": "Về Chúng Tôi",
  "aboutContent": "Tọa lạc tại trung tâm làng nghề đá mỹ nghệ truyền thống Ninh Vân, Hoa Lư, Ninh Bình, cơ sở Bá Khoát đã có hơn 20 năm gìn giữ và phát triển nét đẹp văn hóa Việt qua từng thớ đá.",
  "aboutFeatures": [
    {
      "title": "Chất lượng đá loại 1",
      "desc": "Chỉ sử dụng đá xanh Thanh Hóa, đá Ấn Độ đá Granite tự nhiên không rạn nứt."
    },
    {
      "title": "Nghệ nhân trực tiếp chế tác",
      "desc": "Mỗi hoa văn đều mang tâm huyết và sự tỉ mỉ của nghệ nhân lâu năm."
    },
    {
      "title": "Vận chuyển toàn quốc",
      "desc": "Lắp đặt tận nơi, cam kết đúng tiến độ và thẩm mỹ."
    }
  ],
  "stats": {
    "experience": "15+",
    "projects": "1000+",
    "artisans": "30+",
    "provinces": "35"
  },
  "heroImage": "https://images.unsplash.com/photo-1590059390250-98843912660a?auto=format&fit=crop&q=80&w=1920",
  "aboutImage": "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&q=80&w=800",
  "products": [
    {
      "id": "1", "title": "Mộ Đá Đơn", "desc": "Mẫu mộ đơn giản, uy nghiêm, bền bỉ cùng thời gian.", "img": "https://picsum.photos/id/101/400/300", "price": "Từ 15.000.000đ"
    },
    {
      "id": "2", "title": "Lăng Thờ Đá", "desc": "Lăng thờ chung cho khuôn viên nghĩa trang gia đình.", "img": "https://picsum.photos/id/102/400/300", "price": "Từ 45.000.000đ"
    },
    {
      "id": "3", "title": "Cuốn Thư Đá", "desc": "Vật phẩm phong thủy chắn tà khí cho công trình.", "img": "https://picsum.photos/id/103/400/300", "price": "Liên hệ"
    },
    {
      "id": "4", "title": "Linh Vật Đá", "desc": "Rồng, nghê, voi đá chạm khắc tinh xảo.", "img": "https://picsum.photos/id/104/400/300", "price": "Liên hệ"
    },
    {
      "id": "5", "title": "Cổng Đá", "desc": "Cổng đá cho từ đường, đình chùa, lăng mộ.", "img": "https://picsum.photos/id/111/400/300", "price": "Liên hệ"
    },
    {
      "id": "6", "title": "Chiếu Rồng", "desc": "Chạm rồng phượng tinh hoa nghệ thuật đá.", "img": "https://picsum.photos/id/123/400/300", "price": "Liên hệ"
    }
  ],
  "galleryImages": [
    "https://picsum.photos/id/15/600/600", "https://picsum.photos/id/16/600/600",
    "https://picsum.photos/id/17/600/600", "https://picsum.photos/id/18/600/600",
    "https://picsum.photos/id/19/600/600", "https://picsum.photos/id/20/600/600"
  ]
};

interface ContentContextType {
  content: SiteContent;
  isEditMode: boolean;
  updateContent: (key: string, value: any) => void;
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);

const App: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [content, setContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('bakhoat_content');
    return saved ? JSON.parse(saved) : defaultContent;
  });

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateContent = (key: string, value: any) => {
    setSaveStatus('saving');
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev));
      const parts = key.split('.');
      let current = newContent;
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      localStorage.setItem('bakhoat_content', JSON.stringify(newContent));
      setTimeout(() => setSaveStatus('saved'), 500);
      setTimeout(() => setSaveStatus('idle'), 3000);
      return newContent;
    });
  };

  return (
    <ContentContext.Provider value={{ content, isEditMode, updateContent }}>
      <div className="min-h-screen bg-stone-texture selection:bg-amber-200 scroll-smooth">
        <Navbar />
        <main>
          <section id="home"><Hero /></section>
          <div className="max-w-7xl mx-auto px-4 py-12">
            <section id="products" className="mb-20"><ProductGrid /></section>
            <section id="about" className="mb-20"><AboutSection /></section>
            <section id="gallery" className="mb-20"><Gallery /></section>
            <section id="contact" className="mb-20"><ContactSection /></section>
          </div>
        </main>
        <Footer />
        <AIConsultant />
      </div>
    </ContentContext.Provider>
  );
};

export default App;
