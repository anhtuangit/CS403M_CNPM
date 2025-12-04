import { Link } from 'react-router-dom';

// --- Icons ---
const CheckBadgeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const UserGroupIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);
const LightBulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
);

const About = () => {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-600">

      {/* --- HERO SECTION --- */}
      <div className="relative bg-slate-900 py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Office" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Kiến tạo Không gian sống <br /> <span className="text-blue-500">Nâng tầm giá trị</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Chúng tôi không chỉ kết nối giao dịch bất động sản, chúng tôi xây dựng niềm tin và đồng hành cùng bạn trên hành trình tìm kiếm ngôi nhà mơ ước.
          </p>
        </div>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="text-center p-4 border-b md:border-b-0 md:border-r border-slate-100">
            <p className="text-4xl font-extrabold text-blue-600">5,000+</p>
            <p className="text-sm uppercase tracking-wide text-slate-500 mt-2 font-semibold">Tin đăng thành công</p>
          </div>
          <div className="text-center p-4 border-b md:border-b-0 md:border-r border-slate-100">
            <p className="text-4xl font-extrabold text-blue-600">12,000+</p>
            <p className="text-sm uppercase tracking-wide text-slate-500 mt-2 font-semibold">Người dùng tin tưởng</p>
          </div>
          <div className="text-center p-4">
            <p className="text-4xl font-extrabold text-blue-600">98%</p>
            <p className="text-sm uppercase tracking-wide text-slate-500 mt-2 font-semibold">Khách hàng hài lòng</p>
          </div>
        </div>
      </div>

      {/* --- VALUES SECTION --- */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Giá trị cốt lõi</h2>
            <p className="max-w-2xl mx-auto text-slate-500">Tại BDS Marketplace, mọi hoạt động đều xoay quanh 3 trụ cột chính giúp mang lại trải nghiệm tốt nhất.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="bg-slate-50 p-8 rounded-2xl hover:bg-blue-50 transition-colors duration-300 group text-center">
              <div className="flex justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckBadgeIcon />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Minh bạch & Chính xác</h3>
              <p className="text-slate-500 leading-relaxed">
                Hệ thống kiểm duyệt tin đăng thủ công kết hợp AI để đảm bảo mọi thông tin đến tay bạn đều là thật và chính chủ.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-slate-50 p-8 rounded-2xl hover:bg-blue-50 transition-colors duration-300 group text-center">
              <div className="flex justify-center group-hover:scale-110 transition-transform duration-300">
                <UserGroupIcon />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Kết nối Cộng đồng</h3>
              <p className="text-slate-500 leading-relaxed">
                Tạo dựng cầu nối trực tiếp giữa người mua và người bán, loại bỏ các khâu trung gian không cần thiết để tối ưu chi phí.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-slate-50 p-8 rounded-2xl hover:bg-blue-50 transition-colors duration-300 group text-center">
              <div className="flex justify-center group-hover:scale-110 transition-transform duration-300">
                <LightBulbIcon />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Công nghệ Tiên phong</h3>
              <p className="text-slate-500 leading-relaxed">
                Ứng dụng dữ liệu lớn (Big Data) và công cụ tính toán tài chính giúp bạn đưa ra quyết định đầu tư sáng suốt nhất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="bg-blue-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Bạn đã sẵn sàng gia nhập cộng đồng?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Đăng ký tài khoản ngay hôm nay để nhận 3 tin đăng miễn phí và tiếp cận hàng ngàn khách hàng tiềm năng.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg">
              Đăng ký ngay
            </Link>
            <Link to="/properties" className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg border border-blue-500">
              Khám phá thị trường
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;