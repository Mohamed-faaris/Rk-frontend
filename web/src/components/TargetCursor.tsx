import React, { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import './TargetCursor.css';

export interface TargetCursorProps {
  targetSelector?: string;
  hideDefaultCursor?: boolean;
  cursorColor?: string;
  spinDuration?: number; // legacy
  parallaxOn?: boolean;  // legacy
}

const TargetCursor: React.FC<TargetCursorProps> = ({
  targetSelector = '.cursor-target, button, a, [role="button"]',
  hideDefaultCursor = true,
  cursorColor = '#FFD700',
}) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    return (hasTouchScreen && isSmallScreen) || mobileRegex.test(userAgent.toLowerCase());
  }, []);

  useEffect(() => {
    if (isMobile || !outerRef.current || !dotRef.current) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    const outer = outerRef.current;
    const dot = dotRef.current;

    // Initial position with perfect centering
    gsap.set(outer, { x: window.innerWidth / 2, y: window.innerHeight / 2, xPercent: -50, yPercent: -50 });
    gsap.set(dot, { x: window.innerWidth / 2, y: window.innerHeight / 2, xPercent: -50, yPercent: -50 });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const moveHandler = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(dot, { backgroundColor: cursorColor, duration: 0.2 });
      gsap.to(outer, { borderColor: cursorColor, duration: 0.2 });

      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1, ease: 'power3.out', overwrite: 'auto' });
      gsap.to(outer, { x: mouseX, y: mouseY, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
    };

    window.addEventListener('mousemove', moveHandler);

    const mouseDownHandler = () => {
      gsap.to(dot, { scale: 0.7, duration: 0.2 });
      gsap.to(outer, { scale: 0.9, duration: 0.2 });
    };

    const mouseUpHandler = () => {
      gsap.to(dot, { scale: 1, duration: 0.2 });
      gsap.to(outer, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    // Use event delegation for hover effects to handle dynamic elements robustly
    const mouseOverHandler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target && target.closest && target.closest(targetSelector)) {
        outer.classList.add('pointer-blur');
      } else {
        outer.classList.remove('pointer-blur');
      }
    };

    window.addEventListener('mouseover', mouseOverHandler);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      window.removeEventListener('mouseover', mouseOverHandler);
      document.body.style.cursor = originalCursor;
    };
  }, [targetSelector, hideDefaultCursor, cursorColor, isMobile]);

  if (isMobile) return null;

  return (
    <div className="target-cursor-wrapper">
      <div ref={dotRef} className="target-cursor-dot" />
      <div ref={outerRef} className="target-cursor-outer" />
    </div>
  );
};

export default TargetCursor;
