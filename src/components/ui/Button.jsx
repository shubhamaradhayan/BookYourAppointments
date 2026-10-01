function Button({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      className={`button button-${variant} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;
