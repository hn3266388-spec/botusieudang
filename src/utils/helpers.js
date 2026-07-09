// Format currency VND
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0₫';
  return Number(amount).toLocaleString('vi-VN') + '₫';
};

// Format date
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Order status
export const getOrderStatusLabel = (status) => {
  const map = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    PROCESSING: 'Đang xử lý',
    SHIPPED: 'Đang giao hàng',
    DELIVERED: 'Đã giao hàng',
    CANCELLED: 'Đã hủy',
    COMPLETED: 'Hoàn thành',
  };
  return map[status] || status;
};

// Order status color
export const getOrderStatusColor = (status) => {
  const map = {
    PENDING: '#ffc107',
    CONFIRMED: '#17a2b8',
    PROCESSING: '#007bff',
    SHIPPED: '#6f42c1',
    DELIVERED: '#28a745',
    CANCELLED: '#dc3545',
    COMPLETED: '#28a745',
  };
  return map[status] || '#6c757d';
};

// Product helpers
export const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.content) return data.content;
  if (data?.data) return data.data;
  return [];
};

export const getProductId = (item) => item?.productId || item?.id;
export const getProductName = (item) => item?.productName || item?.name || '';
export const getProductPrice = (item) => item?.price || 0;
export const getProductImage = (item) => item?.imageUrl || item?.image || '';

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const baseUrl = import.meta.env.VITE_IMAGE_URL || 'https://ranch-expediter-excursion.ngrok-free.dev';
  // Đảm bảo có / giữa baseUrl và imagePath
  return `${baseUrl}/${imagePath.replace(/^\//, '')}`;
};