import React, { useState, useEffect } from 'react';
import { CUTE_AVATARS, getAvatarUrl } from '../utils/avatarHelper';
import { useAuth } from '../context/AuthContext';

export default function AvatarPickerModal({ isOpen, onClose }) {
  const { user, profile, updateProfile } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [customUploadError, setCustomUploadError] = useState('');

  // Sync state whenever modal opens or user profile changes
  useEffect(() => {
    if (isOpen) {
      setSelectedAvatar(getAvatarUrl(user, profile));
      setCustomUploadError('');
    }
  }, [isOpen, user, profile]);

  if (!isOpen) return null;

  // Handle local file upload
  const handleFileUpload = (e) => {
    setCustomUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return setCustomUploadError('Please select a valid image file (PNG, JPG, WebP).');
    }

    if (file.size > 5 * 1024 * 1024) {
      return setCustomUploadError('Image size must be under 5MB.');
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (updateProfile) {
        await updateProfile({
          avatar_url: selectedAvatar,
          avatarUrl: selectedAvatar,
        });
      }
      onClose();
    } catch (err) {
      console.error('Failed to update avatar:', err);
      setCustomUploadError(err.message || 'Failed to save avatar.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'grid',
        placeItems: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="satin-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '28px',
          borderRadius: '20px',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 50px rgba(112, 37, 225, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pulse-emerald-ring" />
              <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-gold)' }}>PROFILE CUSTOMIZATION</span>
            </div>
            <h3 className="disp-title-h2" style={{ margin: 0, fontSize: '20px', color: 'var(--paper-soft)' }}>
              CHOOSE YOUR <em>CREATOR AVATAR</em>
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Selected Avatar Preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--satin-border)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
          <img
            key={selectedAvatar}
            src={selectedAvatar || getAvatarUrl(user, profile)}
            alt="Preview"
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-purple)', background: 'rgba(112,37,225,0.1)' }}
          />
          <div>
            <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-gold)', display: 'block' }}>
              ACTIVE AVATAR PREVIEW
            </span>
            <span style={{ fontSize: '13px', color: 'var(--paper-soft)', fontWeight: 600 }}>
              {user?.full_name || profile?.handle || 'Creator Profile'}
            </span>
            <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
              Visible on Navbar, Gigs, and Call Sheets
            </span>
          </div>
        </div>

        {/* Cute Avatar Presets Grid */}
        <div style={{ marginBottom: '20px' }}>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)', display: 'block', marginBottom: '10px' }}>
            SELECT A CUTE AVATAR PRESET:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {CUTE_AVATARS.map((item) => {
              const isSelected = selectedAvatar === item.url;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedAvatar(item.url)}
                  style={{
                    padding: '8px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(112, 37, 225, 0.25)' : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected ? '2px solid var(--accent-purple)' : '1px solid var(--satin-border)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', margin: '0 auto 4px', display: 'block' }}
                  />
                  <span className="mono" style={{ fontSize: '9px', color: isSelected ? 'var(--paper-soft)' : 'var(--text-muted)' }}>
                    {item.emoji} {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upload Custom Photo Option */}
        <div style={{ borderTop: '1px solid var(--satin-border)', paddingTop: '16px', marginBottom: '24px' }}>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            OR UPLOAD YOUR OWN PHOTO:
          </span>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px dashed var(--satin-border)',
              color: 'var(--paper-soft)',
              fontSize: '11px',
              fontFamily: 'monospace',
              cursor: 'pointer',
            }}
          >
            <span>📁 Choose Photo from Device (PNG, JPG, WebP)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
          {customUploadError && (
            <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-rose)', display: 'block', marginTop: '4px' }}>
              {customUploadError}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            style={{ flex: 1, padding: '10px', fontSize: '11px' }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-magnetic"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              flex: 2,
              padding: '10px',
              fontSize: '11px',
              justifyContent: 'center',
              background: 'var(--accent-purple)',
              borderColor: 'var(--accent-purple)',
            }}
          >
            {isSaving ? 'Saving to Database…' : '✓ SAVE & UPDATE AVATAR'}
          </button>
        </div>
      </div>
    </div>
  );
}
