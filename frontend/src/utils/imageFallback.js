export const CATEGORY_FALLBACK_IMAGES = {
  Beauty: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
  Tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
  Fashion: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
  Automotive: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
  Fitness: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
  Travel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
  Food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
  Gaming: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
  Lifestyle: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
  Finance: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80",
  Default: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
};

export const getCategoryFallbackImage = (tag = "") => {
  const normalized = tag ? tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase() : "";
  return CATEGORY_FALLBACK_IMAGES[normalized] || CATEGORY_FALLBACK_IMAGES.Default;
};

export const handleImageError = (e, tag = "Default") => {
  const fallback = getCategoryFallbackImage(tag);
  if (e.currentTarget.src !== fallback) {
    e.currentTarget.src = fallback;
  } else {
    // If even fallback fails, hide image and show clean gradient
    e.currentTarget.style.display = "none";
  }
};
