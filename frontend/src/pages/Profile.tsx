import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import client from '../api/client';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCurrentUser } from '../store/slices/authSlice';
import { Order, PackagePlan, Property } from '../types';

const Profile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [packages, setPackages] = useState<PackagePlan[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [propertyRes, ordersRes, packagesRes] = await Promise.all([
        client.get<Property[]>('/properties/me'),
        client.get<Order[]>('/orders/me'),
        client.get<PackagePlan[]>('/packages')
      ]);
      setMyProperties(propertyRes.data);
      setOrders(ordersRes.data);
      setPackages(packagesRes.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Không tải được dữ liệu cá nhân');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleCreateOrder = async (packageSlug: string) => {
    try {
      await client.post('/orders', { packageSlug });
      toast.success('Đã gửi yêu cầu mua gói, chờ staff xác nhận.');
      const { data } = await client.get<Order[]>('/orders/me');
      setOrders(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Không thể tạo yêu cầu');
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!window.confirm('Xóa tin này?')) return;
    try {
      await client.delete(`/properties/${id}`);
      setMyProperties((prev) => prev.filter((property) => property._id !== id));
      toast.success('Đã xóa tin');
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Không thể xóa');
    }
  };

  if (!user) return <p className="p-8">Chưa đăng nhập.</p>;

  return (
    <section className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-4 mb-4">
          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
            />
          )}
          <div>
            <h1 className="text-2xl font-semibold mb-1">{user.name}</h1>
            <p className="text-slate-600">{user.email}</p>
            <p className="text-sm text-slate-500">Vai trò: {user.role}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-6 text-sm">
          <p>Free slots: {user.freeListingsRemaining}</p>
          <p>Paid slots: {user.paidListingsRemaining}</p>
        </div>
        <div className="mt-6 flex gap-3 flex-wrap">
          <Link to="/properties/new" className="bg-primary text-white px-4 py-2 rounded-md">
            Đăng tin mới
          </Link>
          <a
            href="https://support.google.com/accounts/answer/185833"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-500 underline"
          >
            Cập nhật thông tin Google
          </a>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Gói đăng tin</h2>
        {packages.length === 0 ? (
          <p className="text-sm text-slate-500">Chưa có gói khả dụng.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <div key={pkg.slug} className="border rounded-xl p-4">
                <p className="font-semibold">{pkg.name}</p>
                <p className="text-primary text-2xl font-bold">
                  {pkg.price.toLocaleString('vi-VN')} đ
                </p>
                <p className="text-sm text-slate-500 mb-3">{pkg.description}</p>
                <button
                  onClick={() => handleCreateOrder(pkg.slug)}
                  className="w-full border border-primary text-primary rounded-md py-2 text-sm"
                >
                  Mua gói
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Tin của tôi</h2>
          <span className="text-xs text-slate-500">
            Sau khi chỉnh sửa, tin sẽ trở lại trạng thái pending.
          </span>
        </div>
        {loading ? (
          <p>Đang tải...</p>
        ) : myProperties.length === 0 ? (
          <p className="text-sm text-slate-500">Bạn chưa có tin nào.</p>
        ) : (
          <div className="space-y-4">
            {myProperties.map((property) => (
              <div key={property._id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold">{property.title}</p>
                  <p className="text-sm text-slate-500">{property.location}</p>
                  <p className="text-sm mt-1">Giá: {property.price.toLocaleString('vi-VN')} đ</p>
                  <span
                    className={`inline-flex text-xs mt-2 px-2 py-1 rounded-full ${
                      property.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : property.status === 'rejected'
                        ? 'bg-rose-100 text-rose-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    {property.status}
                  </span>
                  {property.rejectionReason && (
                    <p className="text-xs text-rose-500 mt-1">Lý do: {property.rejectionReason}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link to={`/properties/${property._id}`} className="text-sm text-primary underline">
                    Xem
                  </Link>
                  <Link
                    to={`/properties/${property._id}/edit`}
                    className="text-sm text-slate-600 border px-3 py-1 rounded-md"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDeleteProperty(property._id)}
                    className="text-sm text-rose-600 border px-3 py-1 rounded-md"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Đơn mua gói</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-slate-500">Chưa có đơn nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">Gói</th>
                  <th>Giá</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="py-2">{order.package?.name ?? 'N/A'}</td>
                    <td>{order.amount.toLocaleString('vi-VN')} đ</td>
                    <td className="capitalize">{order.status}</td>
                    <td>{new Date(order.createdAt).toLocaleString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;

