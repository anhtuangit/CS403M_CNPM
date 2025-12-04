import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropertyForm from '../components/PropertyForm';
import client from '../api/client';
import { Property } from '../types';

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CreateEditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<Partial<Property>>();
  const [loading, setLoading] = useState<boolean>(Boolean(id));

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const { data } = await client.get<Property>(`/properties/${id}`);
        setInitial(data);
      } catch (error: any) {
        toast.error(error.response?.data?.message ?? 'Không tìm thấy tin');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (values: Partial<Property>, files: File[]) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title || '');
      formData.append('description', values.description || '');
      formData.append('price', String(values.price || 0));
      formData.append('priceUnit', values.priceUnit || 'million');
      formData.append('listingType', values.listingType || 'sell');
      formData.append('location', values.location || '');
      formData.append('propertyType', values.propertyType || 'house');
      formData.append('area', String(values.area || 0));
      if (values.bedrooms !== undefined) formData.append('bedrooms', String(values.bedrooms));
      if (values.bathrooms !== undefined) formData.append('bathrooms', String(values.bathrooms));
      if (values.floors !== undefined) formData.append('floors', String(values.floors));
      if (values.metadata?.facing) formData.append('facing', values.metadata.facing);

      files.forEach((file) => {
        formData.append('images', file);
      });

      if (id) {
        await client.patch(`/properties/${id}`, formData);
        toast.success('Đã cập nhật và chuyển trạng thái về pending');
      } else {
        await client.post('/properties', formData);
        toast.success('Đã gửi tin, chờ duyệt');
      }
      navigate('/profile');
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Không thể lưu tin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-slate-900 pt-12 pb-24 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
          {id ? 'Chỉnh sửa tin đăng' : 'Đăng tin bất động sản mới'}
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          {id
            ? 'Cập nhật thông tin để tin đăng của bạn hấp dẫn hơn. Lưu ý: Tin sẽ cần duyệt lại sau khi chỉnh sửa.'
            : 'Tiếp cận hàng triệu khách hàng tiềm năng bằng cách điền đầy đủ thông tin bên dưới.'}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

          <div className="p-6 md:p-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                <p className="font-medium">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <PropertyForm initial={initial} onSubmit={handleSubmit} />
            )}
          </div>
        </div>
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
          <div className="bg-white p-2 rounded-full text-blue-600 shadow-sm flex-shrink-0">
            <InfoIcon />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 text-sm mb-1">Chính sách đăng tin</h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              Mỗi tài khoản được đăng <strong>3 tin miễn phí</strong>. Sau đó, bạn cần mua gói dịch vụ để có thêm lượt đăng.
              Hãy đảm bảo hình ảnh rõ nét và thông tin chính xác để được duyệt nhanh chóng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEditProperty;