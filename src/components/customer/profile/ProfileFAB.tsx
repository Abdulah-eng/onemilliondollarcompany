'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Constants
const SIZE = 64; 
const MARGIN = 24; 

interface ProfileFABProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProfileFAB({ isEditing, isSaving, onEdit, onSave, onCancel }: ProfileFABProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  const draggingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const movedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const translateRef = useRef({ x: 0, y: 0 });

  const [pos, setPos] = useState<{ left: number; top: number } | null>(null); 
  const [viewport, setViewport] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updatePosition = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setViewport({ w: vw, h: vh });
      setPos({ left: vw - SIZE - MARGIN, top: vh - SIZE - MARGIN });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  const onPointerDownMain = (e: React.PointerEvent) => {
    if (!pos) return;
    draggingRef.current = true;
    movedRef.current = false;
    startRef.current = { x: e.clientX, y: e.clientY, left: pos.left, top: pos.top };
    translateRef.current = { x: 0, y: 0 };
    
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || !pos) return;
    
    movedRef.current = true;
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      if (!pos) return;
      
      const deltaX = e.clientX - startRef.current.x;
      const deltaY = e.clientY - startRef.current.y;
      
      const newLeft = Math.max(0, Math.min(viewport?.w ? viewport.w - SIZE : window.innerWidth - SIZE, startRef.current.left + deltaX));
      const newTop = Math.max(0, Math.min(viewport?.h ? viewport.h - SIZE : window.innerHeight - SIZE, startRef.current.top + deltaY));
      
      translateRef.current = { x: newLeft - pos.left, y: newTop - pos.top };
      
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${translateRef.current.x}px, ${translateRef.current.y}px, 0)`;
      }
    });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    
    draggingRef.current = false;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    
    if (movedRef.current && pos) {
      const newLeft = Math.max(0, Math.min(viewport?.w ? viewport.w - SIZE : window.innerWidth - SIZE, pos.left + translateRef.current.x));
      const newTop = Math.max(0, Math.min(viewport?.h ? viewport.h - SIZE : window.innerHeight - SIZE, pos.top + translateRef.current.y));
      
      setPos({ left: newLeft, top: newTop });
      translateRef.current = { x: 0, y: 0 };
      
      if (innerRef.current) {
        innerRef.current.style.transform = 'translate3d(0px, 0px, 0)';
      }
    }
  };

  const onClickMain = (e: React.MouseEvent) => {
    if (movedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    if (isEditing) {
      onSave();
    } else {
      onEdit();
    }
  };

  if (!pos) return null;

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        right: MARGIN, 
        bottom: MARGIN, 
        width: SIZE,
        height: SIZE,
        touchAction: 'none',
        zIndex: 999,
      }}
    >
      <div 
        ref={innerRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          position: 'relative', 
          transform: `translate3d(${pos.left - (window.innerWidth - SIZE - MARGIN)}px, ${pos.top - (window.innerHeight - SIZE - MARGIN)}px, 0)`,
          transition: draggingRef.current ? 'none' : 'transform 100ms ease-out',
        }}>
        
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            size="icon"
            className="rounded-full w-16 h-16 shadow-2xl z-10 cursor-grab active:cursor-grabbing bg-primary hover:bg-primary/90 transition-colors"
            onPointerDown={onPointerDownMain}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onClick={onClickMain}
            disabled={isSaving}
            aria-label={isEditing ? 'Save changes' : 'Edit profile'}
          >
            {isSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Edit className="h-8 w-8 text-primary-foreground" />
              </motion.div>
            ) : isEditing ? (
              <Save className="h-8 w-8 text-primary-foreground" />
            ) : (
              <Edit className="h-8 w-8 text-primary-foreground" />
            )}
          </Button>
        </div>

        {/* Cancel button when editing */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="absolute -left-20 top-1/2 -translate-y-1/2"
            >
              <Button
                size="icon"
                variant="destructive"
                className="rounded-full w-12 h-12 shadow-lg"
                onClick={onCancel}
                aria-label="Cancel editing"
              >
                <X className="h-6 w-6" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
