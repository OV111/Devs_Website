import { useState } from "react";
import { Check } from "lucide-react";
import toast from "react-hot-toast";

// Stripe payment — UI only, not wired yet.
// "Upgrade" just shows a toast; no checkout session, no backend call.
// Wire this to a real POST /api/billing/checkout-session once Stripe is added
// (see STARTUP_ADVISOR_ANALYSIS.md Week 3 / package.json — "stripe" isn't installed yet).

const TIERS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "",
    description: "For students and curious developers",
    features: [
      "Community platform — blogs, chat, profiles",
      "First 2 roadmap layers",
      "15 AI agent messages / day",
      "Basic awards",
    ],
    cta: "Current plan",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$15",
    period: "/month",
    description: "For developers actively learning",
    features: [
      "Full roadmap — every layer unlocked",
      "Unlimited AI agent messages",
      "Exam engine + certificates",
      "Verified Public Progress Profile",
      "All awards",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    id: "teams",
    name: "Teams",
    price: "$60",
    period: "/seat/month",
    description: "For companies onboarding developers (min. 3 seats)",
    features: [
      "Everything in Pro, per seat",
      "Progress reports — exportable CSV",
      "Bulk certificates",
      "Awards dashboard",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

const PricingPage = () => {
  const [loadingTier, setLoadingTier] = useState(null);

  const handleSelect = (tier) => {
    if (tier.id === "free") return;

    setLoadingTier(tier.id);
    setTimeout(() => {
      setLoadingTier(null);
      toast(
        tier.id === "teams"
          ? "Teams sales flow isn't wired up yet."
          : "Stripe checkout isn't wired up yet — UI only for now.",
      );
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-[26px] sm:text-[30px] font-semibold text-[#1a1f36] dark:text-white mb-2">
          Simple, transparent pricing
        </h1>
        <p className="text-[14px] text-[#697386] dark:text-zinc-400">
          Start free. Upgrade when you're ready to unlock the full roadmap.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`relative rounded-xl px-6 py-8 flex flex-col ${
              tier.highlighted
                ? "bg-[#1a1f36] dark:bg-white text-white dark:text-[#1a1f36] shadow-lg scale-[1.02]"
                : "bg-white dark:bg-neutral-800/60 dark:backdrop-blur-sm text-[#1a1f36] dark:text-white"
            }`}
          >
            {tier.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-fuchsia-600 text-white text-[11px] font-semibold px-3 py-1">
                Most popular
              </span>
            )}

            <h2 className="text-[17px] font-semibold mb-1">{tier.name}</h2>
            <p
              className={`text-[13px] mb-5 ${
                tier.highlighted ? "text-white/70 dark:text-[#1a1f36]/70" : "text-[#697386] dark:text-zinc-400"
              }`}
            >
              {tier.description}
            </p>

            <div className="mb-6">
              <span className="text-[32px] font-bold">{tier.price}</span>
              <span
                className={`text-[13px] ${
                  tier.highlighted ? "text-white/70 dark:text-[#1a1f36]/70" : "text-[#697386] dark:text-zinc-400"
                }`}
              >
                {tier.period}
              </span>
            </div>

            <ul className="space-y-2.5 mb-8 flex-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-[13px]">
                  <Check size={15} className="shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelect(tier)}
              disabled={tier.id === "free" || loadingTier === tier.id}
              className={`rounded-full px-5 py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                tier.highlighted
                  ? "bg-fuchsia-600 text-white hover:bg-fuchsia-700"
                  : "border border-neutral-300 dark:border-neutral-600"
              }`}
            >
              {loadingTier === tier.id ? "Loading…" : tier.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-[12px] text-neutral-400 dark:text-neutral-500 mt-10">
        Cancel anytime. Prices in USD.
      </p>
    </div>
  );
};

export default PricingPage;
