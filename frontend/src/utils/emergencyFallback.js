/**
 * Emergency Fallback Matching Node
 * Executed during shoot-day cancellations or vendor emergencies (suggestionv2.md Section 1.C)
 */

export const findAlternativeCrew = (missingCategory, allVendors = [], originalRate = 0) => {
  return allVendors
    .filter((vendor) => vendor.category === missingCategory && vendor.availability)
    .map((v) => ({
      vendorId: v.id,
      name: v.name,
      category: v.category,
      ratePerDay: v.ratePerDay,
      reliabilityScore: v.reliabilityScore,
      city: v.city || 'Metro Area',
      costDelta: v.ratePerDay - originalRate,
      phone: '+91 99' + Math.floor(10000000 + Math.random() * 90000000)
    }))
    .sort((a, b) => b.reliabilityScore - a.reliabilityScore); // prioritize safety & high reliability
};
