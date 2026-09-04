import React from 'react';

export const CoreAppShell = ({ children }) => {
  return (
    <div className="core-app-shell" style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      {/* Background Layer Grouping (Hardware Accelerated Layers) */}
      <div className="ambient-glow-wrapper" aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div className="engineering-backdrop-grid" />
        <div className="glow-orb orb-violet" />
        <div className="glow-orb orb-cyan" />
      </div>

      {/* Main Content Interface Wrapper */}
      <div className="app-content-wrapper" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
};

export default CoreAppShell;
