import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { LockIcon } from '../icons/IconLock';

declare global {
  interface Window {
    google?: any;
  }
}
const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
    if (!clientId) {
      toast.error('Thiếu GOOGLE_CLIENT_ID trong frontend env');
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          const { credential } = response;
          if (!credential) return;
          try {
            await dispatch(googleLogin(credential)).unwrap();
            toast.success('Đăng nhập thành công');
            navigate('/');
          } catch (error) {
            toast.error(String(error));
          }
        }
      });
      // Render button với theme phù hợp giao diện sáng
      window.google?.accounts.id.renderButton(document.getElementById('google-btn'), {
        theme: 'outline',
        size: 'large',
        width: '300', // Đặt chiều rộng cố định để đẹp hơn
        text: 'signin_with',
        shape: 'pill', // Bo tròn mềm mại
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-slate-900 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Home Background"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/20"></div>
      </div>

      {/* Login Card */}
      <section className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20 text-center">

          {/* Header Icon */}
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <LockIcon />
          </div>

          {/* Titles */}
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">
            Chào mừng trở lại
          </h1>
          <p className="text-slate-500 mb-8 font-medium">
            Đăng nhập để quản lý và khám phá những bất động sản tuyệt vời nhất.
          </p>

          {/* Divider */}
          <div className="relative flex py-2 items-center mb-8">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase font-bold tracking-wider">Tài khoản Google</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Google Button Container */}
          <div className="flex justify-center mb-6 min-h-[50px]">
            <div id="google-btn" className="transform transition hover:scale-105 duration-200" />
          </div>

          {/* Footer Note */}
          <p className="text-xs text-slate-400 mt-6 leading-relaxed">
            Bằng việc tiếp tục, bạn đồng ý với <a href="#" className="underline hover:text-blue-600">Điều khoản dịch vụ</a> và <a href="#" className="underline hover:text-blue-600">Chính sách bảo mật</a> của chúng tôi.
          </p>
        </div>

        {/* Simple Branding underneath */}
        <p className="text-center text-slate-400 text-sm mt-8 font-light">
          &copy; {new Date().getFullYear()} Real Estate Platform. All rights reserved.
        </p>
      </section>
    </div>
  );
};

export default Login;