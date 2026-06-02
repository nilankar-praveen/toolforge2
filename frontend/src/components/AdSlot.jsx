export default function AdSlot({ placement = "in-content", className = "" }) {
  return (
    <div
      data-testid={`ad-slot-${placement}`}
      className={`ad-slot ${className}`}
      aria-label={`Advertisement slot ${placement}`}
    >
      <span>Ad · {placement}</span>
    </div>
  );
}
