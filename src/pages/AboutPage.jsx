import { APP_NAME, APP_INFO } from '../utils/constants';

const AboutPage = () => {
  return (
    <div className="about-page container">
      <h1>Giới thiệu về {APP_NAME}</h1>
      <div className="about-content">
        <p>
          {APP_NAME} là hệ thống bán xe máy Honda chính hãng, được thành lập với sứ mệnh 
          mang đến cho khách hàng những sản phẩm chất lượng cao cùng dịch vụ chuyên nghiệp.
        </p>
        <p>
          Chúng tôi cam kết cung cấp xe máy chính hãng 100%, bảo hành uy tín, 
          giá cả cạnh tranh và hỗ trợ khách hàng tận tâm.
        </p>
        <h2>Thông tin liên hệ</h2>
        <div className="contact-info">
          <p>📞 {APP_INFO.hotline}</p>
          <p>✉️ {APP_INFO.email}</p>
          <p>📍 {APP_INFO.address}</p>
          <p>🕐 {APP_INFO.workingHours}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;