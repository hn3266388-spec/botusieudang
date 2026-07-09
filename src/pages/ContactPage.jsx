import { APP_INFO } from '../utils/constants';
export default function ContactPage() {
  return <div><h2>Lien he</h2><p>{APP_INFO.hotline}</p><p>{APP_INFO.email}</p><p>{APP_INFO.address}</p><p>{APP_INFO.workingHours}</p></div>;
}
