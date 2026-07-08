export default function Button({ children, onClick, variant = 'primary', disabled, type = 'button', style }) {
  const colors = {
    primary: '#c41230',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '10px 20px',
        background: colors[variant] || colors.primary,
        color: 'white',
        border: 'none',
        borderRadius: 6,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        fontWeight: 'bold',
        ...style,
      }}
    >
      {children}
    </button>
  );
}