/**
 * Avatar Generator & Cute Preset Catalog for Onevoo
 */

export const CUTE_AVATARS = [
  {
    id: 'cyber-fox',
    name: 'Cyber Fox',
    emoji: '🦊',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberFox&backgroundColor=b6e3f4,c0aede,d1d4f9',
  },
  {
    id: 'astro-cat',
    name: 'Astro Cat',
    emoji: '🐱',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AstroCat&backgroundColor=ffd5dc,ffdfbf',
  },
  {
    id: 'chill-panda',
    name: 'Chill Panda',
    emoji: '🐼',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=ChillPanda&backgroundColor=d1d4f9,c0aede',
  },
  {
    id: 'neon-dino',
    name: 'Neon Dino',
    emoji: '🦖',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=NeonDino&backgroundColor=b6e3f4,c0aede',
  },
  {
    id: 'pixel-ninja',
    name: 'Pixel Creator',
    emoji: '⚡',
    url: 'https://api.dicebear.com/7.x/thumbs/svg?seed=PixelCreator&backgroundColor=ffd5dc,d1d4f9',
  },
  {
    id: 'magic-star',
    name: 'Sparkle Vibe',
    emoji: '✨',
    url: 'https://api.dicebear.com/7.x/thumbs/svg?seed=SparkleVibe&backgroundColor=c0aede,b6e3f4',
  },
  {
    id: 'sound-wave',
    name: 'Studio Master',
    emoji: '🎧',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=StudioMaster&backgroundColor=ffdfbf,ffd5dc',
  },
  {
    id: 'camera-lens',
    name: 'Cinema DP',
    emoji: '🎥',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CinemaDP&backgroundColor=b6e3f4,d1d4f9',
  },
];

/**
 * Get Clean, Cute Avatar for any user
 */
export function getAvatarUrl(user, profile) {
  // 1. If user has chosen a custom avatar or uploaded image that isn't the old default stock photo
  const explicitAvatar = user?.avatar_url || profile?.avatar_url;
  const oldStockPhoto = 'photo-1534528741775-53994a69daeb';

  if (explicitAvatar && !explicitAvatar.includes(oldStockPhoto)) {
    return explicitAvatar;
  }

  // 2. Generate a cute personalized avatar based on user's name/handle/email
  const seed = (user?.full_name || profile?.full_name || user?.email || 'OnevooCreator')
    .replace(/[^a-zA-Z0-9]/g, '');

  return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

/**
 * Generate user initials (e.g. "US" for Utsab Sinha)
 */
export function getUserInitials(name) {
  if (!name) return 'OV';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
