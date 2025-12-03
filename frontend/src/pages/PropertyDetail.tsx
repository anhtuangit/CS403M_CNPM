import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchPropertyById } from '../store/slices/propertySlice';
import client from '../api/client';
import { Property } from '../types';
import ChatComponent from '../components/Chat';

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
      // Load full property data với owner info
      client.get<Property>(`/properties/${id}`).then((res) => setPropertyData(res.data));
    }
  }, [dispatch, id]);

  if (!property) return <p className="p-8">Đang tải...</p>;
  
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

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 grid gap-6">
      {/* Image Gallery */}
      <div className="grid gap-4">
        <div className="relative w-full h-96 bg-slate-100 rounded-lg overflow-hidden">
          {images.length > 0 ? (
            <img
              src={getImageUrl(images[selectedImageIndex])}
              alt={property.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              Không có ảnh
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative aspect-video rounded-md overflow-hidden border-2 transition ${
                  selectedImageIndex === idx ? 'border-primary' : 'border-slate-200'
                }`}
              >
                <img
                  src={getImageUrl(img)}
                  alt={`${property.title} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
          <p className="text-slate-500 mb-4">{property.location}</p>
          <p className="text-primary text-2xl font-semibold mb-6">
            {formatPrice(property.price, property.priceUnit, property.listingType)}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 p-4 bg-slate-50 rounded-lg">
            {property.bedrooms && (
              <div>
                <p className="text-xs text-slate-500">Phòng ngủ</p>
                <p className="font-semibold">{property.bedrooms}</p>
              </div>
            )}
            {property.bathrooms && (
              <div>
                <p className="text-xs text-slate-500">Phòng tắm</p>
                <p className="font-semibold">{property.bathrooms}</p>
              </div>
            )}
            {property.floors && (
              <div>
                <p className="text-xs text-slate-500">Số tầng</p>
                <p className="font-semibold">{property.floors}</p>
              </div>
            )}
            {property.metadata?.facing && (
              <div>
                <p className="text-xs text-slate-500">Hướng</p>
                <p className="font-semibold">{property.metadata.facing}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-slate-500">Diện tích</p>
              <p className="font-semibold">{property.area} m²</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Loại</p>
              <p className="font-semibold">{property.propertyType}</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Mô tả</h2>
            <p className="text-slate-700 whitespace-pre-line">{property.description}</p>
          </div>
        </div>

        {/* Owner Info Sidebar */}
        <div className="bg-white rounded-xl shadow p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Thông tin người bán</h2>
          {owner ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {owner.avatar ? (
                  <img
                    src={owner.avatar}
                    alt={owner.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                    {owner.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{owner.name}</p>
                  <p className="text-sm text-slate-500">{owner.email}</p>
                  {'phone' in owner && owner.phone && <p className="text-sm text-slate-500">{owner.phone}</p>}
                </div>
              </div>
              <div className="space-y-2">
                {user && owner && user.id !== (owner as any)._id && (
                  <button
                    onClick={() => setShowChat(true)}
                    className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition"
                  >
                    Chat với người bán
                  </button>
                )}
                <button
                  onClick={() => {
                    window.open(`/api/properties/${id}/contract`, '_blank');
                  }}
                  className="w-full border border-primary text-primary py-2 rounded-md hover:bg-primary/10 transition"
                >
                  Xem hợp đồng
                </button>
                <button
                  onClick={async () => {
                    try {
                      const response = await client.get(`/properties/${id}/contract/download`, {
                        responseType: 'blob'
                      });
                      const url = window.URL.createObjectURL(new Blob([response.data]));
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', `hop-dong-${property.title.replace(/\s+/g, '-')}.xlsx`);
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                    } catch (error: any) {
                      alert('Không thể tải hợp đồng: ' + (error.response?.data?.message || 'Lỗi không xác định'));
                    }
                  }}
                  className="w-full border border-slate-300 text-slate-700 py-2 rounded-md hover:bg-slate-50 transition"
                >
                  Tải hợp đồng (Excel)
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Đang tải thông tin...</p>
          )}
        </div>
      </div>

      {showChat && id && (
        <ChatComponent propertyId={id} onClose={() => setShowChat(false)} />
      )}
    </section>
  );
};

export default PropertyDetail;

