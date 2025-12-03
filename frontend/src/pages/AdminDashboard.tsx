import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import client from '../api/client';
import { useAppSelector } from '../hooks';
import { Order, Property, User } from '../types';

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

  const loadData = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const promises: Promise<any>[] = [
        client.get<AdminStats>('/admin/stats'),
        client.get<Property[]>('/properties', { params: { status: 'pending' } }),
        client.get<Order[]>('/admin/orders')
      ];
      
      // Chỉ admin mới load danh sách users
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
    try {
      const { data: updatedProperty } = await client.post<Property>(`/properties/${id}/approve`);
      toast.success('Đã duyệt tin');
      // Cập nhật ngay lập tức: xóa khỏi pending list và cập nhật stats
      setPendingProps((prev) => prev.filter((property) => property._id !== id));
      const statsRes = await client.get<AdminStats>('/admin/stats');
      setStats(statsRes.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Không thể duyệt');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Nhập lý do từ chối');
    if (!reason) return;
    try {
      const { data: updatedProperty } = await client.post<Property>(`/properties/${id}/reject`, { reason });
      toast.success('Đã từ chối tin');
      // Cập nhật ngay lập tức: xóa khỏi pending list và cập nhật stats
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
    try {
      await client.post(`/admin/orders/${id}/mark-paid`);
      toast.success('Đã xác nhận thanh toán');
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Không thể cập nhật đơn');
    }
  };

  if (!user) {
    return <p className="p-8 text-center text-sm text-slate-500">Đang tải thông tin người dùng...</p>;
  }

  if (user.role !== 'admin' && user.role !== 'staff') {
    return <p className="p-8 text-center text-sm text-slate-500">Cần quyền staff/admin để truy cập.</p>;
  }

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-center text-slate-500">Đang tải dữ liệu...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-semibold mb-2">Lỗi khi tải dữ liệu</p>
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <button onClick={loadData} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700">
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Bảng điều khiển Admin</h1>
        <div className="text-sm text-slate-500">
          Vai trò: <span className="font-semibold text-slate-700">{user.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</span>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-slate-500">Người dùng</p>
          <p className="text-2xl font-bold">{stats?.totalUsers ?? '...'}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-slate-500">Tin đăng</p>
          <p className="text-2xl font-bold">{stats?.totalProperties ?? '...'}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-slate-500">Chờ duyệt</p>
          <p className="text-2xl font-bold text-amber-500">{stats?.pendingProperties ?? '...'}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Quản lý tin đăng</h2>
          <div className="flex items-center gap-3">
            <select
              className="form-select text-sm"
              value="pending"
              onChange={(e) => {
                const status = e.target.value;
                if (status) {
                  client.get<Property[]>('/properties', { params: { status } })
                    .then((res) => setPendingProps(res.data))
                    .catch((err) => toast.error('Không tải được danh sách'));
                }
              }}
            >
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Đã từ chối</option>
              <option value="sold">Đã bán</option>
              <option value="">Tất cả</option>
            </select>
            {pendingProps.length > 0 && (
              <span className="text-sm text-slate-500">Tổng: {pendingProps.length} tin</span>
            )}
          </div>
        </div>
        {pendingProps.length === 0 ? (
          <p className="text-sm text-slate-500">Không có tin pending.</p>
        ) : (
          <div className="space-y-4">
            {pendingProps.map((property) => {
              const formatPrice = (price: number, unit?: string, listingType?: string) => {
                const unitText = unit === 'billion' ? 'tỷ' : 'triệu';
                const suffix = listingType === 'rent' ? '/tháng' : '';
                return `${price.toLocaleString('vi-VN')} ${unitText}${suffix}`;
              };
              return (
                <div key={property._id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <p className="font-semibold">{property.title}</p>
                    <p className="text-sm text-slate-500">{property.location}</p>
                    <p className="text-sm">
                      Giá: {formatPrice(property.price, property.priceUnit, property.listingType)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Loại: {property.listingType === 'rent' ? 'Cho thuê' : 'Bán'} | {property.propertyType}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleApprove(property._id)} 
                      className="px-4 py-2 bg-emerald-500 text-white text-sm rounded-md hover:bg-emerald-600 transition"
                    >
                      Duyệt
                    </button>
                    <button 
                      onClick={() => handleReject(property._id)} 
                      className="px-4 py-2 bg-rose-500 text-white text-sm rounded-md hover:bg-rose-600 transition"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {user?.role === 'admin' && (
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Người dùng</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Lượt miễn phí</th>
                {user?.role === 'admin' && <th />}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={user?.role === 'admin' ? 6 : 5} className="py-4 text-center text-slate-500">
                    Không có người dùng nào
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id || u._id} className="border-t">
                    <td className="py-2">{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'staff' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role === 'admin' ? 'Admin' : u.role === 'staff' ? 'Staff' : 'User'}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs ${
                        u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {u.status === 'active' ? 'Hoạt động' : 'Khóa'}
                      </span>
                    </td>
                    <td>{u.freeListingsRemaining}</td>
                    {user?.role === 'admin' && (
                      <td>
                        <button onClick={() => handleToggleUser(u.id || u._id || '')} className="text-sm text-primary underline hover:text-primary/80">
                          {u.status === 'active' ? 'Khóa' : 'Mở khóa'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Đơn mua gói</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2">Người mua</th>
                <th>Gói</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-slate-500">
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="py-2">{order.user?.email ?? '---'}</td>
                    <td>{order.package?.name ?? 'N/A'}</td>
                    <td>{order.amount.toLocaleString('vi-VN')} đ</td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs capitalize ${
                        order.status === 'paid' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status === 'paid' ? 'Đã thanh toán' : order.status === 'pending' ? 'Chờ thanh toán' : 'Đã hủy'}
                      </span>
                    </td>
                    <td>
                      {order.status !== 'paid' && (
                        <button onClick={() => handleMarkPaid(order._id)} className="text-sm text-emerald-600 underline hover:text-emerald-700">
                          Đánh dấu đã thanh toán
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;

