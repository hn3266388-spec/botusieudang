// ✅ Import useAuth từ AuthContext (đã được export)
import { useAuth as useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};