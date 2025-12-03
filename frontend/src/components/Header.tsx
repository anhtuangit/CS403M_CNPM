import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { logout } from '../store/slices/authSlice';
import IconHome from '../icons/IconHome';
import ChatList from './ChatList';
import client from '../api/client';
import { Chat } from '../types';
import toast from 'react-hot-toast';

const Header = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showChatList, setShowChatList] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Đã đăng xuất');
      navigate('/');
    } catch (error) {
      toast.error('Lỗi khi đăng xuất');
    }
  };

  // Load unread count
  useEffect(() => {
    if (user) {
      const loadUnreadCount = async () => {
        try {
          const { data } = await client.get<Chat[]>('/chat/me');
          const totalUnread = data.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
          setUnreadCount(totalUnread);
        } catch (error) {
          // Ignore errors
        }
      };
      
      loadUnreadCount();
      // Polling mỗi 5 giây để cập nhật unread count
      const interval = setInterval(loadUnreadCount, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
          <IconHome className="w-6 h-6" />
          BDS Marketplace
        </Link>
        <nav className="flex gap-4 text-sm font-medium">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'text-primary' : 'text-slate-500')}>
            Trang chủ
          </NavLink>
          <NavLink to="/news" className={({ isActive }) => (isActive ? 'text-primary' : 'text-slate-500')}>
            Tin tức
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'text-primary' : 'text-slate-500')}>
            About
          </NavLink>
          <NavLink to="/tax" className={({ isActive }) => (isActive ? 'text-primary' : 'text-slate-500')}>
            Thuế
          </NavLink>
          {(user?.role === 'admin' || user?.role === 'staff') && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'text-primary' : 'text-slate-500')}>
              Admin
            </NavLink>
          )}
        </nav>
        <div className="text-sm flex items-center gap-3">
          {user ? (
            <>
              {/* Chat Button */}
              <button
                onClick={() => setShowChatList(true)}
                className="relative p-2 text-slate-700 hover:text-primary transition"
                title="Tin nhắn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <Link to="/profile" className="text-slate-700 hover:text-primary">
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-md border border-slate-300 px-3 py-1 text-slate-600 hover:bg-slate-50"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/login" className="rounded-md border border-primary px-3 py-1 text-primary">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
      {user && <ChatList isOpen={showChatList} onClose={() => setShowChatList(false)} />}
    </header>
  );
};

export default Header;

