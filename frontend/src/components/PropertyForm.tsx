import { useState, useRef, useEffect } from 'react';
import { Property } from '../types';

interface Props {
  initial?: Partial<Property>;
  onSubmit: (values: Partial<Property>, files: File[]) => void;
}

const PropertyForm = ({ initial, onSubmit }: Props) => {
  const [form, setForm] = useState<Partial<Property>>({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    price: initial?.price ?? 0,
    priceUnit: initial?.priceUnit ?? 'million',
    listingType: initial?.listingType ?? 'sell',
    location: initial?.location ?? '',
    propertyType: initial?.propertyType ?? 'house',
    area: initial?.area ?? 0,
    bedrooms: initial?.bedrooms ?? 0,
    bathrooms: initial?.bathrooms ?? 0,
    floors: initial?.floors ?? 0
  });

  const [facing, setFacing] = useState<string>(initial?.metadata?.facing ?? '');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // Preview URLs: ảnh cũ từ server (nếu có) + ảnh mới từ file input
  const [existingImages] = useState<string[]>(initial?.images ?? []);
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title ?? '',
        description: initial.description ?? '',
        price: initial.price ?? 0,
        priceUnit: initial.priceUnit ?? 'million',
        listingType: initial.listingType ?? 'sell',
        location: initial.location ?? '',
        propertyType: initial.propertyType ?? 'house',
        area: initial.area ?? 0,
        bedrooms: initial.bedrooms ?? 0,
        bathrooms: initial.bathrooms ?? 0,
        floors: initial.floors ?? 0
      });
      setFacing(initial.metadata?.facing ?? '');
    }
  }, [initial]);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = evt.target;
    setForm((prev) => ({ ...prev, [name]: name === 'price' || name === 'area' || name === 'bedrooms' || name === 'bathrooms' || name === 'floors' ? Number(value) : value }));
  };

  const handlePriceChange = (value: number) => {
    setForm((prev) => ({ ...prev, price: value }));
  };

  const formatPrice = (price: number, unit: string, listingType: string) => {
    const unitText = unit === 'billion' ? 'tỷ' : 'triệu';
    const suffix = listingType === 'rent' ? '/tháng' : '';
    return `${price.toLocaleString('vi-VN')} ${unitText}${suffix}`;
  };

  const getMaxPrice = () => {
    if (form.priceUnit === 'billion') return 100;
    return 50000;
  };

  const handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(evt.target.files || []);
    if (files.length > 5) {
      alert('Chỉ được chọn tối đa 5 ảnh');
      return;
    }
    setSelectedFiles(files);

    const urls = files.map((file) => URL.createObjectURL(file));
    setNewPreviewUrls(urls);
  };

  const removeExistingImage = (index: number) => {
  };

  const removeNewImage = (index: number) => {
    setNewPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form
      className="grid gap-4"
      onSubmit={(evt) => {
        evt.preventDefault();
        const submitData = {
          ...form,
          metadata: {
            ...(form.metadata || {}),
            facing: facing || undefined
          }
        };
        onSubmit(submitData, selectedFiles);
      }}
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Ảnh bất động sản (tối đa 5 ảnh)</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="form-input"
        />
        {(existingImages.length > 0 || newPreviewUrls.length > 0) && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {existingImages.map((url, idx) => {
              const getImageUrl = (imgUrl: string) => {
                if (!imgUrl) return '';
                if (imgUrl.startsWith('http')) return imgUrl;
                if (imgUrl.startsWith('/uploads')) return imgUrl;
                return `/uploads/properties/${imgUrl}`;
              };
              return (
                <div key={`existing-${idx}`} className="relative group">
                  <img
                    src={getImageUrl(url)}
                    alt={`Ảnh ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <span className="absolute bottom-1 left-1 bg-slate-700 text-white text-xs px-1 rounded">Cũ</span>
                </div>
              );
            })}
            {newPreviewUrls.map((url, idx) => (
              <div key={`new-${idx}`} className="relative group">
                <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => removeNewImage(idx)}
                  className="absolute top-1 right-1 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  ×
                </button>
                <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-xs px-1 rounded">Mới</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <input className="form-input" placeholder="Tiêu đề" name="title" value={form.title} onChange={handleChange} required />
      <textarea
        className="form-textarea"
        rows={4}
        placeholder="Mô tả"
        name="description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <input className="form-input" placeholder="Địa điểm" name="location" value={form.location} onChange={handleChange} required />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Loại tin</label>
          <select className="form-select" name="listingType" value={form.listingType} onChange={handleChange} required>
            <option value="sell">Bán</option>
            <option value="rent">Cho thuê</option>
          </select>
        </div>
        <select className="form-select" name="propertyType" value={form.propertyType} onChange={handleChange} required>
          <option value="house">Nhà phố</option>
          <option value="apartment">Căn hộ</option>
          <option value="land">Đất</option>
          <option value="villa">Biệt thự</option>
          <option value="other">Khác</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Giá: {formatPrice(form.price || 0, form.priceUnit || 'million', form.listingType || 'sell')}
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="range"
            min="0"
            max={getMaxPrice()}
            step={form.priceUnit === 'billion' ? 0.1 : 1}
            value={form.price || 0}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className="flex-1"
          />
          <input
            className="form-input w-32"
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            max={getMaxPrice()}
          />
          <select className="form-select w-32" name="priceUnit" value={form.priceUnit} onChange={handleChange} required>
            <option value="million">Triệu</option>
            <option value="billion">Tỷ</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          className="form-input"
          type="number"
          placeholder="Diện tích (m²)"
          name="area"
          value={form.area}
          onChange={handleChange}
          required
          min="0"
        />
        <select className="form-select" name="facing" value={facing} onChange={(e) => setFacing(e.target.value)}>
          <option value="">Hướng nhà</option>
          <option value="north">Bắc</option>
          <option value="south">Nam</option>
          <option value="east">Đông</option>
          <option value="west">Tây</option>
          <option value="northeast">Đông Bắc</option>
          <option value="northwest">Tây Bắc</option>
          <option value="southeast">Đông Nam</option>
          <option value="southwest">Tây Nam</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <input
          className="form-input"
          type="number"
          placeholder="Số phòng ngủ"
          name="bedrooms"
          value={form.bedrooms}
          onChange={handleChange}
          min="0"
        />
        <input
          className="form-input"
          type="number"
          placeholder="Số phòng tắm"
          name="bathrooms"
          value={form.bathrooms}
          onChange={handleChange}
          min="0"
        />
        <input
          className="form-input"
          type="number"
          placeholder="Số tầng"
          name="floors"
          value={form.floors}
          onChange={handleChange}
          min="0"
        />
      </div>
      <button type="submit" className="bg-primary text-white rounded-md py-2 font-semibold h-11">
        Lưu tin
      </button>
    </form>
  );
};

export default PropertyForm;

