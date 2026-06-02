import { useEffect, useRef } from "react";

/**
 * Wraps children and reveals them on scroll using IntersectionObserver.
 * Uses CSS classes `.reveal` and `.is-visible` defined in index.css.
 */
export default function Reveal({ children, delay = 0, as: Tag = "div", className = "", ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${className}`} data-delay={delay || undefined} {...rest}>
      {children}
    </Tag>
  );
}
