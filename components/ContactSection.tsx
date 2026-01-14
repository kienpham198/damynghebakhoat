
import React, { useState, useContext } from 'react';
import { ContentContext } from '../App';

const ContactSection: React.FC = () => {
  const context = useContext(ContentContext);
  const [formData, setFormData] = useState({ name: '', phone: '', province: '', message: '' });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = 
    formData.name.trim() !== '' && 
    formData.phone.trim().length >= 10 && 
    formData.province.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const googleSheetUrl = context?.content.googleSheetUrl;
      
      if (googleSheetUrl) {
        // Cấu trúc payload chuẩn xác theo 5 yêu cầu bắt buộc
        const payload = {
          "Date of issue": new Date().toLocaleString('vi-VN', { hour12: false }),
          "Name": formData.name,
          "Phone number": formData.phone,
          "City of implementation": formData.province,
          "Content of request": formData.message
        };

        // Gửi dữ liệu theo phương thức POST
        await fetch(googleSheetUrl, {
          method: 'POST',
          mode: 'no-cors', // Sử dụng no-cors để tránh lỗi CORS với Google Apps Script
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } else {
        console.warn("Chưa cấu hình Google Sheet URL trong Chế độ quản trị.");
      }
      
      setIsSuccess(true);
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      alert("Có lỗi xảy ra. Quý khách vui lòng gọi hotline " + context?.content.hotline + " để được hỗ trợ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePopup = () => {
    setIsSuccess(false);
    setFormData({ name: '', phone: '', province: '', message: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-stone-900 text-white p-8 lg:p-16 rounded-2xl shadow-2xl relative border border-stone-800">
      {/* Success Popup */}
      {isSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-stone-900 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl scale-up border-t-8 border-amber-600">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check text-4xl"></i>
            </div>
            <h3 className="text-2xl font-serif font-bold mb-4 uppercase tracking-wide">Gửi thông tin thành công!</h3>
            <p className="text-stone-600 mb-8 leading-relaxed">
              Dữ liệu của Quý khách đã được chúng tôi ghi nhận. Chúng tôi sẽ liên hệ lại ngay qua hotline:
              <span className="text-amber-600 font-bold block text-2xl mt-2 tracking-widest">{context?.content.hotline}</span>
            </p>
            <button 
              onClick={closePopup}
              className="w-full bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-800 transition-all uppercase tracking-widest shadow-lg"
            >
              Đồng ý
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-4xl font-serif font-bold mb-8 text-amber-500 flex items-center gap-3">
          <span className="w-12 h-[2px] bg-amber-600 inline-block"></span>
          Liên Hệ Báo Giá
        </h2>
        <p className="text-stone-400 mb-10 leading-relaxed text-lg">
          Để nhận được báo giá chi tiết và bản vẽ phối cảnh 3D miễn phí, Quý khách vui lòng để lại thông tin bên dưới.
        </p>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-stone-800 flex items-center justify-center rounded-lg text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-md">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div>
              <p className="text-xs uppercase text-stone-500 tracking-widest font-bold">Địa chỉ xưởng</p>
              <p className="font-bold text-stone-200">Làng nghề đá Ninh Vân, Hoa Lư, Ninh Bình</p>
            </div>
          </div>
          <a href={`tel:${context?.content.hotline.replace(/\./g, '')}`} className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 bg-stone-800 flex items-center justify-center rounded-lg text-amber-500 group-hover:bg-red-600 group-hover:text-white transition-all shadow-md">
              <i className="fas fa-phone"></i>
            </div>
            <div>
              <p className="text-xs uppercase text-stone-500 tracking-widest font-bold">Điện thoại hỗ trợ 24/7</p>
              <p className="font-bold text-amber-500 text-xl tracking-wider">{context?.content.hotline}</p>
            </div>
          </a>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-stone-800 flex items-center justify-center rounded-lg text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-md">
              <i className="fas fa-envelope"></i>
            </div>
            <div>
              <p className="text-xs uppercase text-stone-500 tracking-widest font-bold">Email báo giá</p>
              <p className="font-bold text-stone-200">{context?.content.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-stone-50 text-stone-900 p-8 rounded-xl shadow-2xl border-l-8 border-amber-600 scroll-mt-32" id="contact-inputs">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-tight">Họ và Tên <span className="text-red-500">*</span></label>
              <input 
                required
                disabled={isSubmitting}
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white border border-stone-200 rounded-lg p-3.5 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all disabled:opacity-50" 
                placeholder="Ví dụ: Nguyễn Văn A" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-tight">Số điện thoại <span className="text-red-500">*</span></label>
              <input 
                required
                disabled={isSubmitting}
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-white border border-stone-200 rounded-lg p-3.5 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all disabled:opacity-50" 
                placeholder="09xxx..." 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-tight">Tỉnh thành thi công <span className="text-red-500">*</span></label>
            <input 
              required
              disabled={isSubmitting}
              type="text" 
              value={formData.province}
              onChange={(e) => setFormData({...formData, province: e.target.value})}
              className="w-full bg-white border border-stone-200 rounded-lg p-3.5 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all disabled:opacity-50" 
              placeholder="Ví dụ: Hà Nội, Nam Định, Thanh Hóa..." 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-tight">Nội dung yêu cầu</label>
            <textarea 
              rows={3} 
              disabled={isSubmitting}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full bg-white border border-stone-200 rounded-lg p-3.5 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all disabled:opacity-50" 
              placeholder="Quý khách cần tư vấn mẫu lăng mộ nào?"
            ></textarea>
          </div>
          <button 
            type="submit" 
            disabled={!isValid || isSubmitting}
            className={`w-full font-bold py-4 rounded-xl uppercase tracking-widest transition-all shadow-xl text-sm ${
              isValid && !isSubmitting
              ? 'bg-amber-600 text-white hover:bg-amber-700 active:scale-[0.98]' 
              : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Đang gửi...' : (isValid ? 'Nhận Báo Giá Ngay' : 'Vui lòng điền đủ thông tin')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactSection;
