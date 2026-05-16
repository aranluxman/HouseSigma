export function normalizePhotoUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : "";
  } catch {
    return "";
  }
}

export function toNumber(value, fallback = 0) {
  const numeric = Number(String(value ?? "").replace(/[,$\s]/g, ""));
  return Number.isFinite(numeric) ? numeric : fallback;
}

export function slugify(value) {
  const slug = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "lead";
}

export function createCustomListing(values) {
  const address = String(values.address || "Custom property").trim();
  const city = String(values.city || "GTA").trim();
  const type = String(values.type || "Investor property").trim();
  const photoUrl = normalizePhotoUrl(values.photoUrl);
  const signals = String(values.signals || "")
    .split(",")
    .map((signal) => signal.trim().toLowerCase())
    .filter(Boolean);

  return {
    id: `custom-${slugify(`${address}-${city}`)}`,
    address,
    city,
    type,
    askingPrice: toNumber(values.askingPrice),
    estimatedMarketValue: toNumber(values.estimatedMarketValue),
    estimatedRent: toNumber(values.estimatedRent),
    taxes: toNumber(values.taxes),
    condoFees: toNumber(values.condoFees),
    insurance: toNumber(values.insurance),
    bedrooms: toNumber(values.bedrooms),
    baths: toNumber(values.baths),
    signals: signals.length ? signals : ["custom lead"],
    source: normalizePhotoUrl(values.source) || "#",
    sourceLabel: values.source ? "User source" : "Custom lead",
    photo: {
      url: photoUrl,
      alt: photoUrl ? `${address}, ${city}` : ""
    },
    upside:
      "User-added lead. Adjust rent, price, fees, and distress signals to test the investment case.",
    risks:
      "Verify listing status, photos, taxes, fees, zoning, sold comparables, legal-suite status, and financing before relying on this estimate.",
    bestAngle: "Editable custom scenario",
    supports: {
      duplex: "Needs zoning and building-code review.",
      basement: "Needs separate entrance, egress, ceiling height, parking, and permit review.",
      student: "Depends on location, licensing, bedroom layout, and transit access.",
      assisted: "Requires operator, fire-code, licensing, and zoning diligence.",
      rooming: "Requires municipal rooming-house licensing and parking review."
    },
    comps:
      "Run a HouseSigma/MLS comparable search within 0.8-1 km over the last 30-120 days and update this lead with verified solds."
  };
}

export function upsertListing(listings, listing) {
  const index = listings.findIndex((item) => item.id === listing.id);
  if (index === -1) return [...listings, listing];
  return listings.map((item, itemIndex) => (itemIndex === index ? listing : item));
}
