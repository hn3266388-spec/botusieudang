import { useAuth } from '../hooks/useAuth';
export default function ProfilePage() {
  const { user } = useAuth();
  return <div><h2>Tai khoan</h2><p>Username: {user?.username}</p><p>Role: {user?.role}</p></div>;
}
