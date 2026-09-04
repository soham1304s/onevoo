export const INITIAL_CALL_SHEET = {
  shootId: 'shoot-mum-8041',
  campaignName: 'Aura Skincare Monsoon Brand Campaign',
  brandName: 'Aura Skincare Lab',
  date: 'October 14, 2026',
  locationAddress: 'Stage 4, Mehboob Studios, Hill Road, Bandra West, Mumbai 400050',
  gpsCoords: '19.0544° N, 72.8258° E',
  callTime: '06:30 AM IST',
  firstShotTime: '08:00 AM IST',
  wrapTime: '07:30 PM IST',
  weatherForecast: '29°C Clear • Humidity 68% • Light Rain Guard Required',
  emergencyHospital: 'Lilavati Hospital & Research Centre (1.2 km away)',
  producerContact: { name: 'Kunal Singhania (Onevoo EP)', phone: '+91 98201 54321' },
  crewRoles: [
    {
      roleId: 'role-01',
      roleName: 'Lead Creator / Talent',
      category: 'CREATOR',
      assignedToName: 'Tanvi Sharma',
      phone: '+91 98192 11002',
      originalRate: 40000,
      status: 'CONFIRMED'
    },
    {
      roleId: 'role-02',
      roleName: 'Director of Photography',
      category: 'VIDEOGRAPHER',
      assignedToName: 'Kabir Sen (Steadicam DP)',
      phone: '+91 98200 44556',
      originalRate: 28000,
      status: 'CONFIRMED'
    },
    {
      roleId: 'role-03',
      roleName: 'Commercial Stills Photographer',
      category: 'PHOTOGRAPHER',
      assignedToName: 'Devika Ray',
      phone: '+91 98334 77889',
      originalRate: 25000,
      status: 'CONFIRMED'
    },
    {
      roleId: 'role-04',
      roleName: 'Lead Gaffer & Lighting Tech',
      category: 'EQUIPMENT',
      assignedToName: 'Sanjay Rawat',
      phone: '+91 98111 22334',
      originalRate: 12000,
      status: 'CONFIRMED'
    }
  ],
  equipmentChecklist: [
    { id: 'eq-1', name: 'Sony FX6 Full-Frame Camera Body (Primary)', loaded: true },
    { id: 'eq-2', name: 'Sony FX3 B-Cam with Top Handle XLR', loaded: true },
    { id: 'eq-3', name: 'G-Master Cine Prime Set (24, 35, 50, 85mm)', loaded: true },
    { id: 'eq-4', name: 'Aputure 600c RGB Pro with Light Dome 150', loaded: true },
    { id: 'eq-5', name: 'Wireless Video Transmitter + Client Director Monitor', loaded: false },
    { id: 'eq-6', name: 'DJI RS 3 Pro Gimbal with LiDAR Range Finder', loaded: true },
    { id: 'eq-7', name: 'Sennheiser MKH 416 Boom Mic + Sound Devices MixPre', loaded: false },
    { id: 'eq-8', name: 'Dual Backup SSD RAID (4TB Sandisk Extreme Pro)', loaded: true }
  ]
};
