import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { getPropertyById } from '../services/propertyService';
import XLSX from 'xlsx';

// Xem hợp đồng dạng HTML để in
export const viewContract = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const property = await getPropertyById(id);
    
    if (!property) {
      return next(createHttpError(404, 'Property not found'));
    }

    const formatPrice = (price: number, unit?: string, listingType?: string) => {
      const unitText = unit === 'billion' ? 'tỷ' : 'triệu';
      const suffix = listingType === 'rent' ? '/tháng' : '';
      return `${price.toLocaleString('vi-VN')} ${unitText}${suffix}`;
    };

    const owner = property.owner as any;
    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hợp đồng - ${property.title}</title>
  <style>
    body {
      font-family: 'Times New Roman', serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      line-height: 1.6;
    }
    h1 {
      text-align: center;
      text-transform: uppercase;
      margin-bottom: 30px;
      font-size: 20px;
    }
    h2 {
      font-size: 16px;
      margin-top: 20px;
      margin-bottom: 10px;
      border-bottom: 1px solid #000;
      padding-bottom: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    table td {
      padding: 8px;
      border: 1px solid #ddd;
    }
    table td:first-child {
      font-weight: bold;
      width: 30%;
      background-color: #f5f5f5;
    }
    .signature {
      margin-top: 50px;
      display: flex;
      justify-content: space-around;
    }
    .signature div {
      text-align: center;
    }
    @media print {
      body { padding: 20px; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <button onclick="window.print()" style="position: fixed; top: 20px; right: 20px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">In hợp đồng</button>
  
  <h1>HỢP ĐỒNG ${property.listingType === 'rent' ? 'CHO THUÊ' : 'MUA BÁN'} BẤT ĐỘNG SẢN</h1>
  
  <p style="text-align: center; margin-bottom: 30px;">
    <strong>Số:</strong> HD-${property._id.toString().slice(-6)}<br>
    <strong>Ngày:</strong> ${new Date().toLocaleDateString('vi-VN')}
  </p>

  <h2>THÔNG TIN BẤT ĐỘNG SẢN</h2>
  <table>
    <tr><td>Tiêu đề</td><td>${property.title}</td></tr>
    <tr><td>Địa chỉ</td><td>${property.location}</td></tr>
    <tr><td>Loại bất động sản</td><td>${property.propertyType}</td></tr>
    <tr><td>Diện tích</td><td>${property.area} m²</td></tr>
    <tr><td>Giá ${property.listingType === 'rent' ? 'thuê' : 'bán'}</td><td>${formatPrice(property.price, property.priceUnit, property.listingType)}</td></tr>
    ${property.bedrooms ? `<tr><td>Số phòng ngủ</td><td>${property.bedrooms}</td></tr>` : ''}
    ${property.bathrooms ? `<tr><td>Số phòng tắm</td><td>${property.bathrooms}</td></tr>` : ''}
    ${property.floors ? `<tr><td>Số tầng</td><td>${property.floors}</td></tr>` : ''}
    ${property.metadata?.facing ? `<tr><td>Hướng</td><td>${property.metadata.facing}</td></tr>` : ''}
  </table>

  <h2>THÔNG TIN NGƯỜI BÁN</h2>
  <table>
    <tr><td>Tên</td><td>${owner?.name || 'N/A'}</td></tr>
    <tr><td>Email</td><td>${owner?.email || 'N/A'}</td></tr>
    ${owner?.phone ? `<tr><td>Điện thoại</td><td>${owner.phone}</td></tr>` : ''}
  </table>

  <h2>MÔ TẢ CHI TIẾT</h2>
  <p style="text-align: justify; white-space: pre-wrap;">${property.description}</p>

  <h2>ĐIỀU KHOẢN VÀ ĐIỀU KIỆN</h2>
  <p>Hợp đồng này được tạo tự động từ hệ thống BDS Marketplace. Các bên cần xem xét và ký kết hợp đồng chính thức theo quy định pháp luật.</p>

  <div class="signature">
    <div>
      <p><strong>NGƯỜI BÁN</strong></p>
      <p style="margin-top: 50px;">${owner?.name || 'N/A'}</p>
    </div>
    <div>
      <p><strong>NGƯỜI MUA/THUÊ</strong></p>
      <p style="margin-top: 50px;">_________________</p>
    </div>
  </div>
</body>
</html>
    `;

    res.send(html);
  } catch (error) {
    next(error);
  }
};

export const generateContract = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const property = await getPropertyById(id);
    
    if (!property) {
      return next(createHttpError(404, 'Property not found'));
    }

    // Tạo dữ liệu hợp đồng
    const contractData = [
      ['HỢP ĐỒNG MUA BÁN/CHO THUÊ BẤT ĐỘNG SẢN'],
      [],
      ['THÔNG TIN BẤT ĐỘNG SẢN'],
      ['Tiêu đề:', property.title],
      ['Địa chỉ:', property.location],
      ['Loại:', property.propertyType],
      ['Diện tích:', `${property.area} m²`],
      ['Giá:', `${property.price} ${property.priceUnit === 'billion' ? 'tỷ' : 'triệu'} ${property.listingType === 'rent' ? '/tháng' : ''}`],
      ['Số phòng ngủ:', property.bedrooms || 'N/A'],
      ['Số phòng tắm:', property.bathrooms || 'N/A'],
      ['Số tầng:', property.floors || 'N/A'],
      ['Hướng:', property.metadata?.facing || 'N/A'],
      [],
      ['THÔNG TIN NGƯỜI BÁN'],
      ['Tên:', (property.owner as any)?.name || 'N/A'],
      ['Email:', (property.owner as any)?.email || 'N/A'],
      ['Điện thoại:', (property.owner as any)?.phone || 'N/A'],
      [],
      ['MÔ TẢ'],
      [property.description],
      [],
      ['Ngày tạo hợp đồng:', new Date().toLocaleDateString('vi-VN')],
    ];

    // Tạo workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(contractData);
    
    // Điều chỉnh độ rộng cột
    ws['!cols'] = [{ wch: 20 }, { wch: 50 }];
    
    XLSX.utils.book_append_sheet(wb, ws, 'Hợp đồng');
    
    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="hop-dong-${property.title.replace(/\s+/g, '-')}.xlsx"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

