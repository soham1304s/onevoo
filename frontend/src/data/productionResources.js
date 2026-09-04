export const PRODUCTION_RESOURCES = [
  // CREATORS
  {
    id: 'res-cr-01',
    category: 'CREATOR',
    name: 'Tanvi Sharma (Lifestyle & Fashion)',
    description: 'Verified Tier-1 Creator • 450K Active Engagement',
    ratePerDay: 40000,
    reliabilityScore: 99,
    availability: true,
    city: 'Mumbai',
    icon: '🌟'
  },
  {
    id: 'res-cr-02',
    category: 'CREATOR',
    name: 'Aman Verma (Tech & Gadgets)',
    description: 'Specializes in 4K studio unboxings & teardowns',
    ratePerDay: 50000,
    reliabilityScore: 97,
    availability: true,
    city: 'Bengaluru',
    icon: '💻'
  },
  {
    id: 'res-cr-03',
    category: 'CREATOR',
    name: 'Pooja Hegde (Culinary & Wellness)',
    description: 'Cinematic tabletop cooking & mindful living',
    ratePerDay: 35000,
    reliabilityScore: 96,
    availability: true,
    city: 'Hyderabad',
    icon: '🥗'
  },

  // VIDEOGRAPHERS
  {
    id: 'res-vg-01',
    category: 'VIDEOGRAPHER',
    name: 'Kabir Sen (Steadicam & Anamorphic)',
    description: 'Commercial DP • Arri/RED certified operator',
    ratePerDay: 28000,
    reliabilityScore: 98,
    availability: true,
    city: 'Mumbai',
    icon: '🎥'
  },
  {
    id: 'res-vg-02',
    category: 'VIDEOGRAPHER',
    name: 'Rohit Kulkarni (High-Speed Action)',
    description: 'Automotive & dynamic gym motion specialist',
    ratePerDay: 22000,
    reliabilityScore: 96,
    availability: true,
    city: 'Delhi NCR',
    icon: '🎬'
  },
  {
    id: 'res-vg-03',
    category: 'VIDEOGRAPHER',
    name: 'Rahul Photography & Cinema',
    description: 'Editorial short-form video & gimbal master',
    ratePerDay: 20000,
    reliabilityScore: 96,
    availability: true,
    city: 'Bengaluru',
    icon: '📹'
  },

  // PHOTOGRAPHERS
  {
    id: 'res-ph-01',
    category: 'PHOTOGRAPHER',
    name: 'Devika Ray (Editorial Lookbooks)',
    description: 'Vogue/Grazia featured portrait photographer',
    ratePerDay: 25000,
    reliabilityScore: 97,
    availability: true,
    city: 'Mumbai',
    icon: '📸'
  },
  {
    id: 'res-ph-02',
    category: 'PHOTOGRAPHER',
    name: 'Arjun Das (Studio Product Packshots)',
    description: 'Macro liquid & cosmetics lighting maestro',
    ratePerDay: 18000,
    reliabilityScore: 95,
    availability: true,
    city: 'Bengaluru',
    icon: '📷'
  },

  // EQUIPMENT PACKAGES
  {
    id: 'res-eq-01',
    category: 'EQUIPMENT',
    name: 'Sony FX6 + G-Master Cine Kit',
    description: 'Full frame 4K120p, wireless follow focus, wireless video TX',
    ratePerDay: 15000,
    reliabilityScore: 99,
    availability: true,
    city: 'All Metros',
    icon: '⚡'
  },
  {
    id: 'res-eq-02',
    category: 'EQUIPMENT',
    name: 'RED V-Raptor 8K Cinema Package',
    description: '8K VV sensor, Cooke anamorphic lenses & Teradek transmitter',
    ratePerDay: 32000,
    reliabilityScore: 98,
    availability: true,
    city: 'All Metros',
    icon: '🔥'
  },
  {
    id: 'res-eq-03',
    category: 'EQUIPMENT',
    name: 'Aputure Studio Lighting Master Kit',
    description: '600c RGB Pro, 2x 300x, motorized lanterns & boom arms',
    ratePerDay: 12000,
    reliabilityScore: 100,
    availability: true,
    city: 'All Metros',
    icon: '💡'
  },

  // LOCATIONS
  {
    id: 'res-loc-01',
    category: 'LOCATION',
    name: 'Bandra Brutalist Penthouse Studio',
    description: 'Double height floor-to-ceiling glass, polished concrete',
    ratePerDay: 35000,
    reliabilityScore: 98,
    availability: true,
    city: 'Mumbai',
    icon: '🏛️'
  },
  {
    id: 'res-loc-02',
    category: 'LOCATION',
    name: 'Whitefield Daylight Cyclorama Studio',
    description: '40ft continuous white infinity cove with prep kitchen',
    ratePerDay: 28000,
    reliabilityScore: 99,
    availability: true,
    city: 'Bengaluru',
    icon: '🏢'
  },
  {
    id: 'res-loc-03',
    category: 'LOCATION',
    name: 'Heritage Palace Courtyard',
    description: 'Regal sandstone arches, reflecting pools & marble veranda',
    ratePerDay: 45000,
    reliabilityScore: 94,
    availability: true,
    city: 'Jaipur',
    icon: '🏰'
  },

  // POST PRODUCTION
  {
    id: 'res-post-01',
    category: 'POST_PRODUCTION',
    name: 'DaVinci Resolve Color Grade & Master',
    description: 'Film-look emulation, ACES color workflow & multi-deliverable LUTs',
    ratePerDay: 14000,
    reliabilityScore: 99,
    availability: true,
    city: 'Remote Cloud',
    icon: '🎨'
  },
  {
    id: 'res-post-02',
    category: 'POST_PRODUCTION',
    name: 'Sound Design & Dolby Atmos Mix',
    description: 'Foley tracking, spatial mix & licensed commercial stem library',
    ratePerDay: 12000,
    reliabilityScore: 98,
    availability: true,
    city: 'Remote Cloud',
    icon: '🔊'
  },
  {
    id: 'res-post-03',
    category: 'POST_PRODUCTION',
    name: 'Kinetic 3D Motion VFX Package',
    description: '3D product modeling, CGI bottle explodes & physics typography',
    ratePerDay: 20000,
    reliabilityScore: 97,
    availability: true,
    city: 'Remote Cloud',
    icon: '✨'
  }
];

export const RESOURCE_CATEGORIES = [
  { id: 'ALL', label: 'All Resources' },
  { id: 'CREATOR', label: 'Creators' },
  { id: 'VIDEOGRAPHER', label: 'Videographers' },
  { id: 'PHOTOGRAPHER', label: 'Photographers' },
  { id: 'EQUIPMENT', label: 'Gear & Cameras' },
  { id: 'LOCATION', label: 'Studios & Venues' },
  { id: 'POST_PRODUCTION', label: 'Color & VFX' }
];
