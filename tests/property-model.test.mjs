import test from "node:test";
import assert from "node:assert/strict";
import { createCustomListing, normalizePhotoUrl, upsertListing } from "../property-model.mjs";

test("createCustomListing builds an editable lead from form values", () => {
  const listing = createCustomListing({
    address: "39-3895 Doug Leavens Boulevard",
    city: "Mississauga",
    type: "Condo townhouse",
    askingPrice: "599000",
    estimatedMarketValue: "734489",
    estimatedRent: "3300",
    taxes: "3659",
    condoFees: "358",
    insurance: "90",
    bedrooms: "3",
    baths: "2",
    photoUrl: " https://photos.gta-homes.com/39-3895-doug-leavens-boulevard-mississauga.jpg ",
    source: "https://www.zolo.ca/mississauga-real-estate/3895-doug-leavens-boulevard/39",
    signals: "power of sale, price reduced, value gap"
  });

  assert.equal(listing.id, "custom-39-3895-doug-leavens-boulevard-mississauga");
  assert.equal(listing.askingPrice, 599000);
  assert.equal(listing.photo.url, "https://photos.gta-homes.com/39-3895-doug-leavens-boulevard-mississauga.jpg");
  assert.deepEqual(listing.signals, ["power of sale", "price reduced", "value gap"]);
});

test("normalizePhotoUrl keeps only http, https, or empty image URLs", () => {
  assert.equal(normalizePhotoUrl("https://example.com/house.jpg"), "https://example.com/house.jpg");
  assert.equal(normalizePhotoUrl("http://example.com/house.jpg"), "http://example.com/house.jpg");
  assert.equal(normalizePhotoUrl("javascript:alert(1)"), "");
});

test("upsertListing replaces an existing custom listing and preserves other leads", () => {
  const base = [
    { id: "a", address: "A" },
    { id: "custom-39-3895-doug-leavens-boulevard-mississauga", address: "Old" }
  ];
  const updated = upsertListing(base, {
    id: "custom-39-3895-doug-leavens-boulevard-mississauga",
    address: "39-3895 Doug Leavens Boulevard"
  });

  assert.equal(updated.length, 2);
  assert.equal(updated[0].address, "A");
  assert.equal(updated[1].address, "39-3895 Doug Leavens Boulevard");
});
