
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

// --- Cấu hình IndexedDB ---
const dbName = 'BakhoatDB';
const storeName = 'contentStore';
const dbKey = 'current_content';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveToDB = async (data: SiteContent) => {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data, dbKey);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const getFromDB = async (): Promise<SiteContent | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(dbKey);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

const clearDB = async () => {
  const db = await openDB();
  const transaction = db.transaction(storeName, 'readwrite');
  transaction.objectStore(storeName).delete(dbKey);
};

interface ContentContextType {
  content: SiteContent;
  isEditMode: boolean;
  updateContent: (key: string, value: any) => void;
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState<SiteContent>(initialContent);

  useEffect(() => {
    const init = async () => {
      try {
        const saved = await getFromDB();
        if (saved) {
          setContent(saved);
          setHasChanges(true);
          setLastSaved(`Đã tải bản lưu ${new Date().toLocaleTimeString('vi-VN')}`);
        }
        const auth = localStorage.getItem('bakhoat_admin_auth');
        if (auth === 'true') setIsAdmin(true);
        const params = new URLSearchParams(window.location.search);
        if (params.get('admin') === 'true') {
          if (auth !== 'true') setShowLogin(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsReady(true);
      }
    };
    init();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'bakhoat123') {
      setIsAdmin(true);
      setShowLogin(false);
      localStorage.setItem('bakhoat_admin_auth', 'true');
    } else {
      alert("Sai mật khẩu.");
    }
  };

  const handleLogout = () => {
    if (confirm("Đăng xuất?")) {
      setIsAdmin(false);
      localStorage.removeItem('bakhoat_admin_auth');
      window.location.href = window.location.pathname;
    }
  };

  const updateContent = async (key: string, value: any) => {
    setIsSaving(true);
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev));
      const parts = key.split('.');
      let current = newContent;
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      saveToDB(newContent).then(() => {
        setHasChanges(true);
        setLastSaved(`Đã lưu ${new Date().toLocaleTimeString('vi-VN')}`);
        setTimeout(() => setIsSaving(false), 500);
      });
      return newContent;
    });
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        let jsonStr = text;
        if (text.includes('export const initialContent')) {
          const startIdx = text.indexOf('{');
          const endIdx = text.lastIndexOf('}');
          jsonStr = text.substring(startIdx, endIdx + 1);
        }
        const importedData = JSON.parse(jsonStr);
        await saveToDB(importedData);
        setContent(importedData);
        setHasChanges(true);
        alert("Khôi phục dữ liệu thành công! Website đã cập nhật theo file của bạn.");
        setShowExportModal(false);
      } catch (err) {
        alert("Lỗi: File không đúng định dạng content.ts");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const downloadFullCode = () => {
    const fileContent = `import { SiteContent } from './types';\n\nexport const initialContent: SiteContent = ${JSON.stringify(content, null, 2)};`;
    const blob = new Blob([fileContent], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.ts';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isReady) return <div className="h-screen bg-stone-900 flex items-center justify-center text-amber-500"><i className="fas fa-gem animate-pulse text-5xl"></i></div>;

  return (
    <ContentContext.Provider value={{ content, isEditMode, updateContent }}>
      <div className="min-h-screen bg-stone-texture selection:bg-amber-200 scroll-smooth pb-20">
        
        {hasChanges && isAdmin && (
          <div className="bg-amber-700 text-white text-[10px] py-1 px-4 text-center fixed top-0 left-0 right-0 z-[60] shadow-lg flex items-center justify-center gap-2">
            <i className="fas fa-cloud-upload-alt"></i>
            <span className="font-bold uppercase tracking-widest">{lastSaved}</span>
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

        {/* --- THANH ĐIỀU KHIỂN ADMIN --- */}
        {isAdmin && (
          <div className="fixed bottom-0 left-0 right-0 bg-stone-950/95 border-t border-stone-800 p-4 z-[100] flex justify-between items-center px-8 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                 <span className="text-stone-500 text-[9px] font-bold uppercase tracking-widest">Chủ sở hữu</span>
                 <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${isEditMode ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
                   <span className="text-white text-[10px] font-bold uppercase">{isEditMode ? 'Chế độ sửa đang bật' : 'Chế độ xem trước'}</span>
                 </div>
              </div>
              <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-6 py-2 rounded-full text-[10px] font-bold transition-all border-2 ${isEditMode ? 'bg-white border-white text-stone-900 shadow-xl' : 'bg-transparent border-stone-700 text-stone-400 hover:text-white'}`}
              >
                {isEditMode ? 'HOÀN TẤT CHỈNH SỬA' : 'BẬT CHỈNH SỬA NHANH'}
              </button>
            </div>
            
            <div className="flex gap-4 items-center">
              {/* NÚT MÀU CAM GIỐNG TRONG ẢNH */}
              <button 
                onClick={() => setShowExportModal(true)}
                className="bg-[#e67e22] text-white px-6 py-2 rounded-full text-[10px] font-bold hover:bg-[#d35400] shadow-lg flex items-center gap-2 border border-[#d35400]/20"
              >
                <i className="fas fa-database"></i> QUẢN LÝ DỮ LIỆU
              </button>
              
              <button onClick={handleLogout} className="w-10 h-10 bg-stone-900 text-stone-500 hover:text-red-500 rounded-full flex items-center justify-center transition-colors">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        )}

        {/* --- MODAL QUẢN LÝ DỮ LIỆU (ĐỒNG BỘ DỮ LIỆU) --- */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-10 shadow-2xl relative overflow-y-auto max-h-[90vh]">
              <button onClick={() => setShowExportModal(false)} className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
              
              <h3 className="text-2xl font-serif font-bold text-stone-900 mb-8 text-center uppercase tracking-tight">Quản Lý & Đồng Bộ Dữ Liệu</h3>
              
              {/* PHẦN CẤU HÌNH GOOGLE SHEET */}
              <div className="mb-10 p-6 bg-stone-50 rounded-2xl border border-stone-100 shadow-inner">
                <h4 className="text-stone-900 font-bold text-xs uppercase mb-3 flex items-center gap-2">
                  <i className="fas fa-link text-amber-600"></i> 1. Liên kết Google Trang Tính
                </h4>
                <p className="text-[10px] text-stone-500 mb-4 leading-relaxed">
                  Dán đường dẫn <b>"Web App URL"</b> từ Google App Script vào đây để thông tin khách hàng tự động gửi về trang tính của bạn.
                </p>
                <input 
                  type="text" 
                  placeholder="https://script.google.com/macros/s/..."
                  value={content.googleSheetUrl}
                  onChange={(e) => updateContent('googleSheetUrl', e.target.value)}
                  className="w-full p-4 border border-stone-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
                <div className="mt-2 flex justify-between items-center">
                   <span className="text-[9px] text-amber-700 font-bold uppercase tracking-widest">
                     {content.googleSheetUrl ? '● Đã kết nối' : '○ Chưa có liên kết'}
                   </span>
                </div>
              </div>

              {/* PHẦN XUẤT / NHẬP FILE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 border-2 border-dashed border-stone-100 rounded-2xl text-center hover:border-amber-500 hover:bg-amber-50/30 transition-all cursor-pointer group" onClick={downloadFullCode}>
                  <div className="w-14 h-14 bg-[#e67e22] text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <i className="fas fa-file-download text-xl"></i>
                  </div>
                  <h5 className="font-bold text-stone-900 text-xs uppercase mb-2">Tải file content.ts</h5>
                  <p className="text-[10px] text-stone-400">Lưu bản thảo hiện tại về máy tính</p>
                </div>

                <div className="p-8 border-2 border-dashed border-stone-100 rounded-2xl text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <i className="fas fa-file-upload text-xl"></i>
                  </div>
                  <h5 className="font-bold text-stone-900 text-xs uppercase mb-2">Nhập dữ liệu cũ</h5>
                  <p className="text-[10px] text-stone-400">Khôi phục nội dung từ file trên máy</p>
                  <input type="file" ref={fileInputRef} onChange={handleImportFile} className="hidden" accept=".ts,.json" />
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-stone-100 flex justify-center">
                <button 
                  onClick={() => setShowExportModal(false)}
                  className="bg-stone-900 text-white px-10 py-3 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-stone-800 transition-all shadow-xl"
                >
                  Hoàn tất cấu hình
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL ĐĂNG NHẬP (Giữ nguyên) */}
        {showLogin && (
          <div className="fixed inset-0 bg-stone-950/95 z-[300] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-stone-900 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-user-shield text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold font-serif uppercase">Xác nhận Admin</h3>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <input 
                  autoFocus
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full border border-stone-200 p-4 rounded-xl text-center font-mono outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button type="submit" className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-amber-600 transition-all">Xác nhận</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </ContentContext.Provider>
  );
};

export default App;
