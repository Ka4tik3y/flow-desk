export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  const styles = {
    primary: "bg-black text-white hover:-translate-y-0.5 hover:bg-black/90",
    secondary: "bg-white text-black ring-1 ring-black/10 hover:-translate-y-0.5 hover:bg-black hover:text-white",
    ghost: "bg-transparent text-black hover:bg-black/5",
    danger: "bg-black text-white hover:bg-red-600",
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition duration-200 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
