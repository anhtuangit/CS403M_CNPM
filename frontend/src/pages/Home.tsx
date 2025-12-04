import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProperties } from '../store/slices/propertySlice';
import PropertyCard from '../components/PropertyCard';
import { LocationIcon } from '../icons/IconLocation';
import { TagIcon } from '../icons/IconTag';
import { SearchIcon } from '../icons/IconSearch';
import IconHome from '../icons/IconHome';


const Home = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((state) => state.properties);

  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    listingType: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    q: '',
  });

  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [priceUnit, setPriceUnit] = useState<'million' | 'billion'>('million');

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const submitFilters = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    if (priceRange.min > 0 || priceRange.max < (priceUnit === 'billion' ? 100 : 50000)) {
      params.minPrice = String(priceRange.min);
      params.maxPrice = String(priceRange.max);
    }
    dispatch(fetchProperties(params));
  };

  const formatPrice = (price: number, unit: string) => {
    const unitText = unit === 'billion' ? 'tỷ' : 'triệu';
    return `${price.toLocaleString('vi-VN')} ${unitText}`;
  };

  const getMaxPrice = () => {
    return priceUnit === 'billion' ? 100 : 50000;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="relative bg-slate-900 h-[500px] flex flex-col justify-center items-center px-4">
        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-4 mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">
            Khám phá Ngôi nhà Mơ ước
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto">
            Hàng ngàn tin đăng đã được kiểm duyệt. Tìm kiếm không gian sống lý tưởng của bạn ngay hôm nay.
          </p>
        </div>
        <div className="relative z-20 w-full max-w-6xl -mb-32">
          <form
            onSubmit={submitFilters}
            className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
              <div className="md:col-span-5 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LocationIcon />
                </div>
                <input
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none text-gray-700 placeholder-gray-400 font-medium"
                  placeholder="Nhập địa điểm (VD: Hà Nội, Đà Nẵng...)"
                  value={filters.location}
                  onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="md:col-span-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconHome />
                </div>
                <select
                  className="w-full pl-10 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none appearance-none text-gray-700 font-medium cursor-pointer"
                  value={filters.propertyType}
                  onChange={(e) => setFilters((prev) => ({ ...prev, propertyType: e.target.value }))}
                >
                  <option value="">Tất cả loại nhà</option>
                  <option value="house">Nhà phố</option>
                  <option value="apartment">Căn hộ</option>
                  <option value="land">Đất</option>
                  <option value="villa">Biệt thự</option>
                  <option value="other">Khác</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              <div className="md:col-span-3 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TagIcon />
                </div>
                <select
                  className="w-full pl-10 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none appearance-none text-gray-700 font-medium cursor-pointer"
                  value={filters.listingType}
                  onChange={(e) => setFilters((prev) => ({ ...prev, listingType: e.target.value }))}
                >
                  <option value="">Loại tin (Tất cả)</option>
                  <option value="sell">BDS Bán</option>
                  <option value="rent">Cho thuê</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 my-4"></div>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="flex-1 w-full bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-600 p-1 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </span>
                    Khoảng giá mong muốn
                  </label>
                  <select
                    className="text-xs font-semibold bg-white border border-gray-200 text-gray-600 rounded-lg px-2 py-1 hover:border-blue-400 focus:outline-none transition-colors"
                    value={priceUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value as 'million' | 'billion';
                      setPriceUnit(newUnit);
                      const max = newUnit === 'billion' ? 100 : 50000;
                      setPriceRange({ min: 0, max });
                    }}
                  >
                    <option value="million">Đơn vị: Triệu</option>
                    <option value="billion">Đơn vị: Tỷ</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-8 px-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Min</span>
                      <span className="font-bold text-blue-600">{formatPrice(priceRange.min, priceUnit)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={getMaxPrice()}
                      step={priceUnit === 'billion' ? 0.1 : 1}
                      value={priceRange.min}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) }))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Max</span>
                      <span className="font-bold text-blue-600">{formatPrice(priceRange.max, priceUnit)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={getMaxPrice()}
                      step={priceUnit === 'billion' ? 0.1 : 1}
                      value={priceRange.max}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full lg:w-48 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-14 font-bold text-lg shadow-lg shadow-blue-600/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <SearchIcon />
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      </div>
      <section className="flex-1 max-w-7xl mx-auto px-4 w-full pt-40 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-blue-600 pl-4">
            Kết quả tìm kiếm
          </h2>
          <span className="text-slate-500 text-sm">Hiển thị {list.length} bất động sản</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-lg">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {list.length > 0 ? (
              list.map((property) => (
                <div key={property._id} className="h-full">
                  <PropertyCard property={property} />
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100 border-dashed">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-3xl">
                  🔍
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Không tìm thấy kết quả</h3>
                <p className="text-slate-500 text-center max-w-md">
                  Rất tiếc, không có bất động sản nào phù hợp với bộ lọc hiện tại. Hãy thử điều chỉnh khoảng giá hoặc khu vực.
                </p>
                <button
                  onClick={() => {
                    setFilters({ ...filters, location: '', propertyType: '', listingType: '' });
                    setPriceRange({ min: 0, max: priceUnit === 'billion' ? 100 : 50000 });
                  }}
                  className="mt-6 text-blue-600 font-semibold hover:underline"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;