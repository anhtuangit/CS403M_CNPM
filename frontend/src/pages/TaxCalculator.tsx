import { useState } from 'react';

const TaxCalculator = () => {
  const [price, setPrice] = useState(5_000_000_000);
  const [taxRate, setTaxRate] = useState(2.0);

  const tax = (price * taxRate) / 100;

  return (
    <section className="max-w-lg mx-auto px-4 py-10 space-y-4">
      <h1 className="text-3xl font-semibold">Tax Calculator</h1>
      <p className="text-sm text-slate-500">Tính nhanh thuế chuyển nhượng (mặc định 2%).</p>
      <div className="grid gap-4 bg-white rounded-xl shadow p-6">
        <label className="text-sm text-slate-600">
          Giá trị chuyển nhượng (VNĐ)
          <input
            className="form-input mt-1"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </label>
        <label className="text-sm text-slate-600">
          Thuế suất (%)
          <input
            className="form-input mt-1"
            type="number"
            step="0.1"
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
          />
        </label>
        <div className="text-lg font-semibold">
          Thuế dự kiến:{' '}
          <span className="text-primary">{tax.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
        </div>
      </div>
    </section>
  );
};

export default TaxCalculator;

