import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProperties } from '../store/slices/propertySlice';
import PropertyCard from '../components/PropertyCard';

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
    q: ''
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
    // Convert price range based on unit
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
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Bất động sản nổi bật</h1>
        <p className="text-slate-500">Các tin đã được duyệt bởi đội ngũ staff.</p>
      </div>
      <form onSubmit={submitFilters} className="bg-white rounded-xl shadow p-4 grid md:grid-cols-4 gap-3 mb-6 text-sm">
        <input
          className="form-input"
          placeholder="Địa điểm"
          value={filters.location}
          onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
        />
        <select
          className="form-select"
          value={filters.propertyType}
          onChange={(e) => setFilters((prev) => ({ ...prev, propertyType: e.target.value }))}
        >
          <option value="">Loại nhà</option>
          <option value="house">Nhà phố</option>
          <option value="apartment">Căn hộ</option>
          <option value="land">Đất</option>
          <option value="villa">Biệt thự</option>
          <option value="other">Khác</option>
        </select>
        <select
          className="form-select"
          value={filters.listingType}
          onChange={(e) => setFilters((prev) => ({ ...prev, listingType: e.target.value }))}
        >
          <option value="">Loại tin</option>
          <option value="sell">Bán</option>
          <option value="rent">Cho thuê</option>
        </select>
        <select
          className="form-select md:col-span-1"
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
        >
          <option value="">Trạng thái</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="sold">Sold</option>
        </select>
        <div className="md:col-span-3 space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 whitespace-nowrap">Khoảng giá:</label>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max={getMaxPrice()}
                  step={priceUnit === 'billion' ? 0.1 : 1}
                  value={priceRange.min}
                  onChange={(e) => setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) }))}
                  className="flex-1"
                />
                <span className="text-xs w-20 text-right">{formatPrice(priceRange.min, priceUnit)}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range"
                  min="0"
                  max={getMaxPrice()}
                  step={priceUnit === 'billion' ? 0.1 : 1}
                  value={priceRange.max}
                  onChange={(e) => setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))}
                  className="flex-1"
                />
                <span className="text-xs w-20 text-right">{formatPrice(priceRange.max, priceUnit)}</span>
              </div>
            </div>
            <select
              className="form-select w-24 text-xs"
              value={priceUnit}
              onChange={(e) => {
                const newUnit = e.target.value as 'million' | 'billion';
                setPriceUnit(newUnit);
                const max = newUnit === 'billion' ? 100 : 50000;
                setPriceRange({ min: 0, max });
              }}
            >
              <option value="million">Triệu</option>
              <option value="billion">Tỷ</option>
            </select>
          </div>
        </div>
        <input
          className="form-input md:col-span-2"
          placeholder="Từ khóa..."
          value={filters.q}
          onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
        />
        <button type="submit" className="bg-primary text-white rounded-md h-11 font-semibold">
          Tìm kiếm
        </button>
      </form>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {list.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Home;

