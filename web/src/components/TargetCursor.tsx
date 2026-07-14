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
  cursorColor = '#ffffff',
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

    // Initial position
    gsap.set(outer, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    gsap.set(dot, { x: window.innerWidth / 2, y: window.innerHeight / 2 });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const moveHandler = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Check if we are over ReviewsSection or Contact
      const targetElement = document.elementFromPoint(mouseX, mouseY);
      const isOverSpecialSection = targetElement?.closest('#reviews, #contact');

      if (isOverSpecialSection) {
        gsap.to(dot, { backgroundColor: '#000000', duration: 0.2 });
        gsap.to(outer, { borderColor: '#d4af37', duration: 0.2 });
      } else {
        gsap.to(dot, { backgroundColor: cursorColor, duration: 0.2 });
        gsap.to(outer, { borderColor: cursorColor, duration: 0.2 });
      }

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

    // Hover effect
    const hoverElements = document.querySelectorAll(targetSelector);
    
    const enterHandler = () => outer.classList.add('pointer-blur');
    const leaveHandler = () => outer.classList.remove('pointer-blur');

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', enterHandler);
      el.addEventListener('mouseleave', leaveHandler);
    });
    
    // MutationObserver to attach events to dynamic elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node instanceof Element) {
            if (node.matches(targetSelector)) {
              node.addEventListener('mouseenter', enterHandler);
              node.addEventListener('mouseleave', leaveHandler);
            }
            node.querySelectorAll(targetSelector).forEach(el => {
              el.addEventListener('mouseenter', enterHandler);
              el.addEventListener('mouseleave', leaveHandler);
            });
          }
        });
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', enterHandler);
        el.removeEventListener('mouseleave', leaveHandler);
      });
      observer.disconnect();
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
