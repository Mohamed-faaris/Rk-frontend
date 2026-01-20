import { useEffect, useRef, useState } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

/**
 * Global mouse position hook with RAF throttling
 * Single listener attached to window, shared across all components
 * Uses requestAnimationFrame to prevent excessive re-renders
 */
export function useMouse(): MousePosition {
  const [pos, setPos] = useState<MousePosition>({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);
  const posRef = useRef<MousePosition>({ x: 0, y: 0 });
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Only set up listener once globally
    if (isInitializedRef.current) {
      return;
    }
    isInitializedRef.current = true;

    const handleMouseMove = (e: MouseEvent) => {
      // Update ref immediately (no re-render)
      posRef.current = { x: e.clientX, y: e.clientY };

      // Throttle state updates with RAF
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        setPos(posRef.current);
        frameRef.current = null;
      });
    };

    // Attach single global listener
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      // Clean up
      window.removeEventListener('mousemove', handleMouseMove);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return pos;
}

/**
 * Alternative: Use raw ref without state updates for performance-critical components
 * Returns a ref that updates immediately without triggering re-renders
 */
export function useMouseRef() {
  const posRef = useRef<MousePosition>({ x: 0, y: 0 });
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }
    isInitializedRef.current = true;

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return posRef;
}
