import React, { useEffect, useMemo, useState } from "react";

type SeasonalSnowProps = {
  enabled?: boolean;
  flakeCount?: number;
};

/**
 * Lightweight seasonal snow overlay (no canvas, no dependencies).
 * - pointer-events: none (never blocks clicks)
 * - honors prefers-reduced-motion (auto disables)
 * - fixed overlay with high z-index
 */
export default function SeasonalSnow({
  enabled = true,
  flakeCount = 28,
}: SeasonalSnowProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;

    const update = () => setReduceMotion(!!mq.matches);
    update();

    // Safari compatibility
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyMq: any = mq;
    if (mq.addEventListener) mq.addEventListener("change", update);
    else if (anyMq.addListener) anyMq.addListener(update);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else if (anyMq.removeListener) anyMq.removeListener(update);
    };
  }, []);

  const flakes = useMemo(() => {
    // deterministic-ish so it doesn't "jump" too much between renders
    return Array.from({ length: flakeCount }).map((_, i) => {
      const left = (i * (100 / flakeCount) + Math.random() * 6) % 100; // %
      const size = 6 + Math.random() * 10; // px
      const duration = 7 + Math.random() * 10; // s
      const delay = Math.random() * 6; // s
      const drift = -20 + Math.random() * 40; // px
      const opacity = 0.35 + Math.random() * 0.45;
      return { i, left, size, duration, delay, drift, opacity };
    });
  }, [flakeCount]);

  if (!enabled || reduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 60 }}
    >
      {flakes.map((f) => (
        <span
          key={f.i}
          className="absolute top-[-20px] rounded-full bg-white"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            opacity: f.opacity,
            filter: "blur(0.2px)",
            animation: `snow-fall ${f.duration}s linear ${f.delay}s infinite`,
            // drift via CSS var
            ["--drift" as never]: `${f.drift}px`,
          }}
        />
      ))}

      <style>
        {`
          @keyframes snow-fall {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(var(--drift), 110vh, 0); }
          }
        `}
      </style>
    </div>
  );
}
