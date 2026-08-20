// ASSUMPTION: I haven't seen lib/product-options.ts, so PRICE_RANGES here
// is inferred fresh (bucket boundaries guessed to fit typical course
// pricing). Check these ranges make sense against your actual catalogue,
// and align the shape/id scheme with product-options.ts if it differs.

export const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export const PRICE_RANGES = [
  { id: "under-2000", label: "Under KSh 2,000", min: 0, max: 1999 },
  { id: "2000-5000", label: "KSh 2,000 – 5,000", min: 2000, max: 5000 },
  { id: "5000-10000", label: "KSh 5,000 – 10,000", min: 5001, max: 10000 },
  { id: "over-10000", label: "Over KSh 10,000", min: 10001, max: Infinity },
];