import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import client from '../api/client';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCurrentUser } from '../store/slices/authSlice';
import { Order, PackagePlan, Property } from '../types';

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
);
const TicketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
);
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
);

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
    if (!window.confirm('Bạn có chắc chắn muốn xóa tin đăng này không?')) return;
    try {
      await client.delete(`/properties/${id}`);
      setMyProperties((prev) => prev.filter((property) => property._id !== id));
      toast.success('Đã xóa tin đăng');
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Không thể xóa');
    }
  };

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
        <p className="text-xl text-slate-600 mb-4">Vui lòng đăng nhập để xem hồ sơ.</p>
        <Link to="/login" className="text-blue-600 hover:underline font-bold">Đến trang đăng nhập</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">

      <div className="relative bg-slate-800 h-48 sm:h-64">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Cover"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row items-end md:items-center gap-6 mb-8">
          <div className="relative">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg bg-white"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-slate-200 flex items-center justify-center text-slate-400">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
            )}
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-bold text-slate-800 mb-1">{user.name}</h1>
            <div className="flex items-center gap-4 text-slate-600 text-sm">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                {user.email}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs uppercase border border-blue-200">
                {user.role}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <a
              href="https://support.google.com/accounts/answer/185833"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm"
            >
              Cài đặt tài khoản
            </a>
            <Link
              to="/properties/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md shadow-blue-500/30 hover:bg-blue-700 transition flex items-center gap-2"
            >
              <PlusIcon />
              Đăng tin mới
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="p-4 bg-blue-50 rounded-xl">
              <TicketIcon />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Tin đăng miễn phí</p>
              <p className="text-3xl font-extrabold text-slate-800">{user.freeListingsRemaining}</p>
              <p className="text-xs text-slate-400 mt-1">Lượt khả dụng</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="p-4 bg-yellow-50 rounded-xl">
              <StarIcon />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Tin VIP (Trả phí)</p>
              <p className="text-3xl font-extrabold text-slate-800">{user.paidListingsRemaining}</p>
              <p className="text-xs text-slate-400 mt-1">Lượt khả dụng</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-white">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  Quản lý tin đăng
                </h2>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                  {myProperties.length} tin
                </span>
              </div>

              <div className="p-0">
                {loading ? (
                  <div className="p-8 text-center text-slate-400">Đang tải dữ liệu...</div>
                ) : myProperties.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🏠</div>
                    <p className="text-slate-500 mb-4">Bạn chưa có tin đăng nào.</p>
                    <Link to="/properties/new" className="text-blue-600 font-semibold hover:underline">Đăng tin ngay</Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {myProperties.map((property) => (
                      <div key={property._id} className="p-5 hover:bg-slate-50 transition-colors group">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <Link to={`/properties/${property._id}`} className="font-bold text-slate-800 text-lg hover:text-blue-600 line-clamp-1 transition">
                                {property.title}
                              </Link>
                              <span
                                className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ml-2 ${property.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                                  : property.status === 'rejected'
                                    ? 'bg-rose-100 text-rose-600 border border-rose-200'
                                    : 'bg-amber-100 text-amber-600 border border-amber-200'
                                  }`}
                              >
                                {property.status === 'approved' ? 'Đã duyệt' : property.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                              </span>
                            </div>

                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              {property.location}
                            </p>
                            <p className="text-blue-600 font-bold mt-2">
                              {property.price.toLocaleString('vi-VN')} {property.priceUnit === 'billion' ? 'tỷ' : 'triệu'}
                            </p>

                            {property.rejectionReason && (
                              <div className="mt-3 bg-rose-50 border border-rose-100 p-3 rounded-lg text-sm text-rose-700 flex items-start gap-2">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <span><span className="font-semibold">Lý do từ chối:</span> {property.rejectionReason}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex sm:flex-col gap-2 justify-center sm:border-l sm:border-slate-100 sm:pl-4">
                            <Link
                              to={`/properties/${property._id}/edit`}
                              className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition"
                            >
                              <EditIcon /> <span className="hidden sm:inline">Sửa</span>
                            </Link>
                            <button
                              onClick={() => handleDeleteProperty(property._id)}
                              className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-rose-600 bg-white border border-slate-200 rounded-lg hover:bg-rose-50 hover:border-rose-200 transition"
                            >
                              <TrashIcon /> <span className="hidden sm:inline">Xóa</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-50">
                <h2 className="text-lg font-bold text-slate-800">Lịch sử giao dịch</h2>
              </div>
              <div className="overflow-x-auto">
                {orders.length === 0 ? (
                  <p className="p-6 text-slate-500 text-sm">Chưa có giao dịch nào.</p>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 font-semibold">
                      <tr>
                        <th className="px-6 py-4">Gói dịch vụ</th>
                        <th className="px-6 py-4">Số tiền</th>
                        <th className="px-6 py-4">Trạng thái</th>
                        <th className="px-6 py-4">Thời gian</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-800">
                            {order.package?.name ?? 'Gói không xác định'}
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-600">
                            {order.amount.toLocaleString('vi-VN')} đ
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-bold capitalize ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 p-1.5 rounded text-indigo-600"><StarIcon /></span>
                Mua gói đăng tin
              </h2>

              {packages.length === 0 ? (
                <p className="text-sm text-slate-500">Hệ thống chưa có gói dịch vụ nào.</p>
              ) : (
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.slug}
                      className="group relative border border-slate-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 bg-gradient-to-br from-white to-slate-50"
                    >
                      <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{pkg.name}</h3>
                      <div className="my-2">
                        <span className="text-2xl font-extrabold text-blue-600">
                          {pkg.price.toLocaleString('vi-VN')}
                        </span>
                        <span className="text-slate-500 text-sm font-medium"> vnđ</span>
                      </div>
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{pkg.description}</p>

                      <button
                        onClick={() => handleCreateOrder(pkg.slug)}
                        className="w-full bg-white text-blue-600 border border-blue-600 font-bold py-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                      >
                        Chọn mua
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 p-6 text-white text-center">
              <h3 className="font-bold text-lg mb-2">Cần hỗ trợ?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Nếu bạn gặp khó khăn trong việc thanh toán hoặc đăng tin, hãy liên hệ ngay.
              </p>
              <button className="bg-white text-blue-700 font-bold py-2 px-4 rounded-lg w-full hover:bg-blue-50 transition">
                Liên hệ CSKH
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;