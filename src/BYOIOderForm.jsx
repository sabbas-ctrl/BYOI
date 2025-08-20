import React, { useEffect, useMemo, useState } from "react";

/**
 * BYOI – Build Your Own Ice Cream
 * Premium, brand-centric, one-question-at-a-time order flow.
 * 
 * This file is a self-contained React component ready to be used as App.jsx inside a Vite project.
 * It uses Tailwind-style utility classes for a polished look without external UI libs.
 * 
 * How to use in Vite:
 * 1) npm create vite@latest byoi-form -- --template react
 * 2) cd byoi-form && npm i && npm i clsx
 * 3) Replace src/App.jsx with this file's contents, and start: npm run dev
 * 4) (Optional) Add Tailwind for best visuals. If not using Tailwind, the inline styles still make it look clean.
 */

// ---- Utilities ----
const cn = (...classes) => classes.filter(Boolean).join(" ");
const currency = (n) => `₨ ${n.toLocaleString("en-PK")}`;
const PKR = (n) => Math.round(n); // single currency for simplicity

// ---- Catalog / Pricing ----
const BASES = [
  { id: "classic", name: "Classic Dairy", price: 350, desc: "Rich, creamy cow's milk base – the BYOI standard." },
  { id: "lowfat", name: "Light Dairy", price: 300, desc: "Lower fat, lighter mouthfeel; keeps it breezy." },
  { id: "almond", name: "Almond Milk", price: 420, desc: "Nutty, lactose-free alternative." },
  { id: "coconut", name: "Coconut Cream", price: 480, desc: "Tropical, velvety, naturally sweet notes." },
  { id: "oat", name: "Oat Silk", price: 440, desc: "Smooth, plant-based and barista-style silkiness." },
];

const PROTEIN = [
  { id: "none", name: "No Protein Boost", price: 0, desc: "Skip the protein shot; classic indulgence." },
  { id: "whey", name: "Whey Isolate +15g", price: 180, desc: "Clean whey isolate for a gym-friendly scoop." },
  { id: "casein", name: "Casein +15g", price: 220, desc: "Thicker body, slower release – dessert that lasts." },
];

const SWEETENERS = [
  { id: "cane", name: "Cane Sugar", price: 60, desc: "Traditional sweetness with perfect caramel notes." },
  { id: "brown", name: "Brown Sugar", price: 80, desc: "Deeper, molasses-y tone for warmth." },
  { id: "stevia", name: "Stevia Blend", price: 70, desc: "Low-cal sweet with a balanced profile." },
  { id: "dates", name: "Date Syrup", price: 120, desc: "Natural sweetness + minerals; Pakistani favourite." },
  { id: "honey", name: "Raw Honey", price: 140, desc: "Floral, bright; pairs great with nuts & fruits." },
];

const MIXINS = [
  { id: "nuts", name: "Roasted Almonds", price: 120 },
  { id: "walnut", name: "Walnuts", price: 140 },
  { id: "pistachio", name: "Pistachios", price: 160 },
  { id: "chocochips", name: "Dark Choco Chips", price: 110 },
  { id: "brownie", name: "Brownie Bites", price: 180 },
  { id: "straw", name: "Strawberry Swirl", price: 130 },
  { id: "mango", name: "Mango Cubes (Seasonal)", price: 150 },
  { id: "oreo", name: "Oreo Crumble", price: 140 },
  { id: "dates", name: "Chopped Dates", price: 90 },
  { id: "peanut", name: "Peanut Butter Ribbon", price: 150 },
];

const EXTRA_RICH_PRICE = 120; // adds extra cream & butterfat

const CONSISTENCY = [
  {
    id: "scoop",
    name: "Scoop Style",
    desc: "Firm set, classic scoopable texture – best for cones and neat bowls.",
    price: 0,
  },
  {
    id: "soft",
    name: "Soft-Serve",
    desc: "Airier, silk-soft ribbons – dessert parlor vibes, melts faster.",
    price: 40,
  },
];

// ---- Step Model ----
const STEPS = [
  { id: "welcome", title: "Build Your Own Ice Cream", required: false },
  { id: "user", title: "Your Details", required: true },
  { id: "base", title: "Select a Base", required: true },
  { id: "protein", title: "Milk Protein", required: false },
  { id: "sweeten", title: "How should we sweeten it?", required: false },
  { id: "mixins", title: "Mix‑Ins (Pick any)", required: false },
  { id: "rich", title: "Make it Extra Rich?", required: false },
  { id: "consistency", title: "Preferred Consistency", required: true },
  { id: "pickup", title: "Pickup Date & Time", required: true },
  { id: "review", title: "Review & Confirm", required: true },
];

// ---- Component ----
export default function BYOIOderForm() {
  // form state
  const [stepIdx, setStepIdx] = useState(0);
  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [baseId, setBaseId] = useState(null);
  const [proteinId, setProteinId] = useState("none");
  const [sweetenerId, setSweetenerId] = useState("cane");
  const [mixins, setMixins] = useState([]); // array of ids
  const [extraRich, setExtraRich] = useState(false);
  const [consistencyId, setConsistencyId] = useState("scoop");
  const [pickupAt, setPickupAt] = useState("");
  const [notes, setNotes] = useState("");

  // persist to localStorage for delightful UX
  useEffect(() => {
    const saved = localStorage.getItem("byoi-order");
    if (saved) {
      try {
        const s = JSON.parse(saved);
        setUser(s.user || user);
        setBaseId(s.baseId || null);
        setProteinId(s.proteinId ?? "none");
        setSweetenerId(s.sweetenerId ?? "cane");
        setMixins(s.mixins || []);
        setExtraRich(!!s.extraRich);
        setConsistencyId(s.consistencyId || "scoop");
        setPickupAt(s.pickupAt || "");
        setNotes(s.notes || "");
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "byoi-order",
      JSON.stringify({ user, baseId, proteinId, sweetenerId, mixins, extraRich, consistencyId, pickupAt, notes })
    );
  }, [user, baseId, proteinId, sweetenerId, mixins, extraRich, consistencyId, pickupAt, notes]);

  // derived pricing
  const price = useMemo(() => {
    const base = BASES.find((b) => b.id === baseId)?.price || 0;
    const protein = PROTEIN.find((p) => p.id === proteinId)?.price || 0;
    const sweet = SWEETENERS.find((s) => s.id === sweetenerId)?.price || 0;
    const mix = mixins.map((id) => MIXINS.find((m) => m.id === id)?.price || 0).reduce((a, b) => a + b, 0);
    const rich = extraRich ? EXTRA_RICH_PRICE : 0;
    const consistency = CONSISTENCY.find((c) => c.id === consistencyId)?.price || 0;
    return PKR(base + protein + sweet + mix + rich + consistency);
  }, [baseId, proteinId, sweetenerId, mixins, extraRich, consistencyId]);

  const progress = ((stepIdx + 1) / STEPS.length) * 100;

  // helpers
  const toggleMixin = (id) => {
    setMixins((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const goNext = () => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
  const goPrev = () => setStepIdx((i) => Math.max(i - 1, 0));

  const canContinue = useMemo(() => {
    const step = STEPS[stepIdx]?.id;
    if (step === "user") return user.name && /.+@.+/.test(user.email) && user.phone.length >= 10;
    if (step === "base") return !!baseId;
    if (step === "consistency") return !!consistencyId;
    if (step === "pickup") return !!pickupAt;
    return true;
  }, [stepIdx, user, baseId, consistencyId, pickupAt]);

  const resetAll = () => {
    setUser({ name: "", email: "", phone: "" });
    setBaseId(null);
    setProteinId("none");
    setSweetenerId("cane");
    setMixins([]);
    setExtraRich(false);
    setConsistencyId("scoop");
    setPickupAt("");
    setNotes("");
    setStepIdx(0);
    localStorage.removeItem("byoi-order");
  };

  const removeFromBreakdown = (type, id) => {
    if (type === "base") setBaseId(null);
    if (type === "protein") setProteinId("none");
    if (type === "sweet") setSweetenerId("cane");
    if (type === "mixin") toggleMixin(id);
    if (type === "rich") setExtraRich(false);
    if (type === "consistency") setConsistencyId("scoop");
  };

  const placeOrder = () => {
    const summary = {
      user,
      base: BASES.find((b) => b.id === baseId)?.name || null,
      protein: PROTEIN.find((p) => p.id === proteinId)?.name,
      sweetener: SWEETENERS.find((s) => s.id === sweetenerId)?.name,
      mixins: mixins.map((id) => MIXINS.find((m) => m.id === id)?.name),
      extraRich,
      consistency: CONSISTENCY.find((c) => c.id === consistencyId)?.name,
      pickupAt,
      notes,
      total: price,
    };
    alert(`Order Placed!\n\n${JSON.stringify(summary, null, 2)}`);
  };

  // ---- UI ----
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#ffedd5] via-[#ffd7b1] to-[#ffb77b] flex items-start justify-center p-4 md:p-10">
      <div className="w-full max-w-6xl grid md:grid-cols-5 gap-6">
        {/* Left: Form */}
        <div className="md:col-span-3">
          <BrandHeader price={price} />

          <div className="relative mt-4 overflow-hidden rounded-3xl shadow-2xl bg-white/80 backdrop-blur-md border border-white/50">
            <Progress value={progress} />

            <div className="p-6 md:p-10">
              {STEPS[stepIdx]?.id === "welcome" && (
                <Welcome onStart={() => setStepIdx(1)} />
              )}

              {STEPS[stepIdx]?.id === "user" && (
                <CardStep
                  title="Tell us about you"
                  subtitle="We’ll use these details to confirm your order and share pickup updates."
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Full Name" required>
                      <input
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="input"
                        placeholder="e.g., Sabbas Ahmad"
                      />
                    </Field>
                    <Field label="Email" required>
                      <input
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        className="input"
                        placeholder="you@example.com"
                        type="email"
                      />
                    </Field>
                    <Field label="Phone" required>
                      <input
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                        className="input"
                        placeholder="03xx-xxxxxxx"
                      />
                    </Field>
                    <Field label="Special notes (optional)">
                      <input
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="input"
                        placeholder="Allergies, cone preference, etc."
                      />
                    </Field>
                  </div>
                </CardStep>
              )}

              {STEPS[stepIdx]?.id === "base" && (
                <CardStep
                  title="Select a Base"
                  subtitle="This decides the core flavour, fat content, and mouthfeel of your ice cream. Choose your vibe; prices vary per base."
                >
                  <OptionGrid>
                    {BASES.map((b) => (
                      <OptionCard
                        key={b.id}
                        selected={baseId === b.id}
                        title={b.name}
                        price={b.price}
                        desc={b.desc}
                        onClick={() => setBaseId(b.id)}
                      />
                    ))}
                  </OptionGrid>
                  <p className="mt-3 text-sm text-gray-600">Tip: Plant-based bases (Almond, Oat, Coconut) are lactose-free and pair beautifully with nuts & fruit swirls.</p>
                </CardStep>
              )}

              {STEPS[stepIdx]?.id === "protein" && (
                <CardStep
                  title="Milk Protein"
                  subtitle="Add a protein boost to change body and satiety. Whey is lighter; Casein makes it thicker. Optional, priced per shot."
                >
                  <OptionGrid cols="3">
                    {PROTEIN.map((p) => (
                      <OptionCard
                        key={p.id}
                        selected={proteinId === p.id}
                        title={p.name}
                        price={p.price}
                        desc={p.desc}
                        onClick={() => setProteinId(p.id)}
                      />
                    ))}
                  </OptionGrid>
                </CardStep>
              )}

              {STEPS[stepIdx]?.id === "sweeten" && (
                <CardStep
                  title="How should we sweeten it?"
                  subtitle="Sweeteners alter sweetness level and flavour tone. Natural options like honey or dates add character."
                >
                  <OptionGrid cols="3">
                    {SWEETENERS.map((s) => (
                      <OptionCard
                        key={s.id}
                        selected={sweetenerId === s.id}
                        title={s.name}
                        price={s.price}
                        desc={s.desc}
                        onClick={() => setSweetenerId(s.id)}
                      />
                    ))}
                  </OptionGrid>
                </CardStep>
              )}

              {STEPS[stepIdx]?.id === "mixins" && (
                <CardStep
                  title="Mix‑Ins"
                  subtitle="All optional and separately priced. Layer textures & flavours—go subtle or go wild."
                >
                  <div className="flex flex-wrap gap-2">
                    {MIXINS.map((m) => (
                      <Chip
                        key={m.id}
                        active={mixins.includes(m.id)}
                        onClick={() => toggleMixin(m.id)}
                        label={`${m.name} · ${currency(m.price)}`}
                      />
                    ))}
                  </div>
                  {mixins.length > 0 && (
                    <p className="mt-3 text-sm text-gray-600">Selected: {mixins.length} item(s). You can also remove them from the price panel on the right.</p>
                  )}
                </CardStep>
              )}

              {STEPS[stepIdx]?.id === "rich" && (
                <CardStep
                  title="Make it extra rich?"
                  subtitle="A small upgrade in butterfat for fuller, silkier body. Great with chocolate & nutty profiles."
                >
                  <div className="flex items-center gap-4">
                    <Toggle active={extraRich} onChange={setExtraRich} />
                    <span className="text-gray-700">Add Extra Richness {extraRich ? `(+${currency(EXTRA_RICH_PRICE)})` : `(adds ${currency(EXTRA_RICH_PRICE)})`}</span>
                  </div>
                </CardStep>
              )}

              {STEPS[stepIdx]?.id === "consistency" && (
                <CardStep
                  title="Preferred consistency"
                  subtitle="Scoop Style is firm and classic; Soft‑Serve is airy and ribboned. Both delicious—pick your serving style."
                >
                  <OptionGrid cols="2">
                    {CONSISTENCY.map((c) => (
                      <OptionCard
                        key={c.id}
                        selected={consistencyId === c.id}
                        title={c.name}
                        price={c.price}
                        desc={c.desc}
                        onClick={() => setConsistencyId(c.id)}
                      />
                    ))}
                  </OptionGrid>
                </CardStep>
              )}

              {STEPS[stepIdx]?.id === "pickup" && (
                <CardStep
                  title="Pickup date & time"
                  subtitle="We hand‑spin your order fresh. Choose a slot so it’s set and perfect when you arrive."
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="When should we have it ready?" required>
                      <input
                        type="datetime-local"
                        className="input"
                        value={pickupAt}
                        min={minDateTime()}
                        onChange={(e) => setPickupAt(e.target.value)}
                      />
                    </Field>
                    <div className="rounded-2xl p-4 bg-orange-50 border border-orange-200 text-sm text-orange-800">
                      Heads‑up: If you’re more than 20 minutes late, we’ll keep it chilled but texture may soften slightly.
                    </div>
                  </div>
                </CardStep>
              )}

              {STEPS[stepIdx]?.id === "review" && (
                <CardStep
                  title="Confirm your order"
                  subtitle="Review items, unselect anything you want to drop, and place your order."
                >
                  <OrderSummary
                    user={user}
                    baseId={baseId}
                    proteinId={proteinId}
                    sweetenerId={sweetenerId}
                    mixins={mixins}
                    extraRich={extraRich}
                    consistencyId={consistencyId}
                    pickupAt={pickupAt}
                    onEdit={(step) => setStepIdx(step)}
                  />
                </CardStep>
              )}

              {/* Nav */}
              {STEPS[stepIdx]?.id !== "welcome" && (
                <div className="mt-6 flex items-center justify-between">
                  <button className="btn-secondary" onClick={goPrev} disabled={stepIdx === 0}>
                    ← Previous
                  </button>
                  <div className="flex items-center gap-3">
                    <button className="btn-ghost" onClick={resetAll}>Reset</button>
                    {STEPS[stepIdx]?.id !== "review" ? (
                      <button className="btn-primary" onClick={goNext} disabled={!canContinue}>
                        Next →
                      </button>
                    ) : (
                      <button className="btn-primary" onClick={placeOrder}>
                        Place Order · {currency(price)}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick step jump */}
          <div className="mt-4 flex flex-wrap gap-2">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                className={cn(
                  "px-3 py-1 rounded-full text-sm border",
                  i === stepIdx ? "bg-black text-white border-black" : "bg-white/70 backdrop-blur border-gray-300 text-gray-700 hover:bg-gray-50"
                )}
                onClick={() => setStepIdx(i)}
                title={s.title}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Price & Breakdown */}
        <div className="md:col-span-2">
          <PricePanel
            user={user}
            baseId={baseId}
            proteinId={proteinId}
            sweetenerId={sweetenerId}
            mixins={mixins}
            extraRich={extraRich}
            consistencyId={consistencyId}
            pickupAt={pickupAt}
            price={price}
            onRemove={removeFromBreakdown}
          />
        </div>
      </div>

      {/* Styles (utility classes if Tailwind missing) */}
      <style>{`
        .input { width: 100%; border-radius: 16px; padding: 12px 14px; border: 1px solid #e5e7eb; background: white; outline: none; box-shadow: 0 1px 0 rgba(0,0,0,0.02); }
        .input:focus { border-color: #fb923c; box-shadow: 0 0 0 4px rgba(251,146,60,0.15); }
        .btn-primary { background:#111827; color:white; padding:12px 18px; border-radius:14px; font-weight:600; }
        .btn-primary:disabled { opacity:.4; cursor:not-allowed; }
        .btn-secondary { background:white; border:1px solid #e5e7eb; padding:10px 16px; border-radius:14px; }
        .btn-ghost { background:transparent; padding:10px 16px; border-radius:14px; }
        .opt { border:1px solid #f3f4f6; background:linear-gradient(180deg, #ffffff, #fff7ed); border-radius:18px; padding:16px; cursor:pointer; transition: all .2s ease; }
        .opt:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(0,0,0,0.06); }
        .opt.sel { border-color:#fb923c; box-shadow: 0 0 0 4px rgba(251,146,60,.15); }
        .chip { border:1px solid #e5e7eb; padding:8px 12px; border-radius:999px; background:white; cursor:pointer; }
        .chip.active { background:#111827; color:white; border-color:#111827; }
      `}</style>
    </div>
  );
}

// ---- Subcomponents ----
function BrandHeader({ price }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-white/70 backdrop-blur border border-white flex items-center justify-center text-2xl">🍦</div>
        <div>
          <div className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">BYOI — Build Your Own Ice Cream</div>
          <div className="text-gray-600">Craft your scoop like a pro. 1 question at a time.</div>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur border px-4 py-2 text-sm text-gray-700">
        Current total <span className="font-semibold text-gray-900">{currency(price)}</span>
      </div>
    </div>
  );
}

function Progress({ value }) {
  return (
    <div className="h-2 w-full bg-white/60">
      <div className="h-2 bg-black" style={{ width: `${Math.max(6, value)}%`, borderTopRightRadius: 16, borderBottomRightRadius: 16 }} />
    </div>
  );
}

function Welcome({ onStart }) {
  return (
    <div className="flex flex-col items-start gap-5">
      <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">Order Form</h2>
      <p className="text-gray-700 leading-relaxed max-w-2xl">
        Welcome to BYOI. This flow treats each choice like a chef’s decision—explained, priced, and reversible. You’ll see a live price breakdown on the right and you can unselect anything anytime.
      </p>
      <ul className="text-gray-700 list-disc pl-4 space-y-1">
        <li>Brand‑centric interface with premium UX</li>
        <li>One question per screen with Previous/Next</li>
        <li>Detailed explanations for every decision</li>
      </ul>
      <div className="flex items-center gap-3">
        <button className="btn-primary" onClick={onStart}>Start →</button>
        <span className="text-sm text-gray-500">≈ 1–2 minutes</span>
      </div>
    </div>
  );
}

function CardStep({ title, subtitle, children }) {
  return (
    <div>
      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">{title}</h3>
      <p className="mt-1 text-gray-600 max-w-3xl">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-gray-800">{label} {required && <span className="text-red-500">*</span>}</span>
      {children}
    </label>
  );
}

function OptionGrid({ children, cols = "2" }) {
  return <div className={cn("grid gap-4", `grid-cols-1 md:grid-cols-${cols}`)}>{children}</div>;
}

function OptionCard({ title, desc, price, selected, onClick }) {
  return (
    <button className={cn("opt text-left", selected && "sel")} onClick={onClick}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-semibold text-gray-900">{title}</div>
          {desc && <div className="text-sm text-gray-600 mt-1">{desc}</div>}
        </div>
        <div className="text-sm font-semibold text-gray-900">{currency(price)}</div>
      </div>
    </button>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button className={cn("chip text-sm", active && "active")} onClick={onClick}>
      {label}
    </button>
  );
}

function Toggle({ active, onChange }) {
  return (
    <button
      className={cn(
        "relative inline-flex h-8 w-14 items-center rounded-full transition-colors",
        active ? "bg-black" : "bg-gray-300"
      )}
      onClick={() => onChange(!active)}
    >
      <span
        className={cn(
          "inline-block h-6 w-6 transform rounded-full bg-white transition-transform",
          active ? "translate-x-7" : "translate-x-1"
        )}
      />
    </button>
  );
}

function PricePanel({ user, baseId, proteinId, sweetenerId, mixins, extraRich, consistencyId, pickupAt, price, onRemove }) {
  const items = [];
  const base = BASES.find((b) => b.id === baseId);
  const protein = PROTEIN.find((p) => p.id === proteinId);
  const sweet = SWEETENERS.find((s) => s.id === sweetenerId);
  const consist = CONSISTENCY.find((c) => c.id === consistencyId);

  if (base) items.push({ type: "base", id: base.id, name: base.name, price: base.price });
  if (protein) items.push({ type: "protein", id: protein.id, name: protein.name, price: protein.price });
  if (sweet) items.push({ type: "sweet", id: sweet.id, name: sweet.name, price: sweet.price });
  mixins.forEach((id) => {
    const m = MIXINS.find((x) => x.id === id);
    if (m) items.push({ type: "mixin", id: m.id, name: m.name, price: m.price });
  });
  if (extraRich) items.push({ type: "rich", id: "rich", name: "Extra Richness", price: EXTRA_RICH_PRICE });
  if (consist) items.push({ type: "consistency", id: consist.id, name: `${consist.name} (serving)`, price: consist.price });

  return (
    <div className="sticky top-6">
      <div className="rounded-3xl shadow-2xl bg-white/85 backdrop-blur border border-white/60 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-extrabold text-xl text-gray-900">Your build</div>
            <div className="text-gray-600 text-sm">Click any item to unselect/remove.</div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wide text-gray-500">Total</div>
            <div className="text-2xl font-black text-gray-900">{currency(price)}</div>
          </div>
        </div>

        <div className="mt-4 divide-y divide-gray-100">
          {items.length === 0 && (
            <div className="text-sm text-gray-500 py-6">Start building to see a live breakdown.</div>
          )}
          {items.map((it) => (
            <button key={`${it.type}:${it.id}`} className="w-full text-left py-3 flex items-center justify-between hover:bg-gray-50" onClick={() => onRemove(it.type, it.id)}>
              <div className="text-gray-800">{it.name}</div>
              <div className="font-semibold text-gray-900">{currency(it.price)} × <span className="text-gray-500 text-xs">tap to remove</span></div>
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-gray-50 p-3 border text-gray-700">
            <div className="text-xs text-gray-500">Pickup</div>
            <div>{pickupAt ? new Date(pickupAt).toLocaleString() : "—"}</div>
          </div>
          <div className="rounded-2xl bg-gray-50 p-3 border text-gray-700">
            <div className="text-xs text-gray-500">Customer</div>
            <div>{user.name || "—"}</div>
            <div className="text-gray-500">{user.phone || user.email || ""}</div>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500">Taxes included. Prices in PKR. Remove any line item to adjust instantly.</p>
      </div>
    </div>
  );
}

function OrderSummary({ user, baseId, proteinId, sweetenerId, mixins, extraRich, consistencyId, pickupAt, onEdit }) {
  const rows = [];
  const push = (label, value, stepKey) => rows.push({ label, value, stepKey });

  push("Base", BASES.find((b) => b.id === baseId)?.name || "—", 2);
  push("Protein", PROTEIN.find((p) => p.id === proteinId)?.name || "—", 3);
  push("Sweetener", SWEETENERS.find((s) => s.id === sweetenerId)?.name || "—", 4);
  push("Mix‑Ins", mixins.map((m) => MIXINS.find((x) => x.id === m)?.name).filter(Boolean).join(", ") || "—", 5);
  push("Extra Rich", extraRich ? "Yes" : "No", 6);
  push("Consistency", CONSISTENCY.find((c) => c.id === consistencyId)?.name || "—", 7);
  push("Pickup", pickupAt ? new Date(pickupAt).toLocaleString() : "—", 8);

  return (
    <div className="rounded-2xl border bg-white p-4 md:p-6">
      <div className="grid gap-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between border-b last:border-b-0 py-3">
            <div className="text-gray-700">
              <div className="text-sm font-medium">{r.label}</div>
              <div className="text-sm text-gray-500">{r.value}</div>
            </div>
            <button className="px-3 py-1.5 rounded-full border text-sm hover:bg-gray-50" onClick={() => onEdit(r.stepKey)}>Change</button>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-500">Before placing your order, ensure contact details and pickup time are correct. You’ll receive an SMS/Email confirmation.</p>
    </div>
  );
}

// ---- helpers ----
function minDateTime() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 30); // 30 minutes from now
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
