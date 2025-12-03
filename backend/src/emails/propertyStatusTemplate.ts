interface TemplateParams {
  name: string;
  title: string;
  status: 'approved' | 'rejected';
  reason?: string;
}

const propertyStatusTemplate = ({ name, title, status, reason }: TemplateParams) => {
  const statusText = status === 'approved' ? 'được duyệt' : 'bị từ chối';
  return `
    <div style="font-family:Arial,sans-serif">
      <h2>Xin chào ${name},</h2>
      <p>Tin đăng <strong>${title}</strong> của bạn đã ${statusText}.</p>
      ${
        status === 'rejected'
          ? `<p>Lý do: ${reason ?? 'Thông tin chưa chính xác, vui lòng cập nhật.'}</p>`
          : '<p>Tin đã hiển thị trên trang chủ marketplace.</p>'
      }
      <p>Trân trọng,<br/>Marketplace Team</p>
    </div>
  `;
};

export default propertyStatusTemplate;

