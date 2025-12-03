const mockNews = [
  {
    title: 'Thị trường căn hộ TP.HCM ấm dần',
    summary: 'Nguồn cung mới tăng 15% so với quý trước, tập trung ở phân khúc cao cấp.',
    link: '#'
  },
  {
    title: 'Lãi suất vay mua nhà giảm nhẹ',
    summary: 'Các ngân hàng lớn đồng loạt giảm 0.5% để kích cầu mùa cuối năm.',
    link: '#'
  }
];

const MarketNews = () => {
  return (
    <section className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Market News</h1>
      <div className="grid gap-4">
        {mockNews.map((news) => (
          <article key={news.title} className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold">{news.title}</h2>
            <p className="text-slate-600">{news.summary}</p>
            <a href={news.link} className="text-primary text-sm mt-2 inline-block">
              Đọc thêm
            </a>
          </article>
        ))}
      </div>
    </section>
  );
};

export default MarketNews;

