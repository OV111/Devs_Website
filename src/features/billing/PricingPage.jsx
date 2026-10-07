import { Toaster, toast } from "react-hot-toast";
import { Info } from "lucide-react";
import useAuthStore from "../../stores/useAuthStore";
import useBilling from "./hooks/useBilling";
import PlanCard from "./components/PlanCard";
import { PLANS } from "./plans";

const PricingPage = () => {
  const { auth: isAuthed } = useAuthStore();
  // Logged-out visitors can see prices but have no subscription to load.
  const { status, busy, startCheckout } = useBilling({ enabled: Boolean(isAuthed) });

  const isPro = status?.plan === "pro";
  const billingLive = status?.configured ?? false;

  const upgrade = async () => {
    if (!billingLive) {
      toast("Paid plans aren't open yet — everything is free during the pilot.");
      return;
    }
    try {
      await startCheckout();
    } catch (err) {
      // ALREADY_SUBSCRIBED etc. come back with a user-facing message.
      toast.error(err.message);
    }
  };

  // What a plan's button does depends on who is looking, so it is decided here
  // and handed to the presentational PlanCard as plain data.
  const ctaFor = (plan) => {
    if (plan.id === "free") {
      if (!isAuthed) return { label: "Get started free", to: "/get-started" };
      return { label: isPro ? "Included in Pro" : "Current plan", disabled: true };
    }
    if (plan.id === "teams") {
      return { label: "Contact sales", to: "/contact" };
    }
    // Pro
    if (!isAuthed) return { label: "Get started", to: "/get-started" };
    if (isPro) return { label: "Manage plan", to: "/billing" };
    return {
      label: busy === "checkout" ? "Redirecting…" : "Upgrade to Pro",
      onClick: upgrade,
      disabled: busy === "checkout",
    };
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 pt-28 sm:px-8">
      <Toaster position="top-center" containerStyle={{ top: "max(1rem, env(safe-area-inset-top))" }} />

      <header className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-semibold text-[#F7F7F8]">
          Simple, transparent pricing
        </h1>
        <p className="text-base text-[#A1A0AB] md:text-sm">
          Start free. Upgrade when you want the full roadmap.
        </p>
      </header>

      {!(isAuthed && billingLive) && (
        <div
          role="note"
          className="mx-auto mb-10 flex max-w-2xl items-start gap-3 rounded-lg border border-white/10 bg-zinc-900/60 px-4 py-3 text-base text-[#A1A0AB] md:text-[13px]"
        >
          <Info size={16} className="mt-0.5 shrink-0 text-purple-400" />
          <p>
            Everything is free while we run the pilot, and prices below may change before
            launch. Items tagged{" "}
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs font-medium uppercase text-zinc-400 md:text-[10px]">
              Soon
            </span>{" "}
            are planned, not built.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} cta={ctaFor(plan)} />
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-zinc-400 md:text-xs md:text-zinc-500">
        Prices in USD. Payments are handled by Polar, which also manages taxes. Cancel
        anytime from your billing page.
      </p>
    </div>
  );
};

export default PricingPage;
