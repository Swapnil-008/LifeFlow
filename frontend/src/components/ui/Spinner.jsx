function Spinner({ size = 20, className = '' }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export default Spinner;
