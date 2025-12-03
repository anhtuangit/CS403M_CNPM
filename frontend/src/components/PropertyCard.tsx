import { Link } from 'react-router-dom';
import { Property } from '../types';
import IconMoney from '../icons/IconMoney';

interface Props {
  property: Property;
}

const PropertyCard = ({ property }: Props) => {
  const getImageUrl = (url: string) => {
    if (!url) return 'https://placehold.co/600x400';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return url;
    return `/uploads/properties/${url}`;
  };
  
  const formatPrice = (price: number, unit?: string, listingType?: string) => {
    const unitText = unit === 'billion' ? 'tỷ' : 'triệu';
    const suffix = listingType === 'rent' ? '/tháng' : '';
    return `${price.toLocaleString('vi-VN')} ${unitText}${suffix}`;
  };
  
  return (
    <article className="bg-white rounded-xl shadow-sm border hover:shadow-md transition flex flex-col">
      <img
        src={getImageUrl(property.images?.[0] || '')}
        alt={property.title}
        className="h-48 w-full object-cover rounded-t-xl"
      />
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="text-xs uppercase tracking-wide text-slate-500">{property.propertyType}</span>
        <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">{property.title}</h3>
        <p className="text-sm text-slate-500 line-clamp-2">{property.location}</p>
        <div className="flex items-center gap-1 text-primary font-semibold">
          <IconMoney className="w-4 h-4" />
          {formatPrice(property.price, property.priceUnit, property.listingType)}
        </div>
        <Link to={`/properties/${property._id}`} className="mt-auto text-sm text-primary hover:underline">
          Xem chi tiết
        </Link>
      </div>
    </article>
  );
};

export default PropertyCard;

