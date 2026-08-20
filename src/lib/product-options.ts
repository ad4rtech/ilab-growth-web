export const PRODUCT_CATEGORIES = [
  "Business Templates",
  "Marketing Kits",
  "Finance Tools",
  "Strategy Guides",
  "HR & Team",
  "E-commerce",
] as const;

export const PRODUCT_TYPES = [
  "Template",
  "Toolkit",
  "eBook",
  "Spreadsheet",
  "Presentation",
] as const;

export const PRICE_RANGES = [
  { id: "under-1000", label: "Under KSh 1,000", min: 0, max: 999 },
  { id: "1000-2500", label: "KSh 1,000 – 2,500", min: 1000, max: 2500 },
  { id: "2500-5000", label: "KSh 2,500 – 5,000", min: 2500, max: 5000 },
  { id: "5000-10000", label: "KSh 5,000 – 10,000", min: 5000, max: 10000 },
  { id: "over-10000", label: "Over KSh 10,000", min: 10000, max: Infinity },
] as const;