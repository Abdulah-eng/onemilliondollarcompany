// src/components/coach/clientCard/ClientActionButton.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Plus } from 'lucide-react';
import { CheckInModal } from './CheckInModal';

const SIZE = 64; // px (w-16 / h-16)
const MARGIN = 16; // padding from viewport edges

export default function ClientActionButton() {
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  const handleSendCheckIn = (data: { title: string; message: string }) => {
    console.log('Sending check-in:', data);
    // You would add your API call or state update logic here
  };

  const actionItems = [
    // Removed the "Feedback" option as requested
    { label: 'Check In', icon: <ClipboardCheck className="h-5 w-5" />, action: () => setIsCheckInModalOpen(true) },
  ];

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  const draggingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const movedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const translateRef = useRef({ x: 0, y: 0 });

  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const [viewport, setViewport] = useState<{ w: number; h: number } | null>(null);

  // init position
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('fab-position');
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setViewport({ w: vw, h: vh });

    const defaultLeft = vw - SIZE - MARGIN;
    const defaultTop = vh - SIZE - MARGIN;

    let initial = saved ? JSON.parse(saved) : { left: defaultLeft, top: defaultTop };
    // clamp to viewport
    initial.left = Math.min(Math.max(MARGIN, initial.left), vw - SIZE - MARGIN);
    initial.top = Math.min(Math.max(MARGIN, initial.top), vh - SIZE - MARGIN);
    setPos(initial);

    const onResize = () => {
      const vw2 = window.innerWidth;
      const vh2 = window.innerHeight;
      setViewport({ w: vw2, h: vh2 });
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

  // start dragging
  const onPointerDownMain = (e: React.PointerEvent) => {
    if (!pos) return;
    draggingRef.current = true;
    movedRef.current = false;
    startRef.current = { x: e.clientX, y: e.clientY, left: pos.left, top: pos.top };
    translateRef.current = { x: 0, y: 0 };

    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch {}

    const onPointerMove = (ev: PointerEvent) => {
      if (!draggingRef.current) return;
      movedRef.current =
        movedRef.current || Math.hypot(ev.clientX - startRef.current.x, ev.clientY - startRef.current.y) > 3;

      const dx = ev.clientX - startRef.current.x;
      const dy = ev.clientY - startRef.current.y;

      // clamp while dragging
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const rawLeft = startRef.current.left + dx;
      const rawTop = startRef.current.top + dy;
      const clampedLeft = Math.min(Math.max(MARGIN, rawLeft), vw - SIZE - MARGIN);
      const clampedTop = Math.min(Math.max(MARGIN, rawTop), vh - SIZE - MARGIN);

      translateRef.current = { x: clampedLeft - startRef.current.left, y: clampedTop - startRef.current.top };

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (innerRef.current) {
          innerRef.current.style.transform = `translate3d(${translateRef.current.x}px, ${translateRef.current.y}px, 0)`;
        }
      });
    };

    const onPointerUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      setPos((prev) => {
        if (!prev) return prev;
        const newLeft = prev.left + translateRef.current.x;
        const newTop = prev.top + translateRef.current.y;
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

  // click handler
  const onClickMain = (e: React.MouseEvent) => {
    if (movedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      movedRef.current = false;
      return;
    }
    setIsOpen((s) => !s);
  };

  if (!pos) return null;

  const showLeft = viewport ? pos.left > (viewport.w || 0) / 2 : true;
  const showAbove = viewport ? pos.top > (viewport.h || 0) / 3 : true;

  return (
    <>
      <div
        ref={wrapperRef}
        style={{
          position: 'fixed',
          left: pos.left,
          top: pos.top,
          width: SIZE,
          height: SIZE,
          touchAction: 'none',
          zIndex: isCheckInModalOpen ? -1 : 999, // ✅ Set z-index to a lower value when modal is open
        }}
      >
        <div ref={innerRef} style={{ width: '100%', height: '100%', position: 'relative', transform: 'none' }}>
          {/* Actions */}
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

          {/* Main FAB */}
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
      <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        onSend={handleSendCheckIn}
      />
    </>
  );
}
