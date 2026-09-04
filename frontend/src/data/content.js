export const FEATURES = [
  {
    id: "brand-collabs",
    title: "Brand Collaborations",
    desc: "Outreach, briefs, and delivery timeline management covered so you can focus on making videos.",
    icon: "🤝"
  },
  {
    id: "shoot-opportunities",
    title: "Shoot Opportunities",
    desc: "Paid studio calls, lookbooks, and campaign shoots filtered directly by city and niche.",
    icon: "📸"
  },
  {
    id: "steady-sponsors",
    title: "Long-term Sponsors",
    desc: "Steady recurring sponsor placements instead of stressfully chasing one-off deals.",
    icon: "💰"
  },
  {
    id: "financial-legal",
    title: "Legal & Invoicing Support",
    desc: "Automated billing, transparent commission, and professional legal contract reviews.",
    icon: "⚖️"
  }
];

export const MARQUEE_ITEMS = [
  "ONEVOO MANAGED CREATORS",
  "BRAND COLLABORATIONS",
  "STEADY SPONSORSHIPS",
  "STUDIO CONTENT DAYS",
  "2 - 7 YEAR CONTRACTS",
  "ON-TIME AUTOMATED PAYOUTS",
];

export const BEFORE_AFTER = {
  before: {
    title: "Solo",
    subtitle: "Creator",
    tag: "Traditional Route",
    product: "Chaotic outreach, manual invoicing, late payments, and unstable income.",
    bg: "linear-gradient(135deg, #181410 0%, #0d0a08 100%)",
    accent: "#ff8c00",
    buttonText: "Standard Gigs",
    textColor: "#f3f1ec"
  },
  after: {
    title: "Onevoo",
    subtitle: "Managed",
    tag: "Onevoo Route",
    product: "Dedicated manager, steady sponsor campaigns, recurring content days, and guaranteed payouts.",
    bg: "linear-gradient(135deg, #130f1e 0%, #08050f 100%)",
    accent: "#7c5cff",
    buttonText: "Join Onevoo",
    textColor: "#f3f1ec"
  }
};

import { GIGS } from './gigs.js';

export const OPPORTUNITIES = GIGS.map((g) => ({
  id: g.id,
  title: g.title,
  subtitle: g.description ? (g.description.slice(0, 48) + "...") : "Enterprise Creator Campaign",
  tag: g.format === "Commercial Shoot" ? "Shoot Opportunity" : g.format === "30-Day Campaign" ? "Sponsor Gig" : "Brand Collab",
  city: g.city,
  payout: g.payout,
  theme: g.id % 2 === 0 ? "dark" : "light",
  format: "story",
  bgGradient: g.accent ? `linear-gradient(135deg, ${g.accent}22 0%, #101518 100%)` : "linear-gradient(135deg, #181410 0%, #0d0a08 100%)",
  accent: g.accent || "#ff8c00",
  image: g.image,
  brand: g.brand,
  description: g.description,
  requirements: g.requirements,
  deliverables: g.deliverables,
  timeline: "August - October 2026"
}));

export const CITIES = [
  "All Cities",
  "Mumbai",
  "Delhi NCR",
  "Bengaluru",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Jaipur",
  "Goa",
  "Kochi",
  "Manali",
  "Nashik"
];

export const TERMS = {
  5: {
    label: "5-Year Term",
    points: [
      "Standard management commission",
      "Priority access to brand collaborations",
      "Annual renegotiation checkpoint",
      "Exit clause after year 3 with notice period",
    ],
  },
  7: {
    label: "7-Year Term",
    points: [
      "Reduced management commission (long-term rate)",
      "First-look on sponsor placements + shoot calls",
      "Dedicated account manager",
      "Guaranteed minimum booking volume per year",
    ],
  },
};

export const CREATOR_STORIES = [
  {
    id: 1,
    name: "Tanvi Sharma",
    username: "tanvi.creates",
    city: "Mumbai, Maharashtra",
    culturalTheme: "Bandra Monsoon Street Fashion & Sea Link",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    bgImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80",
    time: "15m ago",
    views: "34.2K",
    brand: "Nykaa Beauty Launch",
    payout: "₹85,000 Escrow Locked",
    stickerText: "Bandra Shoot Day! ☕ Mumbai",
    caption: "Booked my 4K content shoot in Bandra with a certified DP via Onevoo! Payout already escrowed 📸✨",
    bio: "Fashion & Lifestyle Creator • 450K Community",
    badge: "Verified Creator"
  },
  {
    id: 2,
    name: "Arjun Mehra",
    username: "arjun.cinematics",
    city: "Varanasi, Uttar Pradesh",
    culturalTheme: "Assi Ghat Ganga Aarti & Sunrise Heritage",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    bgImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80",
    time: "42m ago",
    views: "58.9K",
    brand: "Incredible India / Sony Alpha",
    payout: "₹1,40,000 Escrow Locked",
    stickerText: "Sunrise at Assi Ghat 🌅 Varanasi",
    caption: "Cinematic 4K 120fps Ganga Aarti shoot locked with Onevoo gear packages! Absolute spiritual magic.",
    bio: "Travel Filmmaker & Sony Artisan • 320K Community",
    badge: "Commercial DP"
  },
  {
    id: 3,
    name: "Ananya Rathore",
    username: "ananya.heritage",
    city: "Jaipur, Rajasthan",
    culturalTheme: "Hawa Mahal & Royal Rajputi Bridal Aesthetics",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    bgImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
    time: "1h ago",
    views: "92.4K",
    brand: "Tanishq Royal Bridal",
    payout: "₹2,10,000 Escrow Locked",
    stickerText: "Hawa Mahal Golden Hour 👑 Jaipur",
    caption: "Wearing authentic hand-embroidered Rajasthani bridal lehenga. Onevoo matched me with top jewellery brands!",
    bio: "Royal Heritage & Traditional Indian Couture • 580K Community",
    badge: "Top Rated"
  },
  {
    id: 4,
    name: "Chef Rohit Malhotra",
    username: "chef.rohit.delhi",
    city: "Old Delhi, NCR",
    culturalTheme: "Chandni Chowk Paranthe & Sizzling Jalebi ASMR",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    bgImage: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&q=80",
    time: "2h ago",
    views: "44.1K",
    brand: "Swiggy Gourmet Retainer",
    payout: "₹75,000 Escrow Locked",
    stickerText: "Midnight Paranthe Wali Gali 🥘 Delhi",
    caption: "Captured the sizzling ghee aroma & street food heritage of Old Delhi. 2.4M views in 24 hours!",
    bio: "Culinary Explorer & Street Food Storyteller • 290K Community",
    badge: "Verified Chef"
  },
  {
    id: 5,
    name: "Ritika Chatterjee",
    username: "ritika.kolkata",
    city: "Kolkata, West Bengal",
    culturalTheme: "Kumartuli Clay Idol Artistry & Durga Puja Vibes",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    bgImage: "https://images.unsplash.com/photo-1558431382-27e303142255?w=600&q=80",
    time: "3h ago",
    views: "61.3K",
    brand: "Canon India Visual Grants",
    payout: "₹95,000 Escrow Locked",
    stickerText: "Kumartuli Clay Magic 🎨 Kolkata",
    caption: "Documenting the master sculptors of Kumartuli shaping goddess Durga. Pure heart and Bengali culture.",
    bio: "Visual Storyteller & Cultural Archivist • 210K Community",
    badge: "Culture Creator"
  },
  {
    id: 6,
    name: "Vikram Nambiar",
    username: "vikram.techhub",
    city: "Bengaluru, Karnataka",
    culturalTheme: "Koramangala Coffee-to-Code & Galaxy S26 Review",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80",
    bgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    time: "4h ago",
    views: "73.8K",
    brand: "Samsung Galaxy Ultra Campaign",
    payout: "₹1,75,000 Escrow Locked",
    stickerText: "Koramangala Tech Crawl ⚡ BLR",
    caption: "From filter coffee in Indiranagar to 4K low-light stress testing. Onevoo handles my brand contracts seamlessly.",
    bio: "Tech Architect & Consumer Hardware Reviewer • 410K Community",
    badge: "Tech Lead"
  },
  {
    id: 7,
    name: "Zoya Merchant",
    username: "zoya.wanderlust",
    city: "Goa & Konkan Coast",
    culturalTheme: "South Goa Portuguese Heritage & Sunset Coastline",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80",
    bgImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80",
    time: "5h ago",
    views: "52.7K",
    brand: "Airbnb Heritage Stays",
    payout: "₹1,20,000 Escrow Locked",
    stickerText: "Palolem Sunset Golden Hour 🌊 Goa",
    caption: "Living slow in a 200-year-old Portuguese villa. Onevoo automated my travel sponsorship invoices effortlessly.",
    bio: "Slow Travel & Architectural Aesthetics • 340K Community",
    badge: "Travel Pro"
  },
  {
    id: 8,
    name: "Harpreet Singh",
    username: "harpreet.beats",
    city: "Chandigarh & Punjab",
    culturalTheme: "Mustard Fields & Folk Dhol Music Video Direction",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
    bgImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
    time: "6h ago",
    views: "88.2K",
    brand: "Spotify India Punjabi Wave",
    payout: "₹1,60,000 Escrow Locked",
    stickerText: "Pind Mustard Fields 🌾 Punjab",
    caption: "Filming high-energy folk rhythm transitions across rural Punjab. Onevoo crew dispatcher locked our sound team in 10 mins!",
    bio: "Music Video Director & Sound Engineer • 390K Community",
    badge: "Music Producer"
  },
  {
    id: 9,
    name: "Kavya Reddy",
    username: "kavya.teluguvibes",
    city: "Hyderabad, Telangana",
    culturalTheme: "Charminar Pearls & Tollywood Cinematic Dance",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    bgImage: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80",
    time: "7h ago",
    views: "67.5K",
    brand: "Prime Video Telugu Promo",
    payout: "₹1,10,000 Escrow Locked",
    stickerText: "Charminar Chai & Irani Vibes ☕ Hyd",
    caption: "Saree choreography at the historical Qutb Shahi tombs! 100% milestone escrow payout released instantly on delivery.",
    bio: "Classical Fusion Dancer & Telugu Creator • 470K Community",
    badge: "Performer"
  }
];
