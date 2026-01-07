
import React from 'react';

const Footer: React.FC = () => {
  const disableLink = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <footer className="bg-stone-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-stone-800 pb-12">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-600 p-2 rounded">
                 <i className="fas fa-gem text-xl"></i>
              </div>
              <h2 className="text-xl font-bold font-serif uppercase tracking-widest">Bá Khoát</h2>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              Đơn vị hàng đầu trong lĩnh vực thiết kế, thi công các công trình tâm linh bằng đá tự nhiên tại Việt Nam.
            </p>
            <div className="flex gap-4">
              <a href="#!" onClick={disableLink} className="w-10 h-10 bg-stone-900 flex items-center justify-center rounded-full hover:bg-amber-600 transition-colors"><i className="fab fa-facebook-f"></i></a>
              <a href="#!" onClick={disableLink} className="w-10 h-10 bg-stone-900 flex items-center justify-center rounded-full hover:bg-amber-600 transition-colors"><i className="fab fa-youtube"></i></a>
              <a href="#!" onClick={disableLink} className="w-10 h-10 bg-stone-900 flex items-center justify-center rounded-full hover:bg-amber-600 transition-colors"><i className="fab fa-tiktok"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-amber-500">Danh Mục Sản Phẩm</h3>
            <ul className="space-y-4 text-stone-400 text-sm">
              <li><a href="#!" onClick={disableLink} className="hover:text-white transition-colors">Mộ Đá Xanh Rêu</a></li>
              <li><a href="#!" onClick={disableLink} className="hover:text-white transition-colors">Lăng Thờ Đá 3 Mái</a></li>
              <li><a href="#!" onClick={disableLink} className="hover:text-white transition-colors">Bình Phong Đá</a></li>
              <li><a href="#!" onClick={disableLink} className="hover:text-white transition-colors">Kiến Trúc Đình Chùa</a></li>
              <li><a href="#!" onClick={disableLink} className="hover:text-white transition-colors">Mộ Đá Granite</a></li>
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-amber-500">Hỗ Trợ Khách Hàng</h3>
            <ul className="space-y-4 text-stone-400 text-sm">
              <li><a href="#!" onClick={disableLink} className="hover:text-white transition-colors">Tư Vấn Phong Thủy</a></li>
              <li><a href="#!" onClick={disableLink} className="hover:text-white transition-colors">Quy Trình Thi Công</a></li>
              <li><a href="#!" onClick={disableLink} className="hover:text-white transition-colors">Báo Giá Vận Chuyển</a></li>
              <li><a href="#!" onClick={disableLink} className="hover:text-white transition-colors">Chính Sách Bảo Hành</a></li>
              <li><a href="#!" onClick={disableLink} className="hover:text-white transition-colors">Kích Thước Lỗ Ban</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-amber-500">Đăng Ký Nhận Tin</h3>
            <p className="text-stone-400 text-sm mb-4">Nhận báo giá mới nhất và các mẫu mộ đẹp qua email.</p>
            <div className="flex">
              <input type="email" className="bg-stone-900 border-none rounded-l px-4 py-2 w-full focus:ring-0" placeholder="Email của bạn" />
              <button className="bg-amber-600 px-4 py-2 rounded-r hover:bg-amber-700 transition-colors">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-stone-500 text-xs gap-4">
          <p>© 2024 Mộ Đá Bá Khoát. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#!" onClick={disableLink} className="hover:text-white">Chính sách bảo mật</a>
            <a href="#!" onClick={disableLink} className="hover:text-white">Điều khoản sử dụng</a>
            <p>Thiết kế bởi <span className="text-amber-600">KienKirito</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
