import { useState, useEffect } from 'react';

export function MobileDebugger() {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio
      },
      screen: {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight
      },
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isTouch: 'ontouchstart' in window,
      localStorage: {
        session: localStorage.getItem('baseSeva_session'),
        user: localStorage.getItem('baseSeva_user')
      },
      errors: []
    };

    // Capture any errors
    const originalError = console.error;
    console.error = (...args) => {
      info.errors.push(args.join(' '));
      originalError.apply(console, args);
    };

    setDebugInfo(info);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs z-50 max-h-96 overflow-y-auto">
      <h3 className="font-bold mb-2">Mobile Debug Info</h3>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}
