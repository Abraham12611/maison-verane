import { useCallback, useEffect, useRef, useState } from 'react';
import { usePlayer } from '@videojs/react/video';

const MIN_ANGLE = -135;
const MAX_ANGLE = 135;
const SWEEP = MAX_ANGLE - MIN_ANGLE;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const normalizeDelta = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;

type Props = { image: string; className?: string };

/**
 * Circular volume dial (Horlogerie crown, Grand Tourer knob). It is a real
 * `role="slider"` bound to the Video.js volume state. Dragging is relative
 * (it turns from where you grabbed it, clamped to 0-100%), so it never jumps
 * and never spins endlessly.
 */
export function RotaryVolume({ image, className }: Props) {
  const store = usePlayer();
  const volume = usePlayer((s) => s.volume);
  const muted = usePlayer((s) => s.muted);
  const availability = usePlayer((s) => s.volumeAvailability);

  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startAngle: number; startVolume: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const vol = typeof volume === 'number' ? volume : 1;
  const pct = Math.round(vol * 100);

  const apply = useCallback(
    (next: number) => {
      const v = Math.round(clamp01(next) * 100) / 100;
      store.setVolume(v);
      if (v > 0 && store.muted) store.setMuted(false);
    },
    [store],
  );

  const angleAt = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI;
  };

  // Wheel needs a non-passive listener so the page does not scroll while turning.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      apply(store.volume + (e.deltaY < 0 ? 0.05 : -0.05));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [apply, store]);

  if (typeof volume !== 'number' || (availability && availability !== 'available')) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = { ArrowUp: 0.05, ArrowRight: 0.05, ArrowDown: -0.05, ArrowLeft: -0.05, PageUp: 0.1, PageDown: -0.1 }[e.key];
    if (step !== undefined) apply(vol + step);
    else if (e.key === 'Home') apply(0);
    else if (e.key === 'End') apply(1);
    else return;
    e.preventDefault();
  };

  const angle = MIN_ANGLE + vol * SWEEP;

  return (
    <div
      ref={ref}
      className={['ecrin-dial', className].filter(Boolean).join(' ')}
      role="slider"
      tabIndex={0}
      aria-label="Volume"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-valuetext={muted ? `${pct} percent, muted` : `${pct} percent`}
      data-dragging={dragging || undefined}
      data-muted={muted || undefined}
      style={{ ['--ecrin-vol' as string]: `${pct}%`, ['--ecrin-dial-angle' as string]: `${angle}deg` }}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { startAngle: angleAt(e), startVolume: vol };
        setDragging(true);
        ref.current?.focus();
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const delta = normalizeDelta(angleAt(e) - drag.current.startAngle);
        apply(drag.current.startVolume + delta / SWEEP);
      }}
      onPointerUp={() => {
        drag.current = null;
        setDragging(false);
      }}
      onPointerCancel={() => {
        drag.current = null;
        setDragging(false);
      }}
    >
      <svg className="ecrin-dial-arc" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <circle className="arc-track" cx="50" cy="50" r="46" pathLength="100" strokeDasharray="75 100" transform="rotate(135 50 50)" />
        <circle className="arc-value" cx="50" cy="50" r="46" pathLength="100" strokeDasharray={`${vol * 75} 100`} transform="rotate(135 50 50)" />
      </svg>
      <img className="ecrin-dial-knob" src={image} alt="" draggable={false} />
      <span className="ecrin-dial-readout" aria-hidden="true">{pct}%</span>
    </div>
  );
}
