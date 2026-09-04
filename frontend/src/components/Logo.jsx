import React from 'react';

export default function Logo({ size = 'medium', variant = 'full', className = '', style = {} }) {
  const heights = {
    small: '28px',
    medium: '38px',
    large: '52px',
    xlarge: '68px',
  };

  const height = heights[size] || heights.medium;
  const logoSrc = variant === 'icon' ? '/onevoo-icon.png' : '/onevoo-logo-transparent.png';

  return (
    <div
      className={`onevoo-brand-logo ${className}`}
      title="Onevoo — Enterprise Content Management Platform"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        position: 'relative',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease',
        ...style,
      }}
    >
      <img
        src={logoSrc}
        alt="Onevoo Enterprise Content Management Platform"
        style={{
          height,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 2px 12px rgba(112, 37, 225, 0.25))',
          transition: 'filter 0.3s ease, transform 0.3s ease',
        }}
        className="brand-logo-img"
        onMouseEnter={(e) => {
          e.currentTarget.style.filter = 'drop-shadow(0 4px 20px rgba(223, 182, 64, 0.45)) drop-shadow(0 0 30px rgba(112, 37, 225, 0.4))';
          e.currentTarget.style.transform = 'scale(1.03)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = 'drop-shadow(0 2px 12px rgba(112, 37, 225, 0.25))';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      />
    </div>
  );
}
