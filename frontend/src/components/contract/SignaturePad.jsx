import React, { useRef, useState, useEffect } from 'react';

export default function SignaturePad({ onSaveSignature, initialSignature = null, disabled = false }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(Boolean(initialSignature));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set display resolution vs coordinate resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = initialSignature;
    }
  }, [initialSignature]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#dfb640'; // Onevoo Champagne Gold Ink
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing || disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      if (onSaveSignature) {
        onSaveSignature(dataUrl);
      }
    }
  };

  const clearCanvas = (e) => {
    e?.preventDefault();
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    if (onSaveSignature) {
      onSaveSignature(null);
    }
  };

  return (
    <div className="signature-container" style={{ position: 'relative' }}>
      <div style={{ position: 'relative', width: '100%', height: '180px' }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="signature-pad-box"
          style={{
            width: '100%',
            height: '100%',
            background: '#09090e',
            border: '1px dashed rgba(223, 182, 64, 0.4)',
            borderRadius: '10px',
            cursor: disabled ? 'not-allowed' : 'crosshair',
            touchAction: 'none',
            display: 'block',
          }}
        />

        {!hasDrawn && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              textAlign: 'center',
              opacity: 0.45,
            }}
          >
            <span className="mono" style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#dfb640', display: 'block' }}>
              ✍️ DRAW DIGITAL SIGNATURE HERE
            </span>
            <span className="mono" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
              (Mouse, Trackpad or Touchscreen enabled)
            </span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="pulse-emerald-ring" style={{ width: '6px', height: '6px' }} />
          <span className="mono" style={{ fontSize: '10px', color: hasDrawn ? 'var(--accent-green)' : 'var(--accent-gold)' }}>
            {hasDrawn ? '✓ Cryptographic Vector Capture Ready' : 'Awaiting Creator Signature Stroke'}
          </span>
        </div>

        <button
          type="button"
          onClick={clearCanvas}
          disabled={disabled || !hasDrawn}
          className="mono"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: 'var(--text-muted)',
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '10px',
            cursor: disabled || !hasDrawn ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Clear Pad
        </button>
      </div>
    </div>
  );
}
