import { FacebookIcon } from '../icons/IconFacebook';
import { InstagramIcon } from '../icons/IconIntagram';
import { TwitterIcon } from '../icons/IconX';
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">BDS Marketplace</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Nền tảng công nghệ kết nối người mua và người bán bất động sản hàng đầu. Minh bạch, nhanh chóng và hiệu quả.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                <FacebookIcon />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                <InstagramIcon />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                <TwitterIcon />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Khám phá</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Nhà phố bán</Link></li>
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Căn hộ cho thuê</Link></li>
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Dự án mới</Link></li>
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Đất nền</Link></li>
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Tin tức thị trường</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Hỗ trợ</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Quy định đăng tin</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Giải quyết khiếu nại</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Liên hệ</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Tòa nhà Tech Tower, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>(028) 7300 9999</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <a href="mailto:support@example.com" className="hover:text-white transition-colors">support@example.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} BDS Marketplace. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Quyền riêng tư</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;