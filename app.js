import { createCustomListing, upsertListing } from "./property-model.mjs";

const claudePrompt = `Search across major Greater Toronto Area real estate sources for public, newly listed, reduced, or relisted distressed property opportunities.

Important guardrails:
- Use public web pages, search results, official reports, and user-provided saved-search exports only.
- Do not bypass logins, paywalls, VOW/MLS permissions, robots controls, or site terms.
- Cite every source URL.
- If HouseSigma, REALTOR.ca, or MLS sold comparables require a signed-in account, say "verify in HouseSigma/MLS" instead of inventing sold prices.
- Treat "seller motivation" as property/listing-level indicators only. Do not infer private personal financial status.

Target markets:
Toronto, Markham, Richmond Hill, Vaughan, Scarborough, Pickering, Ajax, Whitby, Oshawa, Mississauga, Brampton, Hamilton, Burlington, Oakville.

Property types:
Detached homes, duplexes, triplexes, legal basement-suite opportunities, townhomes, multiplexes, small apartment buildings, and condos only when strong cash-flow potential exists.

Find properties with:
- Asking price under estimated market value or recent price reductions.
- Distress or negotiation indicators: power of sale, as-is, schedule B, estate sale, vacant, long days on market, multiple price reductions, terminated and relisted, assignment sale, bank sale, foreclosure, immediate possession, or visible renovation/fire/estate risk.
- Potential for positive cash flow or near break-even after debt service.

For each property provide:
- Full address and source URL.
- Asking price.
- Estimated market value and method used.
- Estimated monthly market rent and method used.
- Estimated annual property taxes.
- Estimated condo or POTL fees if applicable.
- Estimated insurance.
- Maintenance and vacancy reserve at 10% of gross rent.
- Mortgage analysis assuming 20% down, 3.5% interest, 30-year amortization.
- HELOC carrying cost assuming down payment financed by HELOC at 4% interest-only.
- Estimated monthly cash flow after all expenses.
- Estimated cap rate.
- Estimated cash-on-cash return.
- Key risks and upside opportunities.
- Whether the property could support duplex conversion, legal basement suite, student rental, assisted living, or rooming house potential, and what zoning/licensing checks are still required.
- Recent comparable sold properties nearby from the last 30 to 120 days. Include sold price, sold date, days on market, and trend if publicly available. If not publicly available, list the exact HouseSigma/MLS comp search needed.

Prioritize:
- Properties with public distress signals or clear negotiation leverage.
- Immediate rental potential.
- Strong rental demand.
- Long-term appreciation potential.
- Best value relative to nearby sold comparables.

At the end provide:
- Top 5 best opportunities ranked by strongest cash flow, best long-term appreciation, highest distress/motivation signal, and best value relative to nearby sold comparables.
- Current GTA distressed market trends.
- Whether distressed inventory appears to be increasing or decreasing.
- Best GTA submarkets for distressed opportunities right now.

Output format:
Use a table for the top opportunities, then a short due-diligence checklist for each top property. Mark estimates clearly.`;

let listings = [
  {
    id: "brampton-david",
    address: "2 David Street",
    city: "Brampton",
    type: "Detached mixed-use house",
    askingPrice: 699000,
    estimatedMarketValue: 780000,
    estimatedRent: 5700,
    taxes: 5091,
    condoFees: 0,
    insurance: 250,
    bedrooms: 9,
    baths: 3,
    signals: ["power of sale", "as-is", "fire damage", "mixed-use zoning", "price reduced"],
    source: "https://www.zolo.ca/brampton-real-estate/2-david-street",
    sourceLabel: "Zolo public listing",
    photo: {
      url: "https://media.remarketer.ca/VOW/W13122104-1.jpg?tr=di-propertynoimage_pj5ksb5iM.jpg,w-1200,h-805,c-force,pr-true",
      alt: "2 David Street, Brampton"
    },
    upside:
      "Highest modeled cash flow if legally rented by room, converted to multiple units, or repositioned after fire remediation.",
    risks:
      "Fire damage, municipal occupancy rules, insurance underwriting, zoning confirmation, lender appetite, and construction budget risk.",
    bestAngle: "Cash-flow special situation",
    supports: {
      duplex: "Possible only after zoning, building-code, and fire-restoration review.",
      basement: "Unknown. Needs site inspection and permit history.",
      student: "Possible room-rental angle if licensed and code-compliant.",
      assisted: "High regulatory burden. Treat as long-shot without specialist review.",
      rooming: "Potentially interesting because of bedroom count, but must pass Brampton licensing and zoning."
    },
    comps:
      "Public Zolo page shows nearby comparables but sold prices are gated. Run a HouseSigma/MLS search within 0.8 km for detached or mixed-use sales from Jan-May 2026."
  },
  {
    id: "mississauga-doug",
    address: "39-3895 Doug Leavens Boulevard",
    city: "Mississauga",
    type: "Condo townhouse",
    askingPrice: 599000,
    estimatedMarketValue: 734489,
    estimatedRent: 3300,
    taxes: 3659,
    condoFees: 358,
    insurance: 90,
    bedrooms: 3,
    baths: 2,
    signals: ["power of sale", "price reduced", "value gap"],
    source: "https://www.zolo.ca/mississauga-real-estate/3895-doug-leavens-boulevard/39",
    sourceLabel: "Zolo public listing",
    photo: {
      url: "https://photos.gta-homes.com/39-3895-doug-leavens-boulevard-mississauga.jpg",
      alt: "39-3895 Doug Leavens Boulevard, Mississauga"
    },
    upside:
      "Public estimate suggests a meaningful ask-to-estimated-value gap for a family townhouse near established Mississauga rental demand.",
    risks:
      "Condo fees drag cash flow, sold comp details require login verification, and townhouse renovation restrictions may limit repositioning.",
    bestAngle: "Discount to public estimate",
    supports: {
      duplex: "No. Condo townhouse structure and rules likely block conversion.",
      basement: "Unlikely. Verify legal layout and condo rules.",
      student: "Possible but not the strongest fit.",
      assisted: "Unlikely without condo approval and licensing.",
      rooming: "High rule and licensing risk."
    },
    comps:
      "Zolo references nearby unit 23 sold on Feb 26, 2026, but sold price is gated. Verify sale price and DOM in HouseSigma/MLS."
  },
  {
    id: "markham-cornell",
    address: "119 Cornell Rouge Boulevard",
    city: "Markham",
    type: "Freehold townhouse",
    askingPrice: 949000,
    estimatedMarketValue: 1020000,
    estimatedRent: 3900,
    taxes: 4573,
    condoFees: 0,
    insurance: 180,
    bedrooms: 4,
    baths: 4,
    signals: ["power of sale", "price reduced", "family rental"],
    source: "https://www.movesmartly.com/property/n13132848/119-cornell-rouge-blvd-markham-on",
    sourceLabel: "MoveSmartly public listing",
    photo: {
      url: "https://cdn.repliers.io/IMG-N11985466_1.jpg?class=medium",
      alt: "119 Cornell Rouge Boulevard, Markham"
    },
    upside:
      "Markham/Cornell appreciation profile, four bathrooms, and family-rental demand create a value-first buy if purchased below nearby sales.",
    risks:
      "Modeled cash flow is negative with HELOC-funded down payment. Needs a strong negotiated discount or owner-occupier strategy.",
    bestAngle: "Appreciation plus negotiation",
    supports: {
      duplex: "Unlikely without major zoning and layout review.",
      basement: "Possible only if separate entrance, ceiling height, egress, and parking work.",
      student: "Moderate. Not the primary demand driver.",
      assisted: "Possible only with operator and licensing diligence.",
      rooming: "High municipal/licensing risk."
    },
    comps:
      "Run HouseSigma sold search for Cornell townhouses within 1 km from Jan-May 2026. Public listing pages do not expose verified sold prices."
  },
  {
    id: "ajax-barnham",
    address: "138 Barnham Street",
    city: "Ajax",
    type: "Semi-detached",
    askingPrice: 749000,
    estimatedMarketValue: 790000,
    estimatedRent: 3300,
    taxes: 5200,
    condoFees: 0,
    insurance: 170,
    bedrooms: 3,
    baths: 3,
    signals: ["power of sale", "family rental", "Durham demand"],
    source: "https://powerofsaleplus.ca/durham.html",
    sourceLabel: "Power of Sale Plus",
    photo: {
      url: "https://iss-cdn.myrealpage.com/DpvVmJKp3FYU5wHTl4LMsvqepM7avlQ5533_kJLA1bo/rs:auto:640:0:0/g:sm/aHR0cDovL3MzLmFtYXpvbmF3cy5jb20vbXJwLWxpc3RpbmdzLzQvMS8zLzEwODc0NDMxNC9lODIzMjUyN2U5MzYwNjEyMTE4MzI1N2M4YWZhNGYxOS5qcGVn",
      alt: "138 Barnham Street, Ajax"
    },
    upside:
      "Durham family rentals can move quickly, and a clean semi-detached property may be easier to finance than heavier distressed assets.",
    risks:
      "Limited value gap at list price, cash flow is negative under HELOC carry, and comps must validate whether the discount is real.",
    bestAngle: "Durham family rental",
    supports: {
      duplex: "Possible only if lot, parking, fire separation, and Ajax zoning allow.",
      basement: "Potential if side entrance and code conditions exist.",
      student: "Moderate. Durham College/Ontario Tech demand is stronger farther east.",
      assisted: "Needs operator and zoning review.",
      rooming: "Not primary angle."
    },
    comps:
      "Pull Ajax semi-detached sold comps from HouseSigma/MLS within 0.8 km over the last 120 days."
  },
  {
    id: "oshawa-deputy",
    address: "2698 Deputy Minister Path",
    city: "Oshawa",
    type: "Townhouse",
    askingPrice: 619000,
    estimatedMarketValue: 650000,
    estimatedRent: 3200,
    taxes: 4100,
    condoFees: 220,
    insurance: 120,
    bedrooms: 4,
    baths: 3,
    signals: ["power of sale", "student rental", "near break-even"],
    source: "https://sothebysrealty.ca/en/property/ontario/region-greater-toronto-area/oshawa-real-estate/3307149/2698-deputy-minister-path/",
    sourceLabel: "Sotheby's public listing",
    photo: {
      url: "https://cdn.repliers.io/IMG-E13081184_1.jpg?class=medium",
      alt: "2698 Deputy Minister Path, Oshawa"
    },
    upside:
      "Four-bedroom layout near the Oshawa student-rental corridor can outperform standard family rent if legal, furnished, and professionally managed.",
    risks:
      "POTL or condo-style fees, licensing, tenant turnover, and room-rental management complexity.",
    bestAngle: "Student rental test",
    supports: {
      duplex: "Unlikely for a townhouse without major approvals.",
      basement: "Unknown. Needs floor-plan review.",
      student: "Strongest potential angle if licensed.",
      assisted: "Unlikely.",
      rooming: "Possible only with Oshawa rooming-house rules and parking compliance."
    },
    comps:
      "Verify recent North Oshawa townhouse sales near Simcoe/Winchester and Ontario Tech in HouseSigma/MLS."
  },
  {
    id: "whitby-divine",
    address: "51 Divine Drive",
    city: "Whitby",
    type: "Detached with side entrance",
    askingPrice: 998000,
    estimatedMarketValue: 1050000,
    estimatedRent: 4700,
    taxes: 6800,
    condoFees: 0,
    insurance: 220,
    bedrooms: 5,
    baths: 4,
    signals: ["power of sale", "side entrance", "basement kitchen"],
    source: "https://powerofsaleplus.ca/durham.html",
    sourceLabel: "Power of Sale Plus",
    photo: {
      url: "https://iss-cdn.myrealpage.com/oRJHtKqx64bmPEQTyJVH9RfQsbAOwAorpSg0y8u0DUw/rs:auto:640:0:0/g:sm/aHR0cDovL3MzLmFtYXpvbmF3cy5jb20vbXJwLWxpc3RpbmdzLzQvNy84LzEwODY5OTg3NC9jMzI1YjI0MDI5OTYyYmZiMDliYjE0ZDE3ZjVhNzE2OS5qcGVn",
      alt: "51 Divine Drive, Whitby"
    },
    upside:
      "Side entrance and basement kitchen create legal-suite diligence upside in a family-oriented Durham market.",
    risks:
      "At list price the model is still negative with HELOC carry. Legal-suite status, fire separation, and vacant possession need verification.",
    bestAngle: "Legal basement suite diligence",
    supports: {
      duplex: "Possible if Whitby zoning and building code support conversion.",
      basement: "Strong due-diligence candidate because listing signals side entrance and basement kitchen.",
      student: "Moderate.",
      assisted: "Possible only with operator and licensing.",
      rooming: "Not primary angle."
    },
    comps:
      "Run HouseSigma/MLS detached sales within 1 km from Jan-May 2026, separated by legal second-suite status where possible."
  },
  {
    id: "vaughan-cabinet",
    address: "115 Cabinet Crescent",
    city: "Vaughan",
    type: "Detached",
    askingPrice: 1200000,
    estimatedMarketValue: 1260000,
    estimatedRent: 4500,
    taxes: 6200,
    condoFees: 0,
    insurance: 220,
    bedrooms: 5,
    baths: 2,
    signals: ["power of sale", "as-is", "vacant"],
    source: "https://powerofsaleplus.ca/vaughan.html",
    sourceLabel: "Power of Sale Plus",
    photo: {
      url: "https://iss-cdn.myrealpage.com/QpB8JVbzvJA5Y4Bxxpb6l7hoynWEpZVy8VeSec27DzE/rs:auto:640:0:0/g:sm/aHR0cDovL3MzLmFtYXpvbmF3cy5jb20vbXJwLWxpc3RpbmdzLzYvMC85LzEwODc1NjkwNi84MjIzNmQxN2I2NDdlOTY3MGQ5NWIwZmY1Mzg5YTA4NS5qcGVn",
      alt: "115 Cabinet Crescent, Vaughan"
    },
    upside:
      "Vaughan detached appreciation and vacant/as-is language can create negotiation leverage for buyers with renovation budgets.",
    risks:
      "Weak cash flow, high carrying costs, unknown repairs, and larger down-payment exposure.",
    bestAngle: "Renovation spread",
    supports: {
      duplex: "Possible only after Vaughan zoning, parking, and building-code review.",
      basement: "Potential if separate entrance and ceiling height exist.",
      student: "Low.",
      assisted: "Possible only with operator and licensing.",
      rooming: "High regulatory risk."
    },
    comps:
      "Verify Vaughan detached solds in HouseSigma/MLS within 1 km and 120 days, adjusting for renovation condition."
  },
  {
    id: "oakville-grovewood",
    address: "417-128 Grovewood Common",
    city: "Oakville",
    type: "Condo apartment",
    askingPrice: 439900,
    estimatedMarketValue: 455000,
    estimatedRent: 2300,
    taxes: 2450,
    condoFees: 460,
    insurance: 85,
    bedrooms: 1,
    baths: 1,
    signals: ["power of sale", "low entry price"],
    source: "https://www.royallepage.ca/en/property/ontario/oakville/417-128-grovewood-common/27919892/mlsw13049220/",
    sourceLabel: "Royal LePage public listing",
    photo: {
      url: "https://rlp.jumplisting.com/photos/27/91/98/92/27919892_0_lg.jpg",
      alt: "417-128 Grovewood Common, Oakville"
    },
    upside:
      "Low entry point in Oakville, but this should only survive the condo filter if fees, taxes, and rent verify better than estimated.",
    risks:
      "Condo fees and one-bedroom rent ceiling likely keep cash flow negative.",
    bestAngle: "Low-ticket appreciation",
    supports: {
      duplex: "No.",
      basement: "No.",
      student: "Possible but not a clean fit.",
      assisted: "No.",
      rooming: "No."
    },
    comps:
      "Verify Grovewood one-bedroom solds in HouseSigma/MLS from Jan-May 2026 and compare fee-adjusted rent yields."
  }
];

const marketSources = [
  "https://powerofsaleplus.ca/",
  "https://powerofsaleplus.ca/durham.html",
  "https://powerofsaleplus.ca/vaughan.html",
  "https://housesigma.com/blog-en/market?municipality=1001",
  "https://trreb.ca/market-data/market-watch/",
  "https://www.cmhc-schl.gc.ca/professionals/housing-markets-data-and-research/market-reports/rental-market-reports-major-centres"
];

let state = {
  selectedId: listings[0].id,
  mortgageRate: 3.5,
  helocRate: 4,
  rentStress: 100,
  city: "all",
  signal: "all",
  cash: "all"
};

const money = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0
});

const percent = new Intl.NumberFormat("en-CA", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1
});

const customTemplateIds = [
  "mississauga-doug",
  "brampton-david",
  "markham-cornell",
  "oshawa-deputy",
  "whitby-divine",
  "vaughan-cabinet"
];

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[character];
  });
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function getListing(id) {
  return listings.find((item) => item.id === id) || listings[0];
}

function photoMarkup(listing, extraClass = "") {
  const url = listing.photo?.url || "";
  const alt = listing.photo?.alt || `${listing.address}, ${listing.city}`;
  const classes = ["property-photo", extraClass].filter(Boolean).join(" ");

  if (!url) {
    return `<figure class="${classes} photo-placeholder"><span>Photo source needed</span></figure>`;
  }

  return `
    <figure class="${classes}">
      <img data-photo src="${escapeAttr(url)}" alt="${escapeAttr(alt)}" loading="lazy" referrerpolicy="no-referrer" />
      <figcaption>${escapeHtml(listing.sourceLabel || "Public listing photo")}</figcaption>
    </figure>
  `;
}

function bindImageFallback(root = document) {
  root.querySelectorAll("img[data-photo]").forEach((image) => {
    image.addEventListener(
      "error",
      () => {
        const wrapper = image.closest(".property-photo");
        if (!wrapper) return;
        wrapper.classList.add("photo-placeholder");
        wrapper.innerHTML = "<span>Photo source unavailable</span>";
      },
      { once: true }
    );
  });
}

function mortgagePayment(principal, annualRate, years = 30) {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

function analyze(listing) {
  const grossRent = listing.estimatedRent * (state.rentStress / 100);
  const downPayment = listing.askingPrice * 0.2;
  const loan = listing.askingPrice * 0.8;
  const mortgage = mortgagePayment(loan, state.mortgageRate, 30);
  const helocCarry = (downPayment * (state.helocRate / 100)) / 12;
  const reserve = grossRent * 0.1;
  const monthlyTaxes = listing.taxes / 12;
  const monthlyExpenses =
    mortgage + helocCarry + reserve + monthlyTaxes + listing.condoFees + listing.insurance;
  const cashFlow = grossRent - monthlyExpenses;
  const noi =
    grossRent * 12 -
    listing.taxes -
    listing.condoFees * 12 -
    listing.insurance * 12 -
    reserve * 12;
  const capRate = listing.askingPrice > 0 ? (noi / listing.askingPrice) * 100 : 0;
  const cashOnCash = downPayment > 0 ? ((cashFlow * 12) / downPayment) * 100 : 0;
  const valueGap = listing.estimatedMarketValue - listing.askingPrice;

  return {
    grossRent,
    downPayment,
    mortgage,
    helocCarry,
    reserve,
    monthlyExpenses,
    cashFlow,
    noi,
    capRate,
    cashOnCash,
    valueGap
  };
}

function dealScore(listing) {
  const model = analyze(listing);
  const distress = listing.signals.filter((signal) =>
    ["power of sale", "as-is", "vacant", "price reduced", "fire damage"].includes(signal)
  ).length;
  return model.cashFlow / 250 + model.valueGap / 25000 + distress * 2 + model.capRate;
}

function filteredListings() {
  return listings.filter((listing) => {
    const model = analyze(listing);
    const cityOk = state.city === "all" || listing.city === state.city;
    const signalOk =
      state.signal === "all" || listing.signals.some((signal) => signal.includes(state.signal));
    const cashOk =
      state.cash === "all" ||
      (state.cash === "positive" && model.cashFlow >= 0) ||
      (state.cash === "near" && model.cashFlow >= -500);
    return cityOk && signalOk && cashOk;
  });
}

function populateFilters() {
  const cityFilter = document.querySelector("#cityFilter");
  const previousValue = state.city;
  const cities = [...new Set(listings.map((listing) => listing.city))].sort();
  cityFilter.innerHTML = '<option value="all">All GTA targets</option>';
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    cityFilter.append(option);
  });

  state.city = previousValue === "all" || cities.includes(previousValue) ? previousValue : "all";
  cityFilter.value = state.city;
}

function populateTemplateSelect() {
  const templateSelect = document.querySelector("#templateSelect");
  templateSelect.innerHTML = "";

  customTemplateIds.forEach((id) => {
    const listing = getListing(id);
    const option = document.createElement("option");
    option.value = listing.id;
    option.textContent = `${listing.address}, ${listing.city}`;
    templateSelect.append(option);
  });
}

function fillCustomForm(listing) {
  document.querySelector("#customAddress").value = listing.address;
  document.querySelector("#customCity").value = listing.city;
  document.querySelector("#customType").value = listing.type;
  document.querySelector("#customAskingPrice").value = listing.askingPrice || "";
  document.querySelector("#customMarketValue").value = listing.estimatedMarketValue || "";
  document.querySelector("#customRent").value = listing.estimatedRent || "";
  document.querySelector("#customTaxes").value = listing.taxes || "";
  document.querySelector("#customFees").value = listing.condoFees || "";
  document.querySelector("#customInsurance").value = listing.insurance || "";
  document.querySelector("#customBedrooms").value = listing.bedrooms || "";
  document.querySelector("#customBaths").value = listing.baths || "";
  document.querySelector("#customPhoto").value = listing.photo?.url || "";
  document.querySelector("#customSource").value = listing.source === "#" ? "" : listing.source;
  document.querySelector("#customSignals").value = listing.signals.join(", ");
}

function renderDeals() {
  const grid = document.querySelector("#dealGrid");
  const items = filteredListings().sort((a, b) => dealScore(b) - dealScore(a));
  grid.innerHTML = "";

  if (!items.length) {
    grid.innerHTML = `<article class="deal-card"><h3>No matching leads</h3><p class="city">Adjust filters to see more opportunities.</p></article>`;
    return;
  }

  items.forEach((listing) => {
    const model = analyze(listing);
    const sourceLink =
      listing.source && listing.source !== "#"
        ? `<a class="source-link" href="${escapeAttr(listing.source)}" target="_blank" rel="noreferrer">${escapeHtml(listing.sourceLabel)}</a>`
        : `<span class="source-link">${escapeHtml(listing.sourceLabel)}</span>`;
    const card = document.createElement("article");
    card.className = `deal-card${listing.id === state.selectedId ? " is-selected" : ""}`;
    card.innerHTML = `
      ${photoMarkup(listing, "card-photo")}
      <div class="deal-topline">
        <div>
          <h3>${escapeHtml(listing.address)}</h3>
          <span class="city">${escapeHtml(listing.city)} | ${escapeHtml(listing.type)} | ${escapeHtml(listing.bedrooms)} bed, ${escapeHtml(listing.baths)} bath</span>
        </div>
        <span class="price">${money.format(listing.askingPrice)}</span>
      </div>
      <div class="tag-row">${listing.signals
        .slice(0, 4)
        .map((signal) => `<span class="tag">${escapeHtml(signal)}</span>`)
        .join("")}</div>
      <div class="deal-metrics">
        <div><span>Cash flow</span><strong class="${model.cashFlow >= 0 ? "positive" : "negative"}">${money.format(model.cashFlow)}</strong></div>
        <div><span>Cap rate</span><strong>${percent.format(model.capRate)}%</strong></div>
        <div><span>Rent</span><strong>${money.format(model.grossRent)}</strong></div>
        <div><span>Value gap</span><strong>${money.format(model.valueGap)}</strong></div>
      </div>
      <button class="secondary-button" type="button" data-select="${listing.id}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
        Analyze deal
      </button>
      ${sourceLink}
    `;
    grid.append(card);
  });

  bindImageFallback(grid);

  grid.querySelectorAll("[data-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedId = button.dataset.select;
      render();
      document.querySelector("#underwriting").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderSelected() {
  const listing = getListing(state.selectedId);
  const model = analyze(listing);
  document.querySelector("#selectedTitle").textContent = `${listing.address}, ${listing.city}`;
  document.querySelector("#selectedBadge").textContent =
    model.cashFlow >= 0 ? "Positive modeled cash flow" : "Needs discount or rent upside";
  const selectedPhoto = document.querySelector("#selectedPhoto");
  selectedPhoto.innerHTML = photoMarkup(listing, "selected-photo");
  bindImageFallback(selectedPhoto);

  const rows = [
    ["Asking price", money.format(listing.askingPrice)],
    ["Estimated market value", money.format(listing.estimatedMarketValue)],
    ["Estimated monthly rent", money.format(model.grossRent)],
    ["Property taxes", `${money.format(listing.taxes)} / year`],
    ["Condo/POTL fees", listing.condoFees ? `${money.format(listing.condoFees)} / month` : "None modeled"],
    ["Insurance", `${money.format(listing.insurance)} / month`],
    ["10% reserve", `${money.format(model.reserve)} / month`],
    ["Mortgage payment", `${money.format(model.mortgage)} / month`],
    ["HELOC carry", `${money.format(model.helocCarry)} / month`],
    ["Monthly cash flow", money.format(model.cashFlow)],
    ["Cap rate", `${percent.format(model.capRate)}%`],
    ["Cash-on-cash", `${percent.format(model.cashOnCash)}%`]
  ];

  document.querySelector("#analysisList").innerHTML = rows
    .map(
      ([label, value]) =>
        `<div><dt>${label}</dt><dd class="${label === "Monthly cash flow" && model.cashFlow < 0 ? "negative" : label === "Monthly cash flow" ? "positive" : ""}">${value}</dd></div>`
    )
    .join("");

  document.querySelector("#supportGrid").innerHTML = `
    <article>
      <h4>Risks</h4>
      <p>${escapeHtml(listing.risks)}</p>
    </article>
    <article>
      <h4>Upside</h4>
      <p>${escapeHtml(listing.upside)}</p>
    </article>
    <article>
      <h4>Conversion and rental angles</h4>
      <p><strong>Duplex:</strong> ${escapeHtml(listing.supports.duplex)}<br>
      <strong>Legal basement:</strong> ${escapeHtml(listing.supports.basement)}<br>
      <strong>Student rental:</strong> ${escapeHtml(listing.supports.student)}<br>
      <strong>Assisted living:</strong> ${escapeHtml(listing.supports.assisted)}<br>
      <strong>Rooming house:</strong> ${escapeHtml(listing.supports.rooming)}</p>
    </article>
    <article>
      <h4>Comparable solds</h4>
      <p>${escapeHtml(listing.comps)}</p>
    </article>
  `;
}

function renderRankings() {
  const rows = [...listings].sort((a, b) => dealScore(b) - dealScore(a)).slice(0, 5);
  document.querySelector("#rankRows").innerHTML = rows
    .map((listing, index) => {
      const model = analyze(listing);
      return `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${escapeHtml(listing.address)}</strong><br><span class="city">${escapeHtml(listing.city)}</span></td>
          <td>${escapeHtml(listing.signals.slice(0, 3).join(", "))}</td>
          <td class="${model.cashFlow >= 0 ? "positive" : "negative"}">${money.format(model.cashFlow)}</td>
          <td>${percent.format(model.capRate)}%</td>
          <td>${escapeHtml(listing.bestAngle)}</td>
        </tr>
      `;
    })
    .join("");
}

function updateMetrics() {
  const items = filteredListings();
  const positives = items.filter((listing) => analyze(listing).cashFlow >= 0).length;
  const distress = items.filter((listing) => listing.signals.includes("power of sale")).length;
  document.querySelector("#metric-count").textContent = items.length;
  document.querySelector("#metric-positive").textContent = positives;
  document.querySelector("#metric-distress").textContent = distress;
}

function renderControls() {
  document.querySelector("#mortgageRateLabel").textContent = `${state.mortgageRate.toFixed(1)}%`;
  document.querySelector("#helocRateLabel").textContent = `${state.helocRate.toFixed(1)}%`;
  document.querySelector("#rentStressLabel").textContent = `${state.rentStress}%`;
}

function render() {
  renderControls();
  renderDeals();
  renderSelected();
  renderRankings();
  updateMetrics();
}

function bindControls() {
  document.querySelector("#mortgageRate").addEventListener("input", (event) => {
    state.mortgageRate = Number(event.target.value);
    render();
  });

  document.querySelector("#helocRate").addEventListener("input", (event) => {
    state.helocRate = Number(event.target.value);
    render();
  });

  document.querySelector("#rentStress").addEventListener("input", (event) => {
    state.rentStress = Number(event.target.value);
    render();
  });

  document.querySelector("#cityFilter").addEventListener("change", (event) => {
    state.city = event.target.value;
    render();
  });

  document.querySelector("#signalFilter").addEventListener("change", (event) => {
    state.signal = event.target.value;
    render();
  });

  document.querySelector("#cashFilter").addEventListener("change", (event) => {
    state.cash = event.target.value;
    render();
  });

  document.querySelector("#resetFilters").addEventListener("click", () => {
    state.city = "all";
    state.signal = "all";
    state.cash = "all";
    document.querySelector("#cityFilter").value = "all";
    document.querySelector("#signalFilter").value = "all";
    document.querySelector("#cashFilter").value = "all";
    render();
  });

  document.querySelector("#copyPrompt").addEventListener("click", async () => {
    await navigator.clipboard.writeText(claudePrompt);
    document.querySelector("#copyStatus").textContent = "Prompt copied.";
  });
}

function bindCustomForm() {
  const form = document.querySelector("#customLeadForm");
  const templateSelect = document.querySelector("#templateSelect");
  const status = document.querySelector("#customStatus");

  templateSelect.addEventListener("change", () => {
    fillCustomForm(getListing(templateSelect.value));
    status.textContent = "";
  });

  document.querySelector("#loadSelectedLead").addEventListener("click", () => {
    const selected = getListing(state.selectedId);
    fillCustomForm(selected);
    templateSelect.value = customTemplateIds.includes(selected.id) ? selected.id : "mississauga-doug";
    status.textContent = `Loaded ${selected.address}.`;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const customListing = createCustomListing(Object.fromEntries(new FormData(form)));
    listings = upsertListing(listings, customListing);
    state.selectedId = customListing.id;
    state.city = "all";
    populateFilters();
    render();
    fillCustomForm(customListing);
    status.textContent = `Added ${customListing.address} to the watchlist.`;
    document.querySelector("#watchlist").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function seedPrompt() {
  const sourceAppendix = `\n\nInitial public sources to check first:\n${marketSources
    .map((source) => `- ${source}`)
    .join("\n")}`;
  document.querySelector("#promptText").value = claudePrompt + sourceAppendix;
}

populateFilters();
populateTemplateSelect();
fillCustomForm(getListing("mississauga-doug"));
seedPrompt();
bindControls();
bindCustomForm();
render();
