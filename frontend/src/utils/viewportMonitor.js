/**
 * Viewport Monitor & Aspect Ratio Diagnostics (Volume 14)
 * Tracks viewport changes, detects notch/safe-area support, and alerts on
 * extreme aspect ratios (e.g. thin foldable cover screens, ultra-wide tablets).
 */

export const initializeViewportDiagnostics = (onLayoutAlert) => {
  if (typeof window === 'undefined') return;

  const performCheck = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;

    const diagnosticPayload = {
      width,
      height,
      aspectRatio: parseFloat(aspectRatio.toFixed(2)),
      isNotchDevice: envSafeCheck(),
      deviceClass: 'desktop'
    };

    if (width < 360) {
      diagnosticPayload.deviceClass = 'compact-mobile';
    } else if (width < 640) {
      diagnosticPayload.deviceClass = 'standard-mobile';
    } else if (width < 1024) {
      diagnosticPayload.deviceClass = 'tablet';
    }

    // Identify extreme aspect ratios (e.g. Samsung Fold outer cover screen)
    if (width < 640 && aspectRatio < 0.45) {
      if (onLayoutAlert) {
        onLayoutAlert({
          status: 'CRITICAL_ASPECT',
          message: 'Extreme narrow viewport detected. Compacting padding properties.',
          payload: diagnosticPayload
        });
      }
      document.documentElement.classList.add('viewport-extreme-narrow');
    } else {
      document.documentElement.classList.remove('viewport-extreme-narrow');
      if (onLayoutAlert) {
        onLayoutAlert({ status: 'HEALTHY', payload: diagnosticPayload });
      }
    }
  };

  const envSafeCheck = () => {
    // Tests browser support for environmental CSS variables
    return Boolean(
      window.CSS &&
      window.CSS.supports &&
      window.CSS.supports('top: env(safe-area-inset-top)')
    );
  };

  window.addEventListener('resize', performCheck);
  performCheck(); // Run baseline check upon initialization

  return () => window.removeEventListener('resize', performCheck);
};
