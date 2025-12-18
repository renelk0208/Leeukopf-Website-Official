// src/components/SeasonalSnowOverlay.tsx

import React, { useMemo } from "react";

type Props = {
  countDesktop?: number;
  countMobile?: number;
};

type Flake = {
  leftPct: number;
  sizePx: number;
  durationS: number;
  delayS: number;
  driftPx: number;
  opacity: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function SeasonalSnowOverlay({
  countDesktop = 18,
  countMobile = 10,
}: Props) {
  const flakes = useMemo(() => {
    const isMobile =
      typeof window !== "undefined" ? window.matchMedia("(max-width: 640px)").matches : false;

    const count = isMobile ? countMobile : countDesktop;

    const list: Flake[] = [];
    for (let i = 0; i < count; i++) {
      const leftPct = Math.random() * 100;
      const sizePx = clamp(2 + Math.random() * 4, 2, 6);
      const durationS = clamp(8 + Math.random() * 10, 8, 18);
      const delayS = Math.random() * 6;
      const driftPx = clamp(-20 + Math.random() * 40, -20, 20);
      const opacity = clamp(0.25 + Math.random() * 0.45, 0.25, 0.7);

      list.push({ leftPct, sizePx, durationS, delayS, driftPx, opacity });
    }
    return list;
  }, [countDesktop, countMobile]);

  return (
    <>
      <style>
        {`
          @keyframes snow-fall {
            0%   { transform: translate3d(var(--drift), -10px, 0); opacity: 0; }
            10%  { opacity: var(--opacity); }
            100% { transform: translate3d(calc(var(--drift) * -1), 110vh, 0); opacity: 0; }
          }

          .snow-overlay {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
          }

          .snow-flake {
            position: absolute;
            top: -10px;
            left: 0;
            width: var(--size);
            height: var(--size);
            border-radius: 9999px;
            background: rgba(255,255,255,0.95);
            box-shadow: 0 0 0 1px rgba(255,255,255,0.15);
            animation: snow-fall var(--duration) linear infinite;
            animation-delay: var(--delay);
            will-change: transform, opacity;
          }

          @media (prefers-reduced-motion: reduce) {
            .snow-overlay { display: none !important; }
          }
        `}
      </style>

      <div className="snow-overlay" aria-hidden="true">
        {flakes.map((f, idx) => (
          <span
            key={idx}
            className="snow-flake"
            style={
              {
                left: `${f.leftPct}%`,
                "--size": `${f.sizePx}px`,
                "--duration": `${f.durationS}s`,
                "--delay": `${f.delayS}s`,
                "--drift": `${f.driftPx}px`,
                "--opacity": `${f.opacity}`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </>
  );
}
