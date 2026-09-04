/**
 * Pure costing calculator utility for the Custom Production Builder
 * Implements suggestionv2.md Section 1.B costing logic & tax structures
 */

export const CATEGORY_MARKUPS = {
  CREATOR: 1.0,         // Direct talent pass-through
  VIDEOGRAPHER: 1.15,    // 15% agency management margin
  PHOTOGRAPHER: 1.15,    // 15% agency margin
  EQUIPMENT: 1.20,       // 20% logistics & insurance markup
  LOCATION: 1.10,        // 10% venue permit coordination
  POST_PRODUCTION: 1.15  // 15% post pipeline QA margin
};

export const GST_RATE = 0.18; // 18% GST statutory baseline

export const calculateCosting = (resources = [], days = 1) => {
  const safeDays = Math.max(1, Number(days) || 1);
  const rawCost = resources.reduce((sum, r) => sum + (r.ratePerDay * safeDays), 0);

  const clientPrice = resources.reduce((sum, r) => {
    const markup = CATEGORY_MARKUPS[r.category] || 1.15;
    return sum + (r.ratePerDay * markup * safeDays);
  }, 0);

  const vendorPayouts = rawCost;
  const onevooMargin = clientPrice - vendorPayouts;
  const estimatedTax = clientPrice * GST_RATE;
  const totalClientInvoice = clientPrice + estimatedTax;
  const marginPercentage = clientPrice > 0 ? ((onevooMargin / clientPrice) * 100).toFixed(1) : '0.0';

  return {
    rawCost,
    clientPrice,
    vendorPayouts,
    onevooMargin,
    estimatedTax,
    totalClientInvoice,
    marginPercentage,
    days: safeDays,
    resourceCount: resources.length
  };
};

export const formatINR = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val || 0);
};

export const generateQuotationCode = (resources, days) => {
  const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ONV-Q-${days}D-${resources.length}R-${hash}`;
};
