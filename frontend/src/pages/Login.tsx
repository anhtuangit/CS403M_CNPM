import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

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
      window.google?.accounts.id.renderButton(document.getElementById('google-btn'), {
        theme: 'outline',
        size: 'large'
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [dispatch, navigate]);

  return (
    <section className="max-w-md mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold mb-4">Đăng nhập Google</h1>
      <p className="text-sm text-slate-500 mb-6">Nhanh chóng và an toàn. Không cần mật khẩu.</p>
      <div id="google-btn" className="flex justify-center" />
    </section>
  );
};

export default Login;

