export default function LoadingSpinner() {
  return (
    <div style={{ textAlign: 'center', padding: 50 }}>
      <div style={{
        width: 40, height: 40,
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #c41230',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto',
      }} />
      <p style={{ marginTop: 10 }}>Đang tải...</p>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}