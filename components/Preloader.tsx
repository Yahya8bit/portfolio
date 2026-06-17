'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type Phase = 'charging' | 'charged' | 'firing' | 'done';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  radius: number;
  hue: number;
}

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('charging');
  const [progress, setProgress] = useState(0); // 0–1
  const progressRef = useRef(0);
  const phaseRef = useRef<Phase>('charging');
  const prefersReducedMotion = useReducedMotion();
  const startTimeRef = useRef<number | null>(null);
  const loadedRef = useRef(false);
  const tickRafRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const beamFiredRef = useRef(false);

  // Keep phaseRef in sync
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Progress tracking + scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const MIN_MS = 2500;
    startTimeRef.current = performance.now();

    function maybeAdvance(elapsed: number) {
      if (elapsed >= MIN_MS && loadedRef.current && phaseRef.current === 'charging') {
        setPhase('charged');
      }
    }

    function tick() {
      const elapsed = performance.now() - (startTimeRef.current ?? 0);
      const timeProgress = Math.min(elapsed / MIN_MS, 1);
      setProgress((prev) => {
        const next = Math.max(prev, timeProgress);
        progressRef.current = next;
        return next;
      });
      maybeAdvance(elapsed);
      if (elapsed < MIN_MS || !loadedRef.current) {
        tickRafRef.current = requestAnimationFrame(tick);
      }
    }

    function onLoad() {
      loadedRef.current = true;
      const elapsed = performance.now() - (startTimeRef.current ?? 0);
      maybeAdvance(elapsed);
    }

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad, { once: true });
    }

    tickRafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(tickRafRef.current);
      window.removeEventListener('load', onLoad);
      document.body.style.overflow = '';
    };
  }, []);

  // charged → firing after 200ms hold
  useEffect(() => {
    if (phase !== 'charged') return;
    const t = setTimeout(() => setPhase('firing'), 200);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#0b1220', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#29b6e8', fontFamily: 'var(--font-poppins)', fontSize: '1rem' }}>
        {Math.round(progress * 100)}%
      </p>
    </div>
  );
}
