import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import client from '../api/client';
import { useAppSelector } from '../hooks';
import { Order, Property, User } from '../types';

// --- Icons Components ---
const UserGroupIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);
const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
);
const ClipboardCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
);
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
);

interface AdminStats {
  totalUsers: number;
  totalProperties: number;
  pendingProperties: number;
}

const AdminDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState<AdminStats>();
  const [pendingProps, setPendingProps] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [filterStatus, setFilterStatus] = useState('pending');

  const loadData = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const promises: Promise<any>[] = [
        client.get<AdminStats>('/admin/stats'),
        client.get<Property[]>('/properties', { params: { status: 'pending' } }),
        client.get<Order[]>('/admin/orders')
      ];

      if (user?.role === 'admin') {
        promises.push(client.get<User[]>('/admin/users'));
      }

      const results = await Promise.all(promises);
      setStats(results[0].data);
      setPendingProps(results[1].data);
      setOrders(results[2].data);
      if (user?.role === 'admin') {
        setUsers(results[3].data);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ?? 'Không tải được dữ liệu admin';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'staff')) {
      loadData();
    }
  }, [user]);

  const handleApprove = async (id: string) => {
    if (!window.confirm('Xác nhận duyệt tin này?')) return;
    try {
      await client.post<Property>(`/properties/${id}/approve`);
      toast.success('Đã duyệt tin');
      setPendingProps((prev) => prev.filter((property) => property._id !== id));
      const statsRes = await client.get<AdminStats>('/admin/stats');
      setStats(statsRes.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Không thể duyệt');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Nhập lý do từ chối (bắt buộc):');
    if (!reason) return;
    try {
      await client.post<Property>(`/properties/${id}/reject`, { reason });
      toast.success('Đã từ chối tin');
      setPendingProps((prev) => prev.filter((property) => property._id !== id));
      const statsRes = await client.get<AdminStats>('/admin/stats');
      setStats(statsRes.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Không thể từ chối');
    }
  };

  const handleToggleUser = async (id: string) => {
    try {
      const { data } = await client.patch<User>(`/admin/users/${id}/toggle`);
      const updatedId = data.id ?? data._id ?? id;
      setUsers((prev) => prev.map((u) => ((u.id ?? u._id) === updatedId ? data : u)));
      toast.success('Đã cập nhật trạng thái');
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Không thể cập nhật');
    }
  };

  const handleMarkPaid = async (id: string) => {
    if (!window.confirm('Xác nhận đơn này đã thanh toán?')) return;
    try {
      await client.post(`/admin/orders/${id}/mark-paid`);
      toast.success('Đã xác nhận thanh toán');
      loadData(); // Reload to update UI accurately
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Không thể cập nhật đơn');
    }
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    if (status) {
      client.get<Property[]>('/properties', { params: { status } })
        .then((res) => setPendingProps(res.data))
        .catch(() => toast.error('Không tải được danh sách'));
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-slate-500">Bạn không có quyền truy cập trang này.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <div className="text-rose-500 font-bold">Lỗi: {error}</div>
        <button onClick={loadData} className="px-4 py-2 bg-slate-800 text-white rounded-lg">Thử lại</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">

      <div className="bg-slate-900 text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hệ thống Quản trị</h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
              Xin chào, <span className="font-semibold text-white">{user.name}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                {user.role}
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={loadData} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm transition shadow-sm">
              Làm mới dữ liệu
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Tổng người dùng</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{loading ? '...' : stats?.totalUsers}</h3>
            </div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
              <UserGroupIcon />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Tổng tin đăng</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{loading ? '...' : stats?.totalProperties}</h3>
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
              <BuildingIcon />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-sm font-medium text-slate-500 mb-1">Tin chờ duyệt</p>
              <h3 className="text-3xl font-extrabold text-amber-500">{loading ? '...' : stats?.pendingProperties}</h3>
            </div>
            <div className="p-4 bg-amber-50 text-amber-500 rounded-xl relative z-10">
              <ClipboardCheckIcon />
            </div>
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-amber-50 rounded-full opacity-50"></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ClipboardCheckIcon />
              Quản lý tin đăng
            </h2>

            <div className="flex items-center gap-2">
              <FilterIcon />
              <select
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none font-medium"
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <option value="pending">Chờ duyệt (Pending)</option>
                <option value="approved">Đã duyệt (Approved)</option>
                <option value="rejected">Đã từ chối (Rejected)</option>
                <option value="sold">Đã bán (Sold)</option>
                <option value="">Tất cả trạng thái</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-50/50 p-6">
            {loading ? (
              <div className="text-center py-10 text-slate-400">Đang tải dữ liệu...</div>
            ) : pendingProps.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500">Không tìm thấy tin đăng nào ở trạng thái này.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingProps.map((property) => (
                  <div key={property._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row gap-6">
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{property.title}</h3>
                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase border ${property.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          property.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                            property.status === 'rejected' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                              'bg-slate-100 text-slate-600'
                          }`}>
                          {property.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm text-slate-600">
                        <div>
                          <span className="block text-xs text-slate-400">Giá</span>
                          <span className="font-bold text-blue-600">
                            {property.price.toLocaleString('vi-VN')} {property.priceUnit === 'billion' ? 'tỷ' : 'triệu'}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs text-slate-400">Khu vực</span>
                          <span className="font-medium">{property.location}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-slate-400">Loại tin</span>
                          <span className="capitalize">{property.listingType === 'rent' ? 'Cho thuê' : 'Bán'}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-slate-400">Loại BĐS</span>
                          <span className="capitalize">{property.propertyType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-2 justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 min-w-[140px]">
                      {property.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(property._id)}
                            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm shadow-emerald-200"
                          >
                            <CheckIcon /> Duyệt
                          </button>
                          <button
                            onClick={() => handleReject(property._id)}
                            className="flex items-center justify-center gap-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg text-sm font-semibold transition"
                          >
                            <XIcon /> Từ chối
                          </button>
                        </>
                      )}
                      <a
                        href={`/properties/${property._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-medium py-1"
                      >
                        Xem chi tiết &rarr;
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full">

          {user.role === 'admin' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
              <div className="px-6 py-5 border-b border-slate-50">
                <h2 className="text-lg font-bold text-slate-800">Danh sách Người dùng</h2>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Vai trò</th>
                      <th className="px-6 py-3">Trạng thái</th>
                      <th className="px-6 py-3 text-center">Slots</th>
                      <th className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map((u) => (
                      <tr key={u.id || u._id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-800">{u.name}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            u.role === 'staff' ? 'bg-blue-100 text-blue-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold ${u.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                            {u.status === 'active' ? 'Active' : 'Locked'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-slate-600">
                          {u.freeListingsRemaining}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleUser(u.id || u._id || '')}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {u.status === 'active' ? 'Khóa TK' : 'Mở khóa'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="px-6 py-5 border-b border-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Đơn hàng gần đây</h2>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-6 py-3">Khách hàng</th>
                    <th className="px-6 py-3">Gói & Giá</th>
                    <th className="px-6 py-3">Trạng thái</th>
                    <th className="px-6 py-3">Xử lý</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 text-slate-700">
                        {order.user?.email ?? 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{order.package?.name ?? 'N/A'}</div>
                        <div className="text-xs text-slate-500">{order.amount.toLocaleString('vi-VN')} đ</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${order.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                          order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {order.status !== 'paid' && (
                          <button
                            onClick={() => handleMarkPaid(order._id)}
                            className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded hover:bg-emerald-100 transition border border-emerald-100"
                          >
                            Xác nhận thu tiền
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">Không có đơn hàng nào</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;