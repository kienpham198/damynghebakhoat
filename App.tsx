
import React, { useState, useEffect, createContext, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import AboutSection from './components/AboutSection';
import Gallery from './components/Gallery';
import ContactSection from './components/ContactSection';
import AIConsultant from './components/AIConsultant';
import Footer from './components/Footer';
import { SiteContent } from './types';
import { initialContent } from './content';

interface ContentContextType {
  content: SiteContent;
  isEditMode: boolean;
  updateContent: (key: string, value: any) => void;
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);

const App: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('bakhoat_content') : null;
      if (saved) {
        return JSON.parse(saved);
      }
      return initialContent;
    } catch (e) {
      console.error("Lỗi khi tải nội dung:", e);
      return initialContent;
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem('bakhoat_content');
    if (saved) {
      setHasChanges(true);
      const now = new Date();
      setLastSaved(`Đã khôi phục dữ liệu lúc ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
    }
  }, []);

  const updateContent = (key: string, value: any) => {
    setIsSaving(true);
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev));
      const parts = key.split('.');
      let current = newContent;
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      
      try {
        localStorage.setItem('bakhoat_content', JSON.stringify(newContent));
        setHasChanges(true);
        const now = new Date();
        setLastSaved(`Vừa lưu lúc ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
        setTimeout(() => setIsSaving(false), 1000);
      } catch (e) {
        console.error("Storage full:", e);
        alert("BỘ NHỚ ĐẦY: Ảnh quá nặng, hãy dùng ảnh dưới 500KB.");
        setIsSaving(false);
      }
      return newContent;
    });
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        
        // LOGIC MỚI: Tìm dấu ngoặc nhọn của dữ liệu thực tế
        // Chúng ta tìm vị trí của "initialContent" hoặc "= {" để chắc chắn lấy đúng object
        let startIdx = text.indexOf('initialContent');
        if (startIdx !== -1) {
          startIdx = text.indexOf('{', startIdx);
        } else {
          // Nếu không thấy chữ initialContent, tìm dấu { đầu tiên mà sau đó là một dấu nháy kép " (đặc trưng của JSON)
          const matches = Array.from(text.matchAll(/\{/g));
          for(const match of matches) {
            const idx = match.index!;
            const sample = text.substring(idx + 1, idx + 50).trim();
            if (sample.startsWith('"')) {
              startIdx = idx;
              break;
            }
          }
        }
        
        const endIdx = text.lastIndexOf('}');
        
        if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
          const jsonStr = text.substring(startIdx, endIdx + 1);
          const importedData = JSON.parse(jsonStr);
          
          if (importedData && (importedData.brandName || importedData.products)) {
            setContent(importedData);
            localStorage.setItem('bakhoat_content', JSON.stringify(importedData));
            setHasChanges(true);
            setLastSaved("Vừa nạp file dữ liệu");
            alert("Khôi phục dữ liệu THÀNH CÔNG! Website đã cập nhật nội dung từ file của bạn.");
            setShowExportModal(false);
          } else {
            throw new Error("Dữ liệu không đúng cấu trúc.");
          }
        } else {
          throw new Error("Không tìm thấy khối dữ liệu hợp lệ.");
        }
      } catch (err) {
        alert("LỖI ĐỊNH DẠNG: File này không thể nạp được. Hãy chắc chắn bạn chọn đúng file content.ts đã tải về trước đó.");
        console.error(err);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  const downloadFullCode = () => {
    const fileContent = `import { SiteContent } from './types';\n\nexport const initialContent: SiteContent = ${JSON.stringify(content, null, 2)};`;
    const blob = new Blob([fileContent], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetToDefault = () => {
    if (confirm("XÓA TẤT CẢ sửa đổi để quay về mặc định ban đầu?")) {
      localStorage.removeItem('bakhoat_content');
      window.location.reload();
    }
  };

  return (
    <ContentContext.Provider value={{ content, isEditMode, updateContent }}>
      <div className="min-h-screen bg-stone-texture selection:bg-amber-200 scroll-smooth pb-20">
        {hasChanges && !isEditMode && (
          <div id="status-banner" className="bg-green-700 text-white text-[9px] py-1.5 px-4 text-center font-bold uppercase tracking-[0.2em] fixed top-0 left-0 right-0 z-[60] shadow-lg flex items-center justify-center gap-3">
            <i className="fas fa-check-circle"></i>
            <span>Website đang hiển thị dữ liệu bạn đã lưu</span>
            <span className="opacity-40">|</span>
            <span className="font-mono">{lastSaved}</span>
          </div>
        )}

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

        {/* Admin Toolbar */}
        <div className="fixed bottom-0 left-0 right-0 bg-stone-950/95 border-t border-stone-800 p-4 z-[100] flex justify-between items-center px-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <div className="flex flex-col min-w-[140px]">
              <span className="text-stone-500 text-[9px] font-bold uppercase tracking-widest mb-1">Trạng thái dữ liệu</span>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${isSaving ? 'bg-green-400 animate-ping' : (isEditMode ? 'bg-blue-500' : 'bg-green-500')}`}></div>
                <span className="text-white text-[10px] font-bold uppercase">
                  {isSaving ? 'ĐANG LƯU...' : (isEditMode ? 'CHẾ ĐỘ CHỈNH SỬA' : 'DỮ LIỆU ĐÃ AN TOÀN')}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-6 py-2 rounded-full text-[10px] font-bold transition-all border-2 ${isEditMode ? 'bg-white border-white text-stone-900 shadow-xl scale-105' : 'bg-transparent border-stone-700 text-stone-400 hover:border-amber-600 hover:text-amber-600'}`}
            >
              {isEditMode ? 'HOÀN TẤT & XEM TRANG' : 'BẮT ĐẦU CHỈNH SỬA'}
            </button>
          </div>
          
          <div className="flex gap-4">
            {isEditMode && (
              <>
                <button 
                  onClick={resetToDefault}
                  className="text-stone-600 hover:text-red-500 transition-colors text-[10px] font-bold uppercase px-2"
                >
                  Xóa sạch bộ nhớ
                </button>
                <button 
                  onClick={() => setShowExportModal(true)}
                  className="bg-amber-600 text-white px-6 py-2 rounded-full text-[10px] font-bold hover:bg-amber-500 transition-all shadow-xl flex items-center gap-2 border border-amber-500"
                >
                  <i className="fas fa-tools"></i> CẤU HÌNH & QUẢN LÝ DỮ LIỆU
                </button>
              </>
            )}
          </div>
        </div>

        {/* Modal Quản lý & Cấu hình Sheet */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-10 shadow-2xl border border-stone-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-amber-600"></div>
              <button 
                onClick={() => setShowExportModal(false)}
                className="absolute top-6 right-6 text-stone-400 hover:text-stone-900"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
              
              <h3 className="text-2xl font-serif font-bold text-stone-900 mb-6 uppercase text-center">Cấu hình hệ thống</h3>
              
              <div className="space-y-8">
                {/* PHẦN QUAN TRỌNG: Cấu hình Google Sheet */}
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-lg flex items-center justify-center shadow-md">
                      <i className="fas fa-table"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-800 text-sm uppercase">Kết nối Google Trang Tính</h4>
                      <p className="text-[10px] text-stone-500">Thông tin khách hàng sẽ được gửi về đây</p>
                    </div>
                  </div>
                  <input 
                    type="text"
                    value={content.googleSheetUrl}
                    onChange={(e) => updateContent('googleSheetUrl', e.target.value)}
                    placeholder="Dán link Google Script của bạn vào đây..."
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs font-mono focus:ring-2 focus:ring-green-500/20 outline-none"
                  />
                  <p className="mt-2 text-[9px] text-stone-400 italic font-medium">
                    * Lưu ý: Link này giúp Form Liên Hệ hoạt động thực tế.
                  </p>
                </div>

                {/* Import/Export Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border border-stone-200 rounded-2xl hover:border-amber-500 transition-colors group cursor-pointer" onClick={downloadFullCode}>
                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                      <i className="fas fa-download"></i>
                    </div>
                    <h4 className="font-bold text-stone-900 text-xs mb-1 uppercase">Xuất File content.ts</h4>
                    <p className="text-stone-500 text-[10px]">Tải dữ liệu hiện tại về máy để lưu trữ vĩnh viễn.</p>
                  </div>

                  <div className="p-6 border border-stone-200 rounded-2xl hover:border-blue-500 transition-colors group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                      <i className="fas fa-upload"></i>
                    </div>
                    <h4 className="font-bold text-stone-900 text-xs mb-1 uppercase">Nạp dữ liệu từ máy</h4>
                    <p className="text-stone-500 text-[10px]">Chọn file content.ts để khôi phục lại ảnh và nội dung cũ.</p>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImportFile}
                      className="hidden" 
                      accept=".ts,.js,.json"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-10 flex justify-center">
                <button 
                  onClick={() => setShowExportModal(false)}
                  className="bg-stone-900 text-white px-10 py-3 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-amber-600 transition-all shadow-lg"
                >
                  Quay lại chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ContentContext.Provider>
  );
};

export default App;
