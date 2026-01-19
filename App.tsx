
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

// --- Cấu hình IndexedDB để lưu trữ dữ liệu lớn (ảnh Base64) ---
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
  // Trạng thái Admin & Bảo mật
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  
  // Trạng thái Chỉnh sửa & Dữ liệu
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
        // 1. Khôi phục dữ liệu đã sửa từ IndexedDB (nếu có)
        const saved = await getFromDB();
        if (saved) {
          setContent(saved);
          setHasChanges(true);
          const now = new Date();
          setLastSaved(`Khôi phục lúc ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
        }

        // 2. Kiểm tra xem người dùng đã đăng nhập Admin trước đó chưa
        const auth = localStorage.getItem('bakhoat_admin_auth');
        if (auth === 'true') {
          setIsAdmin(true);
        }

        // 3. Kiểm tra URL bí mật để hiện khung đăng nhập
        const params = new URLSearchParams(window.location.search);
        if (params.get('admin') === 'true' || params.get('mode') === 'admin') {
          if (auth !== 'true') {
            setShowLogin(true);
          }
        }
      } catch (e) {
        console.error("Lỗi khởi tạo:", e);
      } finally {
        setIsReady(true);
      }
    };
    init();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPass = 'bakhoat123'; 
    if (passwordInput === adminPass) {
      setIsAdmin(true);
      setShowLogin(false);
      localStorage.setItem('bakhoat_admin_auth', 'true');
      alert("Xác thực CHỦ SỞ HỮU thành công!");
    } else {
      alert("Mật khẩu không chính xác.");
    }
  };

  const handleLogout = () => {
    if (confirm("Đăng xuất khỏi quyền quản trị?")) {
      setIsAdmin(false);
      setIsEditMode(false);
      localStorage.removeItem('bakhoat_admin_auth');
      window.location.href = window.location.pathname;
    }
  };

  const updateContent = async (key: string, value: any) => {
    if (!isAdmin) return;
    
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
        const now = new Date();
        setLastSaved(`Lưu lúc ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
        setTimeout(() => setIsSaving(false), 500);
      }).catch(err => {
        console.error("Lỗi lưu DB:", err);
        setIsSaving(false);
      });

      return newContent;
    });
  };

  // Hàm xử lý khi người dùng chọn file để nhập dữ liệu
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        let jsonStr = text;

        // Nếu là file .ts (có chứa export const initialContent)
        if (text.includes('export const initialContent')) {
          const startIdx = text.indexOf('{');
          const endIdx = text.lastIndexOf('}');
          jsonStr = text.substring(startIdx, endIdx + 1);
        }

        const importedData = JSON.parse(jsonStr);
        if (importedData && typeof importedData === 'object') {
          await saveToDB(importedData);
          setContent(importedData);
          setHasChanges(true);
          const now = new Date();
          setLastSaved(`Nhập từ file lúc ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
          alert("Nhập dữ liệu THÀNH CÔNG! Website đã được khôi phục từ file của bạn.");
          setShowExportModal(false);
        }
      } catch (err) {
        console.error("Import error:", err);
        alert("Lỗi: File không đúng định dạng. Vui lòng sử dụng file content.ts hoặc .json hợp lệ.");
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
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetToDefault = async () => {
    if (confirm("Xóa toàn bộ chỉnh sửa tạm thời và quay về dữ liệu gốc?")) {
      await clearDB();
      window.location.reload();
    }
  };

  if (!isReady) return <div className="h-screen bg-stone-900 flex items-center justify-center"><i className="fas fa-gem animate-pulse text-amber-600 text-5xl"></i></div>;

  return (
    <ContentContext.Provider value={{ content, isEditMode, updateContent }}>
      <div className="min-h-screen bg-stone-texture selection:bg-amber-200 scroll-smooth pb-20">
        
        {/* Banner thông báo dữ liệu tạm thời - CHỈ ADMIN THẤY */}
        {hasChanges && isAdmin && !isEditMode && (
          <div className="bg-amber-700 text-white text-[9px] py-1.5 px-4 text-center font-bold uppercase tracking-[0.2em] fixed top-0 left-0 right-0 z-[60] shadow-lg flex items-center justify-center gap-3">
            <i className="fas fa-info-circle"></i>
            <span>Dữ liệu đã sửa (Chỉ mình bạn thấy)</span>
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

        {/* --- KHU VỰC ADMIN (CHỈ HIỆN KHI ĐÃ ĐĂNG NHẬP) --- */}
        {isAdmin && (
          <div className="fixed bottom-0 left-0 right-0 bg-stone-950/95 border-t border-stone-800 p-4 z-[100] flex justify-between items-center px-8 shadow-2xl backdrop-blur-xl animate-slide-up">
            <div className="flex items-center gap-6">
              <div className="flex flex-col min-w-[140px]">
                <span className="text-stone-500 text-[9px] font-bold uppercase tracking-widest mb-1">CHỦ SỞ HỮU</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isSaving ? 'bg-green-400 animate-ping' : (isEditMode ? 'bg-blue-500' : 'bg-green-500')}`}></div>
                  <span className="text-white text-[10px] font-bold uppercase">
                    {isSaving ? 'ĐANG LƯU...' : (isEditMode ? 'CHẾ ĐỘ SỬA ĐANG BẬT' : 'CHẾ ĐỘ XEM TRƯỚC')}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-6 py-2 rounded-full text-[10px] font-bold transition-all border-2 ${isEditMode ? 'bg-white border-white text-stone-900 shadow-xl scale-105' : 'bg-transparent border-stone-700 text-stone-400 hover:border-amber-600 hover:text-amber-600'}`}
              >
                {isEditMode ? 'HOÀN TẤT CHỈNH SỬA' : 'BẬT CHỈNH SỬA NHANH'}
              </button>
            </div>
            
            <div className="flex gap-4 items-center">
              {/* Nút QUẢN LÝ DỮ LIỆU luôn hiện cho Admin */}
              <button 
                onClick={() => setShowExportModal(true)}
                className="bg-amber-600 text-white px-6 py-2 rounded-full text-[10px] font-bold hover:bg-amber-500 shadow-xl flex items-center gap-2 border border-amber-500"
              >
                <i className="fas fa-sync-alt"></i> QUẢN LÝ DỮ LIỆU
              </button>

              {isEditMode && (
                <button onClick={resetToDefault} className="text-stone-600 hover:text-red-500 text-[10px] font-bold uppercase px-2">Xóa sửa đổi</button>
              )}
              
              <button onClick={handleLogout} className="w-10 h-10 bg-stone-900 text-stone-500 hover:text-white rounded-full transition-colors flex items-center justify-center" title="Đăng xuất Admin">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        )}

        {/* --- MODAL ĐĂNG NHẬP --- */}
        {showLogin && (
          <div className="fixed inset-0 bg-stone-900/98 z-[300] flex items-center justify-center p-4 backdrop-blur-xl animate-fade-in">
            <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl border border-stone-200">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-stone-900 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-stone-100">
                  <i className="fas fa-user-shield text-2xl"></i>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900 uppercase tracking-widest">Quyền Sở Hữu</h3>
                <p className="text-stone-400 text-[10px] mt-2 uppercase tracking-widest font-bold">Khu vực dành cho quản trị viên</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <input 
                  autoFocus
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-5 py-4 text-center text-lg outline-none focus:ring-2 focus:ring-amber-500/20 transition-all font-mono shadow-inner"
                />
                <button type="submit" className="w-full bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-amber-600 transition-all uppercase tracking-widest text-xs shadow-lg">Xác nhận</button>
                <button type="button" onClick={() => setShowLogin(false)} className="w-full text-stone-400 text-[10px] font-bold uppercase tracking-widest mt-4 hover:text-stone-600 transition-colors">Vào trang với khách</button>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL QUẢN LÝ DỮ LIỆU (XUẤT / NHẬP) --- */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-10 shadow-2xl relative border border-stone-200">
              <button onClick={() => setShowExportModal(false)} className="absolute top-6 right-6 text-stone-400 hover:text-stone-900"><i className="fas fa-times text-xl"></i></button>
              <h3 className="text-2xl font-serif font-bold text-stone-900 mb-8 uppercase text-center tracking-tight">Quản Lý Dữ Liệu Website</h3>
              
              <div className="bg-amber-50 p-5 rounded-2xl border-l-4 border-amber-500 mb-8 text-amber-900 text-xs leading-relaxed">
                <p className="font-bold mb-2 uppercase">Hướng dẫn sử dụng:</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li><b>Xuất dữ liệu:</b> Tải bản thảo hiện tại về máy tính để sao lưu hoặc gửi cho GitHub.</li>
                  <li><b>Nhập dữ liệu:</b> Chọn file <i>content.ts</i> cũ từ máy bạn để nạp lại toàn bộ nội dung cho website này.</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* CỘT XUẤT */}
                <div className="p-8 border-2 border-stone-100 rounded-2xl bg-white cursor-pointer text-center group transition-all hover:border-amber-500 hover:shadow-xl" onClick={downloadFullCode}>
                  <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform"><i className="fas fa-file-download"></i></div>
                  <h4 className="font-bold text-stone-900 text-xs uppercase mb-2">1. Xuất file content.ts</h4>
                  <p className="text-stone-500 text-[10px]">Lưu bản thảo về máy</p>
                </div>

                {/* CỘT NHẬP */}
                <div className="p-8 border-2 border-stone-100 rounded-2xl bg-white cursor-pointer text-center group transition-all hover:border-blue-500 hover:shadow-xl" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform"><i className="fas fa-file-upload"></i></div>
                  <h4 className="font-bold text-stone-900 text-xs uppercase mb-2">2. Nhập dữ liệu cũ</h4>
                  <p className="text-stone-500 text-[10px]">Tải file từ máy lên trang này</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImportFile} 
                    className="hidden" 
                    accept=".ts,.json" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ContentContext.Provider>
  );
};

export default App;
