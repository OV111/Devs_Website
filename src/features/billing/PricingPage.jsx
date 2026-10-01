import { Toaster, toast } from "react-hot-toast";
import { Info } from "lucide-react";
import useAuthStore from "../../stores/useAuthStore";
import PlanCard from "./components/PlanCard";
import { PLANS, CURRENT_PLAN_ID } from "./plans";

// Pricing UI only — checkout is not wired. There is no Stripe, subscription
// state or feature gate on the backend yet (see BUSINESS_MODEL.md), so "Upgrade"
// explains that instead of pretending. When billing exists, replace the toast
// below with POST /api/billing/checkout-session and redirect to the returned URL.

const CHECKOUT_NOT_LIVE =
  "Checkout isn't live yet — this is the billing UI only.";

const PricingPage = () => {
  const { auth: isAuthed } = useAuthStore();

  // What a plan's button does depends on who is looking, so it is decided here
  // and handed to the presentational PlanCard as plain data.
  const ctaFor = (plan) => {
    if (plan.id === "free") {
      return isAuthed
        ? { label: "Current plan", disabled: CURRENT_PLAN_ID === "free" }
        : { label: "Get started free", to: "/get-started" };
    }
    if (plan.id === "teams") {
      return { label: "Contact sales", to: "/contact" };
    }
    return {
      label: "Upgrade to Pro",
      onClick: () => toast(CHECKOUT_NOT_LIVE),
    };
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 pt-28 sm:px-8">
      <Toaster position="top-center" />

      <header className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-semibold text-[#F7F7F8]">
          Simple, transparent pricing
        </h1>
        <p className="text-sm text-[#A1A0AB]">
          Start free. Upgrade when you want the full roadmap.
        </p>
      </header>

      <div
        role="note"
        className="mx-auto mb-10 flex max-w-2xl items-start gap-3 rounded-lg border border-white/10 bg-zinc-900/60 px-4 py-3 text-[13px] text-[#A1A0AB]"
      >
        <Info size={16} className="mt-0.5 shrink-0 text-purple-400" />
        <p>
          Billing isn&apos;t live yet. Everything is free while we run the
          pilot, and prices below may change before launch. Items tagged{" "}
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium uppercase text-zinc-400">
            Soon
          </span>{" "}
          are planned, not built.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} cta={ctaFor(plan)} />
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-zinc-500">
        Prices in USD. Cancel anytime once billing launches.
      </p>
    </div>
  );
};

export default PricingPage;
