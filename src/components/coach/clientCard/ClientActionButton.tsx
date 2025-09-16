// src/components/coach/clientCard/ClientActionButton.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, ClipboardCheck, Plus } from 'lucide-react';

const SIZE = 64; // px (w-16 / h-16)
const MARGIN = 16; // padding from viewport edges

const actionItems = [
  { label: 'Feedback', icon: <MessageCircle className="h-5 w-5" />, action: () => console.log('Feedback clicked') },
  { label: 'Check In', icon: <ClipboardCheck className="h-5 w-5" />, action: () => console.log('Check In clicked') },
];

export default function ClientActionButton() {
  const wrapperRef = useRef<HTMLDivElement | null>(null); // element that holds left/top
  const innerRef = useRef<HTMLDivElement | null>(null); // element we transform during drag
  const draggingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const movedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const translateRef = useRef({ x: 0, y: 0 });

  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const [viewport, setViewport] = useState<{ w: number; h: number } | null>(null);

  // init position (from localStorage or default bottom-right)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('fab-position');
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setViewport({ w: vw, h: vh });

    const defaultLeft = vw - SIZE - MARGIN;
    const defaultTop = vh - SIZE - MARGIN;

    let initial = saved ? JSON.parse(saved) : { left: defaultLeft, top: defaultTop };
    // clamp
    initial.left = Math.min(Math.max(MARGIN, initial.left), vw - SIZE - MARGIN);
    initial.top = Math.min(Math.max(MARGIN, initial.top), vh - SIZE - MARGIN);
    setPos(initial);

    const onResize = () => {
      const vw2 = window.innerWidth;
      const vh2 = window.innerHeight;
      setViewport({ w: vw2, h: vh2 });
      // re-clamp current pos if needed
      setPos((p) => {
        if (!p) return p;
        return {
          left: Math.min(Math.max(MARGIN, p.left), vw2 - SIZE - MARGIN),
          top: Math.min(Math.max(MARGIN, p.top), vh2 - SIZE - MARGIN),
        };
      });
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // pointer handlers (use document-level pointermove / pointerup)
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      movedRef.current = movedRef.current || Math.hypot(e.clientX - startRef.current.x, e.clientY - startRef.current.y) > 3;
      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;
      translateRef.current = { x: dx, y: dy };

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (innerRef.current) {
          innerRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        }
      });
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      // remove capture if any
      try {
        // find any active pointer captures on wrapper and release - safe guard
        const el = wrapperRef.current;
        if (el && 'releasePointerCapture' in el && (e as any).pointerId) {
          try { (el as any).releasePointerCapture((e as any).pointerId); } catch {}
        }
      } catch {}

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      const dx = translateRef.current.x;
      const dy = translateRef.current.y;

      setPos((prev) => {
        if (!prev || typeof window === 'undefined') return prev;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const rawLeft = startRef.current.left + dx;
        const rawTop = startRef.current.top + dy;
        const newLeft = Math.min(Math.max(MARGIN, Math.round(rawLeft)), vw - SIZE - MARGIN);
        const newTop = Math.min(Math.max(MARGIN, Math.round(rawTop)), vh - SIZE - MARGIN);

        // apply final no-transform
        if (innerRef.current) innerRef.current.style.transform = 'none';
        // persist
        localStorage.setItem('fab-position', JSON.stringify({ left: newLeft, top: newTop }));
        return { left: newLeft, top: newTop };
      });

      // small timeout to reset moved flag (so click won't immediately trigger)
      setTimeout(() => (movedRef.current = false), 50);

      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    // attach on demand (we attach/remove in onPointerDown)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  // onPointerDown handler (attached to main button only)
  const onPointerDownMain = (e: React.PointerEvent) => {
    if (!pos) return;
    // start drag
    draggingRef.current = true;
    movedRef.current = false;
    startRef.current = { x: e.clientX, y: e.clientY, left: pos.left, top: pos.top };
    translateRef.current = { x: 0, y: 0 };

    // capture pointer so we continue receiving events even if cursor leaves button
    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch {}

    // attach document listeners
    const onPointerMove = (ev: PointerEvent) => {
      if (!draggingRef.current) return;
      movedRef.current = movedRef.current || Math.hypot(ev.clientX - startRef.current.x, ev.clientY - startRef.current.y) > 3;
      const dx = ev.clientX - startRef.current.x;
      const dy = ev.clientY - startRef.current.y;
      translateRef.current = { x: dx, y: dy };
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (innerRef.current) innerRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
    };
    const onPointerUp = (ev: PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const dx = translateRef.current.x;
      const dy = translateRef.current.y;
      setPos((prev) => {
        if (!prev || typeof window === 'undefined') return prev;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const rawLeft = startRef.current.left + dx;
        const rawTop = startRef.current.top + dy;
        const newLeft = Math.min(Math.max(MARGIN, Math.round(rawLeft)), vw - SIZE - MARGIN);
        const newTop = Math.min(Math.max(MARGIN, Math.round(rawTop)), vh - SIZE - MARGIN);
        if (innerRef.current) innerRef.current.style.transform = 'none';
        localStorage.setItem('fab-position', JSON.stringify({ left: newLeft, top: newTop }));
        return { left: newLeft, top: newTop };
      });
      setTimeout(() => (movedRef.current = false), 50);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  // click handler: ignore if user just dragged
  const onClickMain = (e: React.MouseEvent) => {
    if (movedRef.current) {
      // swallow accidental click after drag
      e.preventDefault();
      e.stopPropagation();
      movedRef.current = false;
      return;
    }
    setIsOpen((s) => !s);
  };

  if (!pos) return null; // still initializing

  // decide where to render action bubble (left / right) and above/below
  const showLeft = viewport ? pos.left > (viewport.w || 0) / 2 : true;
  const showAbove = viewport ? pos.top > (viewport.h || 0) / 3 : true;

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        left: pos.left,
        top: pos.top,
        width: SIZE,
        height: SIZE,
        zIndex: 9999,
        touchAction: 'none', // prevent double-finger scroll issues
      }}
      aria-hidden={false}
    >
      <div ref={innerRef} style={{ width: '100%', height: '100%', position: 'relative', transform: 'none' }}>
        {/* Actions container */}
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            alignItems: showLeft ? 'flex-end' : 'flex-start',
            ...(showLeft ? { right: SIZE + 12 } : { left: SIZE + 12 }),
            ...(showAbove ? { bottom: 0 } : { top: 0 }),
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
        >
          {isOpen &&
            actionItems.map((it) => (
              <div key={it.label} className="flex items-center gap-3 select-none">
                <span className="text-sm bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-border/50">
                  {it.label}
                </span>
                <Button
                  size="icon"
                  className="rounded-full w-12 h-12 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    it.action();
                    setIsOpen(false);
                  }}
                >
                  {it.icon}
                </Button>
              </div>
            ))}
        </div>

        {/* Main FAB button (drag handle) */}
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            size="icon"
            className="rounded-full w-16 h-16 shadow-2xl z-10 cursor-grab active:cursor-grabbing"
            onPointerDown={onPointerDownMain}
            onClick={onClickMain}
            aria-label="Client actions"
          >
            <div style={{ transform: `rotate(${isOpen ? 45 : 0}deg)`, transition: 'transform 180ms ease' }}>
              <Plus className="h-8 w-8" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
