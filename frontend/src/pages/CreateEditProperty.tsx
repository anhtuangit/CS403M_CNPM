import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropertyForm from '../components/PropertyForm';
import client from '../api/client';
import { Property } from '../types';

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
      
      // Thêm file ảnh vào FormData
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
    <section className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{id ? 'Chỉnh sửa tin' : 'Đăng tin bất động sản'}</h1>
        {id && <span className="text-xs text-slate-500">Tin chỉnh sửa sẽ cần duyệt lại.</span>}
      </div>
      {loading ? <p>Đang tải...</p> : <PropertyForm initial={initial} onSubmit={handleSubmit} />}
      <p className="text-xs text-slate-500 mt-3">
        Người bán được đăng 3 tin miễn phí, sau đó cần mua gói để có thêm lượt đăng. Hết hạn hãy mua gói Pro.
      </p>
    </section>
  );
};

export default CreateEditProperty;

