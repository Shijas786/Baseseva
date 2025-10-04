import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);
    
    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add event listener
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // Fallback for older browsers
      media.addListener(listener);
    }
    
    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        // Fallback for older browsers
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}

// Convenience hooks for common breakpoints
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsLargeDesktop = () => useMediaQuery('(min-width: 1440px)');
export const useIsTouchDevice = () => useMediaQuery('(pointer: coarse)');

// Responsive container hook
export const useResponsiveContainer = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const isLargeDesktop = useIsLargeDesktop();
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    containerClass: isMobile 
      ? 'px-4' 
      : isTablet 
        ? 'px-6 max-w-4xl mx-auto' 
        : isLargeDesktop
          ? 'px-8 max-w-7xl mx-auto'
          : 'px-8 max-w-6xl mx-auto',
    cardPadding: isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8',
    textSize: isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg'
  };
};