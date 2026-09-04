import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const StoryViewerModal = ({ isOpen, onClose, stories = [], initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  const activeStory = stories[currentIndex] || stories[0];

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  // Story Auto-Advance Timer
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          handleNext();
          return 0;
        }
        return old + 2; // 50 steps * 100ms = 5000ms (5s per story)
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, handleNext]);

  // Keyboard navigation support
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || !activeStory) return null;

  const handleJoinNetwork = () => {
    onClose();
    navigate('/auth');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      {/* Left Navigation Arrow */}
      {currentIndex > 0 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          style={{
            position: 'absolute',
            left: '32px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--satin-border)',
            color: '#fff',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
          }}
          title="Previous Story (Left Arrow)"
        >
          ←
        </button>
      )}

      {/* Story Player Phone Container */}
      <div
        className="satin-card story-viewer-phone"
        style={{
          width: '100%',
          maxWidth: '380px',
          maxHeight: 'calc(100dvh - 32px)',
          height: '680px',
          borderRadius: '24px',
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.95), 0 0 50px rgba(112, 37, 225, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Story Background Visual or Video Player */}
        {activeStory?.videoUrl ? (
          <video
            key={activeStory.videoUrl}
            src={activeStory.videoUrl}
            poster={activeStory.bgImage}
            autoPlay
            loop
            playsInline
            muted={isMuted}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />
        ) : (
          <img
            src={activeStory.bgImage}
            alt={activeStory.name}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />
        )}

        {/* Dark Linear Gradient Overlays */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.92) 100%)',
            zIndex: 1,
          }}
        />

        {/* Top Story Multi-Progress Bars */}
        <div style={{ position: 'relative', zIndex: 2, padding: '14px 16px 8px' }}>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
            {stories.map((_, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  height: '3px',
                  borderRadius: '99px',
                  background: 'rgba(255, 255, 255, 0.25)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    background: 'var(--accent-gold)',
                    width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%',
                    transition: idx === currentIndex ? 'width 0.1s linear' : 'none',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Top User Info Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={activeStory.avatar}
                alt={activeStory.name}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '2px solid var(--accent-purple)',
                  objectFit: 'cover',
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                    @{activeStory.username}
                  </span>
                  <span className="pulse-emerald-ring" style={{ width: '6px', height: '6px' }} />
                </div>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)' }}>
                  📍 {activeStory.city}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>

              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Middle Floating Cultural Sticker */}
        <div style={{ position: 'relative', zIndex: 2, padding: '0 20px', textAlign: 'center' }}>
          <div
            className="font-display"
            style={{
              display: 'inline-block',
              padding: '12px 18px',
              borderRadius: '12px',
              background: 'rgba(12, 12, 14, 0.85)',
              border: '1px solid var(--accent-purple)',
              color: '#fff',
              fontSize: '16px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
              backdropFilter: 'blur(10px)',
              letterSpacing: '0.04em',
              transform: 'rotate(-2deg)',
            }}
          >
            {activeStory.stickerText}
          </div>

          <div style={{ marginTop: '12px' }}>
            <span
              className="mono"
              style={{
                fontSize: '10px',
                padding: '4px 10px',
                borderRadius: '99px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--accent-green)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              🔒 {activeStory.payout}
            </span>
          </div>
        </div>

        {/* Bottom Story Footer with Story Caption & Inspire CTA */}
        <div style={{ position: 'relative', zIndex: 2, padding: '20px' }}>
          {/* Brand Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CAMPAIGN PARTNER:</span>
            <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700 }}>
              {activeStory.brand}
            </span>
          </div>

          <p style={{ color: 'var(--paper-soft)', fontSize: '13px', lineHeight: 1.45, margin: '0 0 16px' }}>
            "{activeStory.caption}"
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '11px', color: 'var(--text-muted)' }} className="mono">
            <span>👁️ {activeStory.views} VIEWS</span>
            <span>⏱️ {activeStory.time}</span>
          </div>

          {/* Inspiring Action CTA */}
          <button
            type="button"
            onClick={handleJoinNetwork}
            className="btn-magnetic"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '11px',
              justifyContent: 'center',
              background: 'var(--accent-purple)',
              borderColor: 'var(--accent-purple)',
            }}
          >
            ⚡ JOIN ONEVOO • GET BOOKED LIKE @{activeStory.username.split('.')[0].toUpperCase()}
          </button>
        </div>
      </div>

      {/* Right Navigation Arrow */}
      {currentIndex < stories.length - 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          style={{
            position: 'absolute',
            right: '32px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--satin-border)',
            color: '#fff',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
          }}
          title="Next Story (Right Arrow)"
        >
          →
        </button>
      )}
    </div>
  );
};

export default StoryViewerModal;
