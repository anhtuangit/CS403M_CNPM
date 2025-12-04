import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchPropertyById } from '../store/slices/propertySlice';
import client from '../api/client';
import { Property } from '../types';
import ChatComponent from '../components/Chat';

// --- Icons Components ---
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const BedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 20h14M6 4h12a2 2 0 012 2v2H4V6a2 2 0 012-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16v8h-1v-2a1 1 0 00-1-1H6a1 1 0 00-1 1v2H4V8z" /></svg>
);
const BathIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
);
const AreaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
);
const CompassIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
);
const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
);

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const property = useAppSelector((state) => state.properties.selected);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [propertyData, setPropertyData] = useState<Property | null>(null);
  const [showChat, setShowChat] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(id));
      client.get<Property>(`/properties/${id}`).then((res) => setPropertyData(res.data));
    }
  }, [dispatch, id]);

  if (!property) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  const getImageUrl = (url: string) => {
    if (!url) return 'https://placehold.co/800x400';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return url;
    return `/uploads/properties/${url}`;
  };

  const formatPrice = (price: number, unit?: string, listingType?: string) => {
    const unitText = unit === 'billion' ? 'tỷ' : 'triệu';
    const suffix = listingType === 'rent' ? '/tháng' : '';
    return `${price.toLocaleString('vi-VN')} ${unitText}${suffix}`;
  };

  const images = property.images || [];
  const displayProperty = propertyData || property;
  const owner = displayProperty.owner;

  // Render Component
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- Breadcrumb & Title Header --- */}
        <div className="mb-6">
          <Link to="/" className="text-slate-500 hover:text-blue-600 text-sm mb-2 inline-flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Quay lại tìm kiếm
          </Link>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mt-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-slate-500 mt-2">
                <LocationIcon />
                <span className="font-medium">{property.location}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-3xl font-bold text-blue-600">
                {formatPrice(property.price, property.priceUnit, property.listingType)}
              </div>
              <span className="text-sm text-slate-400 bg-slate-100 px-2 py-1 rounded">
                {property.listingType === 'rent' ? 'Cho thuê' : 'Đang bán'}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white p-2 rounded-3xl shadow-sm border border-slate-100 mb-8">
          <div className="relative w-[80%] h-[400px] md:h-[500px] bg-slate-100 rounded-2xl overflow-hidden group">
            {images.length > 0 ? (
              <img
                src={getImageUrl(images[selectedImageIndex])}
                alt={property.title}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <span className="text-lg">Chưa có hình ảnh</span>
              </div>
            )}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium">
              {selectedImageIndex + 1} / {images.length || 0}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-3 overflow-x-auto pb-2 px-1 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden transition-all duration-200 ${selectedImageIndex === idx
                    ? 'ring-2 ring-blue-600 ring-offset-2 opacity-100'
                    : 'opacity-70 hover:opacity-100'
                    }`}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`Thumbnail ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {property.bedrooms && (
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 text-center">
                  <div className="text-blue-500"><BedIcon /></div>
                  <div>
                    <span className="block font-bold text-slate-800 text-lg">{property.bedrooms}</span>
                    <span className="text-xs text-slate-500 font-medium uppercase">Phòng ngủ</span>
                  </div>
                </div>
              )}
              {property.bathrooms && (
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 text-center">
                  <div className="text-blue-500"><BathIcon /></div>
                  <div>
                    <span className="block font-bold text-slate-800 text-lg">{property.bathrooms}</span>
                    <span className="text-xs text-slate-500 font-medium uppercase">Phòng tắm</span>
                  </div>
                </div>
              )}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 text-center">
                <div className="text-blue-500"><AreaIcon /></div>
                <div>
                  <span className="block font-bold text-slate-800 text-lg">{property.area} m²</span>
                  <span className="text-xs text-slate-500 font-medium uppercase">Diện tích</span>
                </div>
              </div>
              {property.metadata?.facing && (
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 text-center">
                  <div className="text-blue-500"><CompassIcon /></div>
                  <div>
                    <span className="block font-bold text-slate-800 text-lg">{property.metadata.facing}</span>
                    <span className="text-xs text-slate-500 font-medium uppercase">Hướng</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
                Thông tin mô tả
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-7 whitespace-pre-line">
                {property.description}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Đặc điểm chi tiết</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Loại hình</span>
                    <span className="font-medium text-slate-800 capitalize">{property.propertyType === 'house' ? 'Nhà phố' : property.propertyType}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Số tầng</span>
                    <span className="font-medium text-slate-800">{property.floors || 'Đang cập nhật'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Pháp lý</span>
                    <span className="font-medium text-slate-800">Sổ đỏ/Sổ hồng</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Nội thất</span>
                    <span className="font-medium text-slate-800">Cơ bản</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">

              <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 p-4 text-center">
                  <h3 className="text-white font-semibold">Thông tin liên hệ</h3>
                </div>

                <div className="p-6">
                  {owner ? (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        {owner.avatar ? (
                          <img
                            src={owner.avatar}
                            alt={owner.name}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-3xl font-bold border-4 border-white shadow-md">
                            {owner.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
                      </div>

                      <h4 className="text-xl font-bold text-slate-800">{owner.name}</h4>
                      <p className="text-slate-500 text-sm mb-6">{owner.email}</p>

                      <div className="w-full space-y-3">
                        {user && owner && user.id !== (owner as any)._id && (
                          <button
                            onClick={() => setShowChat(true)}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5"
                          >
                            <ChatIcon />
                            Chat với người bán
                          </button>
                        )}

                        {'phone' in owner && owner.phone && (
                          <a href={`tel:${owner.phone}`} className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-green-200 transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            {owner.phone}
                          </a>
                        )}

                        <button
                          onClick={() => {
                            window.open(`/api/properties/${id}/contract`, '_blank');
                          }}
                          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-blue-500 text-slate-600 hover:text-blue-600 font-semibold py-3 px-4 rounded-xl transition-all"
                        >
                          <DocumentIcon />
                          Xem mẫu hợp đồng
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400">
                      <div className="animate-pulse">Đang tải thông tin...</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h5 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Lưu ý an toàn
                </h5>
                <p className="text-xs text-blue-600 leading-relaxed">
                  Không bao giờ chuyển tiền trước khi xem nhà và ký hợp đồng. Kiểm tra kỹ pháp lý trước khi giao dịch.
                </p>
              </div>
            </div>
          </div>

        </div>

        {showChat && id && (
          <ChatComponent propertyId={id} onClose={() => setShowChat(false)} />
        )}
      </section>
    </div>
  );
};

export default PropertyDetail;