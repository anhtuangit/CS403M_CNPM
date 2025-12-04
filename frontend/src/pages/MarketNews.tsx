import { useState } from 'react';

const mockNews = [
  {
    id: 1,
    title: 'Thị trường căn hộ TP.HCM quý 4/2024: Giá đi ngang, thanh khoản tăng nhẹ',
    summary: 'Nguồn cung mới chủ yếu tập trung ở phân khúc cao cấp khu vực Thủ Đức. Lãi suất thả nổi giảm kích thích người mua thực quay lại thị trường.',
    category: 'Thị trường',
    image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    date: '02/12/2024',
    author: 'Minh Tuấn'
  },
  {
    id: 2,
    title: 'Luật Đất đai sửa đổi: Những điểm mới người mua nhà cần biết',
    summary: 'Quy định mới về bỏ khung giá đất và cấp sổ hồng cho condotel đang là tâm điểm chú ý của giới đầu tư trong năm nay.',
    category: 'Pháp lý',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    date: '30/11/2024',
    author: 'Luật sư Hùng'
  },
  {
    id: 3,
    title: 'Top 5 xu hướng thiết kế nội thất "chữa lành" lên ngôi năm 2025',
    summary: 'Phong cách Japandi kết hợp với vật liệu bền vững đang trở thành lựa chọn hàng đầu cho các gia đình trẻ thành đạt.',
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    date: '28/11/2024',
    author: 'Design Team'
  },
  {
    id: 4,
    title: 'Lãi suất vay mua nhà các ngân hàng Big4 tiếp tục giảm sâu',
    summary: 'Cập nhật bảng lãi suất tháng 12: Vietcombank, BIDV tung gói ưu đãi cố định 6% trong 2 năm đầu.',
    category: 'Tài chính',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    date: '25/11/2024',
    author: 'Thu Hương'
  },
];

const categories = ['Tất cả', 'Thị trường', 'Pháp lý', 'Tài chính', 'Lifestyle', 'Phong thủy'];

const MarketNews = () => {
  const [activeCat, setActiveCat] = useState('Tất cả');

  const filteredNews = activeCat === 'Tất cả'
    ? mockNews
    : mockNews.filter(n => n.category === activeCat);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">

      <div className="bg-white border-b border-slate-200 pt-12 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Tin tức & Thị trường</h1>
          <p className="text-slate-500 text-lg">Cập nhật những thông tin nóng hổi và góc nhìn chuyên sâu về bất động sản.</p>

          <div className="flex gap-2 mt-8 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeCat === cat
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {filteredNews.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8 mb-12 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="rounded-2xl overflow-hidden h-64 md:h-96">
              <img src={filteredNews[0].image} alt="Featured" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-blue-600 font-bold uppercase text-xs tracking-wider mb-2">{filteredNews[0].category}</span>
              <h2 className="text-3xl font-bold text-slate-800 mb-4 hover:text-blue-600 cursor-pointer leading-tight">
                {filteredNews[0].title}
              </h2>
              <p className="text-slate-500 mb-6 line-clamp-3 leading-relaxed">
                {filteredNews[0].summary}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                    {filteredNews[0].author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{filteredNews[0].author}</p>
                    <p className="text-xs text-slate-400">{filteredNews[0].date}</p>
                  </div>
                </div>
                <button className="text-blue-600 font-semibold text-sm hover:underline">Đọc tiếp &rarr;</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.slice(1).map((news) => (
            <article key={news.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300">
              <div className="h-48 overflow-hidden relative">
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full z-10">
                  {news.category}
                </span>
                <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 hover:text-blue-600 cursor-pointer">
                  {news.title}
                </h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">
                  {news.summary}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-50">
                  <span>{news.date}</span>
                  <span>Bởi {news.author}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -ml-16 -mb-16"></div>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Đăng ký nhận tin tức mới nhất</h2>
            <p className="text-slate-300 mb-8 max-w-lg mx-auto">Không bỏ lỡ cơ hội đầu tư. Nhận phân tích thị trường hàng tuần trực tiếp vào email của bạn.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition">Đăng ký</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarketNews;