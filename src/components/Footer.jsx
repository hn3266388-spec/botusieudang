import { APP_NAME, APP_INFO } from '../utils/constants';

export default function Footer() {
  return (
    <footer style={{ background: '#222', color: '#aaa', textAlign: 'center', padding: 20, marginTop: 40 }}>
      <p style={{ fontWeight: 'bold', color: 'white' }}>🏍️ {APP_NAME}</p>
      <p>📞 {APP_INFO.hotline} | ✉️ {APP_INFO.email}</p>
      <p>📍 {APP_INFO.address}</p>
      <p style={{ fontSize: 12, marginTop: 10 }}>© 2026 {APP_NAME}. All rights reserved.</p>
    </footer>
  );
}