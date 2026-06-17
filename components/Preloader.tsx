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

function WarriorSVG({ progress }: { progress: number }) {
  const orbRadius = 12 + progress * 22;      // 12 → 34
  const orbOpacity = 0.3 + progress * 0.7;   // 0.3 → 1.0
  const glowBlur = 6 + progress * 18;        // 6 → 24
  const glowRadius = orbRadius * 2.8;
  const figureGlowOpacity = 0.4 * progress;

  return (
    <svg
      viewBox="0 0 300 420"
      width="300"
      height="420"
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <filter id="orb-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={glowBlur} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="figure-glow" x="-20%" y="-10%" width="140%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation={4 + progress * 8} result="blur" />
          <feFlood floodColor="#29b6e8" floodOpacity={figureGlowOpacity} result="color" />
          <feComposite in="color" in2="blur" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="orb-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#29b6e8" />
          <stop offset="100%" stopColor="#1565c0" />
        </radialGradient>
      </defs>

      {/* Orb glow halo behind figure */}
      <circle
        cx="150"
        cy="232"
        r={glowRadius}
        fill="#1565c0"
        opacity={orbOpacity * 0.35}
        filter="url(#orb-glow)"
      />

      {/* Warrior silhouette — original design, wide ki-charge stance */}
      <g fill="black" filter="url(#figure-glow)">
        {/* Head */}
        <circle cx="150" cy="45" r="28" />
        {/* Neck */}
        <rect x="138" y="70" width="24" height="18" />
        {/* Torso */}
        <polygon points="78,86 222,86 192,175 108,175" />
        {/* Left upper arm */}
        <polygon points="78,86 58,94 22,152 54,164" />
        {/* Left forearm — angled toward center below waist */}
        <polygon points="22,152 54,164 96,220 68,224" />
        {/* Right upper arm */}
        <polygon points="222,86 242,94 278,152 246,164" />
        {/* Right forearm — angled toward center below waist */}
        <polygon points="278,152 246,164 204,220 232,224" />
        {/* Left hand cupped */}
        <ellipse cx="80" cy="228" rx="20" ry="10" />
        {/* Right hand cupped */}
        <ellipse cx="220" cy="228" rx="20" ry="10" />
        {/* Left thigh — wide stance angled outward */}
        <polygon points="108,175 150,175 138,272 92,272" />
        {/* Right thigh */}
        <polygon points="150,175 192,175 208,272 162,272" />
        {/* Left shin */}
        <polygon points="92,272 138,272 128,365 80,365" />
        {/* Right shin */}
        <polygon points="162,272 208,272 220,365 174,365" />
        {/* Left foot */}
        <ellipse cx="96" cy="374" rx="32" ry="11" />
        {/* Right foot */}
        <ellipse cx="204" cy="374" rx="32" ry="11" />
      </g>

      {/* Energy orb between cupped hands */}
      <circle
        cx="150"
        cy="232"
        r={orbRadius}
        fill="url(#orb-grad)"
        opacity={orbOpacity}
        filter="url(#orb-glow)"
      />
    </svg>
  );
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

  // Canvas particle loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = particlesRef.current;
    let frameCount = 0;

    function spawnParticle() {
      if (!canvas) return;
      const cx = canvas.width / 2;
      // Orb is at SVG y=232 inside 420-tall SVG centered on screen.
      // Offset from SVG center (y=210) to orb: 232-210 = +22px
      const cy = canvas.height / 2 + 22;
      const angle = Math.random() * Math.PI * 2;
      const dist = 15 + Math.random() * 30;
      particles.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 1.4,
        vy: -(1.5 + Math.random() * 2.5),
        alpha: 0.7 + Math.random() * 0.3,
        radius: 1.5 + Math.random() * 3,
        hue: 185 + Math.random() * 30, // cyan range
      });
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2 + 22;
      const prog = progressRef.current;

      // Radial glow bloom behind figure
      const bloomR = 80 + prog * 180;
      const bloom = ctx.createRadialGradient(cx, cy - 80, 0, cx, cy - 80, bloomR);
      bloom.addColorStop(0, `rgba(41,182,232,${0.18 * prog})`);
      bloom.addColorStop(0.5, `rgba(21,101,192,${0.1 * prog})`);
      bloom.addColorStop(1, 'rgba(21,101,192,0)');
      ctx.fillStyle = bloom;
      ctx.beginPath();
      ctx.arc(cx, cy - 80, bloomR, 0, Math.PI * 2);
      ctx.fill();

      // Spawn particles — more frequent as progress increases
      frameCount++;
      const spawnEvery = Math.max(2, Math.round(10 - prog * 8));
      if (frameCount % spawnEvery === 0 && particles.length < 80) {
        spawnParticle();
      }

      // Update + draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.007;
        if (p.alpha <= 0 || p.y < -10) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},90%,75%,${p.alpha})`;
        ctx.fill();
      }

      // Screen shake — applied directly to DOM via ref to avoid setState per frame
      if (prog > 0.7 && phaseRef.current === 'charging') {
        const amplitude = ((prog - 0.7) / 0.3) * 4; // 0→4px
        const now = Date.now();
        const sx = Math.sin(now * 0.025) * amplitude;
        const sy = Math.cos(now * 0.018) * amplitude * 0.6;
        if (overlayRef.current) {
          overlayRef.current.style.transform = `translate(${sx}px,${sy}px)`;
        }
      } else if (overlayRef.current) {
        overlayRef.current.style.transform = 'translate(0,0)';
      }

      canvasRafRef.current = requestAnimationFrame(draw);
    }

    canvasRafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(canvasRafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <AnimatePresence>
        {phase !== 'done' && (
          <motion.div
            key="preloader-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
            style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#0b1220' }}
          >
            <canvas
              ref={canvasRef}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            />
            <div
              ref={overlayRef}
              style={{
                position: 'relative',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WarriorSVG progress={progress} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Beam flash — separate AnimatePresence so it outlives the overlay */}
      <AnimatePresence>
        {phase === 'firing' && (
          <motion.div
            key="beam-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeOut' } }}
            transition={{ duration: 0.08, ease: 'easeIn' }}
            onAnimationComplete={(definition) => {
              // Only advance on the enter animation, not the exit
              if (!beamFiredRef.current) {
                beamFiredRef.current = true;
                setPhase('done');
              }
            }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 52,
              background: '#ffffff',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
