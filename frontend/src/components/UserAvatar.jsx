import React, { useState, useEffect } from 'react';
import { getAvatarUrl, getUserInitials } from '../utils/avatarHelper';

export default function UserAvatar({
  user,
  profile,
  src,
  size = 'medium',
  onClick,
  showEditBadge = false,
  className = '',
  style = {}
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [user?.avatar_url, profile?.avatar_url, src]);

  const sizes = {
    small: { width: '24px', height: '24px', fontSize: '10px' },
    medium: { width: '36px', height: '36px', fontSize: '12px' },
    large: { width: '56px', height: '56px', fontSize: '18px' },
    xlarge: { width: '84px', height: '84px', fontSize: '24px' },
  };

  const dim = sizes[size] || sizes.medium;
  const avatarSrc = src || (!hasError ? getAvatarUrl(user, profile) : null);
  const initials = getUserInitials(user?.full_name || profile?.full_name || user?.email);

  return (
    <div
      onClick={onClick}
      className={`user-avatar-wrap ${className}`}
      style={{
        position: 'relative',
        width: dim.width,
        height: dim.height,
        minWidth: dim.width,
        borderRadius: '50%',
        cursor: onClick ? 'pointer' : 'default',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      title={user?.full_name || profile?.handle || 'User Avatar (Click to change)'}
    >
      {avatarSrc ? (
        <img
          key={avatarSrc}
          src={avatarSrc}
          alt={user?.full_name || 'Creator Avatar'}
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
            background: 'rgba(112, 37, 225, 0.15)',
            border: '1.5px solid var(--accent-purple)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
            transition: 'transform 0.2s ease, border-color 0.2s ease',
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7025e1 0%, #dfb640 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontFamily: 'monospace',
            fontWeight: 800,
            fontSize: dim.fontSize,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
          }}
        >
          {initials}
        </div>
      )}

      {/* Optional Edit Badge */}
      {showEditBadge && (
        <div
          style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'var(--accent-purple)',
            border: '2px solid #09090b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            color: '#fff',
          }}
        >
          ✎
        </div>
      )}
    </div>
  );
}
