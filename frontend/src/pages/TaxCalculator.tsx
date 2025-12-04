import { useState, useEffect } from 'react';

// --- Helper Formatting ---
const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const TaxCalculator = () => {
  const [price, setPrice] = useState<number>(5000000000); // 5 Tỷ mặc định
  const [brokerageRate, setBrokerageRate] = useState<number>(1.0); // 1% Môi giới

  // Kết quả
  const [incomeTax, setIncomeTax] = useState(0);
  const [registrationFee, setRegistrationFee] = useState(0);
  const [notaryFee, setNotaryFee] = useState(0);
  const [brokerageFee, setBrokerageFee] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  // Logic tính phí công chứng (Theo thông tư 257/2016/TT-BTC)
  const calculateNotaryFee = (val: number) => {
    if (val <= 50000000) return 50000;
    if (val <= 100000000) return 100000;
    if (val <= 1000000000) return val * 0.001;
    if (val <= 3000000000) return 1000000 + (val - 1000000000) * 0.0006;
    if (val <= 5000000000) return 2200000 + (val - 3000000000) * 0.0005;
    if (val <= 10000000000) return 3200000 + (val - 5000000000) * 0.0004;
    // Trên 10 tỷ
    return 5200000 + (val - 10000000000) * 0.0003;
    // Lưu ý: Có mức trần tối đa, nhưng ở đây tạm tính theo công thức lũy tiến phổ biến.
  };

  useEffect(() => {
    // 1. Thuế TNCN: 2% (Thường bên bán chịu)
    const iTax = price * 0.02;

    // 2. Lệ phí trước bạ: 0.5% (Thường bên mua chịu, max 500tr/TS nhưng luật mới có thể đổi, giữ 0.5%)
    const rFee = price * 0.005;

    // 3. Phí công chứng
    const nFee = calculateNotaryFee(price);

    // 4. Phí môi giới
    const bFee = price * (brokerageRate / 100);

    setIncomeTax(iTax);
    setRegistrationFee(rFee);
    setNotaryFee(nFee);
    setBrokerageFee(bFee);
    setTotalCost(iTax + rFee + nFee + bFee);
  }, [price, brokerageRate]);

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">Công cụ tính phí Chuyển nhượng</h1>
          <p className="text-slate-500">
            Ước tính chi tiết các loại thuế, phí cần đóng khi mua bán nhà đất theo quy định hiện hành.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8">

          {/* --- INPUT FORM --- */}
          <div className="md:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </span>
              Nhập thông tin giao dịch
            </h2>

            <div className="space-y-6">
              {/* Price Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Giá trị chuyển nhượng (VNĐ)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition font-mono text-lg text-slate-800"
                    placeholder="VD: 5000000000"
                  />
                  <span className="absolute right-4 top-3.5 text-slate-400 font-bold">đ</span>
                </div>
                <p className="text-xs text-blue-600 mt-2 italic">
                  * Nhập giá ghi trên hợp đồng công chứng hoặc giá thực tế.
                </p>
              </div>

              {/* Brokerage Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">Phí môi giới</label>
                  <span className="font-bold text-blue-600">{brokerageRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={brokerageRate}
                  onChange={(e) => setBrokerageRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0% (Tự bán)</span>
                  <span>5%</span>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-sm text-yellow-800 space-y-2">
                <p className="font-bold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Lưu ý:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-xs opacity-90">
                  <li><strong>Thuế TNCN (2%):</strong> Thường do bên Bán đóng.</li>
                  <li><strong>Lệ phí trước bạ (0.5%):</strong> Thường do bên Mua đóng khi sang tên sổ.</li>
                  <li><strong>Phí công chứng:</strong> Tính theo giá trị tài sản (lũy tiến).</li>
                </ul>
              </div>
            </div>
          </div>

          {/* --- RESULT SUMMARY --- */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl"></div>

              <h3 className="text-lg font-bold mb-6 text-slate-200 border-b border-slate-700 pb-2">Dự toán chi phí</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Thuế TNCN (2%)</span>
                  <span className="font-mono font-bold">{formatCurrency(incomeTax)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Lệ phí trước bạ (0.5%)</span>
                  <span className="font-mono font-bold">{formatCurrency(registrationFee)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Phí công chứng (Ước tính)</span>
                  <span className="font-mono font-bold text-orange-400">{formatCurrency(notaryFee)}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                  <span className="text-slate-300 text-sm">Phí môi giới ({brokerageRate}%)</span>
                  <span className="font-mono font-bold text-blue-400">{formatCurrency(brokerageFee)}</span>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-200 font-bold">Tổng cộng chi phí</span>
                    <span className="text-2xl font-extrabold text-white">{formatCurrency(totalCost)}</span>
                  </div>
                  <p className="text-right text-xs text-slate-500 mt-1">~ {(totalCost / price * 100).toFixed(2)}% giá trị tài sản</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">Lời khuyên</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Trong thực tế, các bên có thể thỏa thuận "Bao sang tên" (Bên bán chịu hết) hoặc "Bên nào lo bên nấy". Hãy ghi rõ điều khoản ai chịu phí nào trong Hợp đồng đặt cọc để tránh tranh chấp.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;