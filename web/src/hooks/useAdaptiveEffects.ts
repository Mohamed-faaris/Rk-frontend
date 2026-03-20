import { useEffect, useMemo, useState } from "react";

type IdleDeadlineLike = {
  didTimeout: boolean;
  timeRemaining: () => number;
};

declare global {
  interface NetworkInformation {
    saveData?: boolean;
    effectiveType?: string;
  }

  interface Navigator {
    deviceMemory?: number;
    connection?: NetworkInformation;
  }
}

export function useAdaptiveEffects() {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [effectsReady, setEffectsReady] = useState(false);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener("resize", updateMobile);

    return () => {
      window.removeEventListener("resize", updateMobile);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 8;
    const memory = navigator.deviceMemory ?? 8;
    const saveData = navigator.connection?.saveData ?? false;
    const effectiveType = navigator.connection?.effectiveType ?? "";
    const hasConstrainedNetwork = /^(slow-2g|2g|3g)$/i.test(effectiveType);
    const lowEnd = cores <= 6 || memory <= 4 || saveData || hasConstrainedNetwork;
    setIsLowEndDevice(lowEnd);
  }, []);

  const canUseHeavyEffects = useMemo(() => {
    return !isMobile && !prefersReducedMotion && !isLowEndDevice;
  }, [isMobile, prefersReducedMotion, isLowEndDevice]);

  useEffect(() => {
    setEffectsReady(false);

    if (!canUseHeavyEffects) {
      return;
    }

    const winWithIdle = window as Window & {
      requestIdleCallback?: (
        callback: (deadline: IdleDeadlineLike) => void,
        options?: { timeout?: number }
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof winWithIdle.requestIdleCallback === "function") {
      const idleId = winWithIdle.requestIdleCallback(
        () => {
          setEffectsReady(true);
        },
        { timeout: 1200 }
      );

      return () => {
        if (typeof winWithIdle.cancelIdleCallback === "function") {
          winWithIdle.cancelIdleCallback(idleId);
        }
      };
    }

    const timer = window.setTimeout(() => {
      setEffectsReady(true);
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [canUseHeavyEffects]);

  return {
    isMobile,
    prefersReducedMotion,
    isLowEndDevice,
    canUseHeavyEffects,
    effectsReady,
  };
}
