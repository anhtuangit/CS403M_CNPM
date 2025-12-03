const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white mt-16">
      <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col gap-2 text-sm text-slate-300">
        <p>BDS Marketplace &copy; {new Date().getFullYear()}</p>
        <p>Kết nối người mua và người bán bất động sản minh bạch, nhanh chóng.</p>
        <p>Liên hệ hỗ trợ: support@example.com</p>
      </div>
    </footer>
  );
};

export default Footer;

