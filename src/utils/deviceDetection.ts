// utils/deviceDetection.ts
export const isMobileDevice = (): boolean => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

export const isIOS = (): boolean => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

export const isAndroid = (): boolean => {
  return /Android/i.test(navigator.userAgent);
};

export const isTouchDevice = (): boolean => {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
};

// Check if autoplay is likely to be blocked
export const isAutoplayBlocked = (): boolean => {
  return isMobileDevice();
};

export const getDeviceInfo = () => {
  return {
    isMobile: isMobileDevice(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isTouch: isTouchDevice(),
    autoplayBlocked: isAutoplayBlocked(),
  };
};
