
import React, { useState, useContext } from 'react';
import { ContentContext } from '../App';

const ContactSection: React.FC = () => {
  const context = useContext(ContentContext);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation: Full name and Phone (10+ chars) are required
  const isValid = formData.name.trim() !== '' && formData.phone.trim().length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      setIsSuccess(true);
    }
  };

  const closePopup = () => {
    setIsSuccess(false);
    setFormData({ name: '', phone: '', message: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-stone-900 text-white p-8 lg:p-16 rounded-2xl shadow-2xl relative">
      {/* Success Popup */}
      {isSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-stone-900 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl scale-up">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check text-4xl"></i>
            </div>
            <h3 className="text-2xl font-serif font-bold mb-4">Gửi thông tin thành công!</h3>
            <p className="text-stone-600 mb-8 leading-relaxed">
              Chúng tôi sẽ liên hệ với bạn sớm nhất. Để có thể chủ động hơn bạn có thể liên hệ hotline 
              <a href="tel:0587750999" className="text-amber-600 font-bold block text-xl mt-2">0587.750.999</a>
            </p>
            <button 
              onClick={closePopup}
              className="w-full bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-800 transition-colors uppercase tracking-widest"
            >
              Đồng ý
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-4xl font-serif font-bold mb-8">Liên Hệ Báo Giá</h2>
        <p className="text-stone-400 mb-10 leading-relaxed">
          Quý khách đang có nhu cầu tư vấn thiết kế và thi công lăng mộ đá? Hãy để lại thông tin, đội ngũ kiến trúc sư tâm linh của chúng tôi sẽ liên hệ lại ngay trong 15 phút.
        </p>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-stone-800 flex items-center justify-center rounded-lg text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div>
              <p className="text-xs uppercase text-stone-500 tracking-widest">Địa chỉ xưởng</p>
              <p className="font-bold">Làng nghề đá Ninh Vân, Hoa Lư, Ninh Bình</p>
            </div>
          </div>
          <a href={`tel:${context?.content.hotline.replace(/\./g, '')}`} className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 bg-stone-800 flex items-center justify-center rounded-lg text-amber-500 group-hover:bg-red-600 group-hover:text-white transition-all">
              <i className="fas fa-phone"></i>
            </div>
            <div>
              <p className="text-xs uppercase text-stone-500 tracking-widest">Điện thoại</p>
              <p className="font-bold">{context?.content.hotline}</p>
            </div>
          </a>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-stone-800 flex items-center justify-center rounded-lg text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <i className="fas fa-envelope"></i>
            </div>
            <div>
              <p className="text-xs uppercase text-stone-500 tracking-widest">Email</p>
              <p className="font-bold">{context?.content.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white text-stone-900 p-8 rounded-xl shadow-inner scroll-mt-32" id="contact-inputs">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Họ và Tên <span className="text-red-500">*</span></label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-stone-50 border border-stone-200 rounded p-3 focus:outline-none focus:border-amber-600 transition-colors" 
              placeholder="Nguyễn Văn A" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
            <input 
              required
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-stone-50 border border-stone-200 rounded p-3 focus:outline-none focus:border-amber-600 transition-colors" 
              placeholder="09xx xxx xxx" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Nội dung yêu cầu</label>
            <textarea 
              rows={4} 
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full bg-stone-50 border border-stone-200 rounded p-3 focus:outline-none focus:border-amber-600 transition-colors" 
              placeholder="Quý khách cần tư vấn mẫu lăng mộ nào?"
            ></textarea>
          </div>
          <button 
            type="submit" 
            disabled={!isValid}
            className={`w-full font-bold py-4 rounded uppercase tracking-widest transition-all shadow-lg ${
              isValid 
              ? 'bg-amber-600 text-white hover:bg-amber-700 active:scale-95' 
              : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            {isValid ? 'Gửi Yêu Cầu Tư Vấn' : 'Vui lòng điền đủ Họ tên & SĐT'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactSection;
