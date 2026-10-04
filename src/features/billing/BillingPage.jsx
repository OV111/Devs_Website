import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { AlertTriangle, Check, CreditCard, Info } from "lucide-react";
import useBilling from "./hooks/useBilling";
import { PLANS_BY_ID } from "./plans";

const SECTION = "rounded-xl border border-white/10 bg-zinc-950 p-6";
const SECTION_TITLE = "mb-4 text-base font-semibold text-[#F7F7F8]";
const PRIMARY_BTN =
  "rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50";
const SECONDARY_BTN =
  "rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-[#F7F7F8] transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

/** One sentence under the plan name that says what will happen next. */
const describeRenewal = (status) => {
  if (!status.entitled) return null;
  const date = formatDate(status.currentPeriodEnd);
  if (status.status === "past_due") {
    return "Your last payment failed. Update your card to keep Pro.";
  }
  if (status.cancelAtPeriodEnd) {
    return date ? `Cancels on ${date}. You keep Pro until then.` : "Cancels at the end of this period.";
  }
  return date ? `Renews on ${date}.` : null;
};

const Notice = ({ icon, children, tone = "info" }) => (
  <div
    role="note"
    className={`mb-6 flex items-start gap-3 rounded-lg border px-4 py-3 text-[13px] ${
      tone === "warn"
        ? "border-amber-500/30 bg-amber-500/5 text-amber-200"
        : "border-white/10 bg-zinc-900/60 text-[#A1A0AB]"
    }`}
  >
    <span className="mt-0.5 shrink-0">{icon}</span>
    <p>{children}</p>
  </div>
);

const BillingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { status, loading, error, busy, startCheckout, openPortal, syncAfterCheckout } =
    useBilling();

  // Polar sends the customer back here with ?checkout=success. The webhook that
  // actually grants Pro may still be in flight, so ask the server to pull the
  // subscription directly. Guarded by a ref because React StrictMode runs
  // effects twice in dev and this must only fire once per redirect.
  const handledReturn = useRef(false);
  useEffect(() => {
    if (searchParams.get("checkout") !== "success" || handledReturn.current) return;
    handledReturn.current = true;

    (async () => {
      const ok = await syncAfterCheckout();
      toast[ok ? "success" : "error"](
        ok
          ? "Thanks! Your subscription is being activated."
          : "Payment received, but we couldn't confirm it yet. Refresh in a minute.",
      );
      setSearchParams({}, { replace: true });
    })();
  }, [searchParams, setSearchParams, syncAfterCheckout]);

  const run = (action) => async () => {
    try {
      await action();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const plan = PLANS_BY_ID[status?.plan ?? "free"];
  const isPro = status?.plan === "pro";
  const hasBillingAccount = status && status.status !== "none";
  const included = plan.features.filter((f) => !f.soon);
  const renewal = status ? describeRenewal(status) : null;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 pt-28 sm:px-8">
      <Toaster position="top-center" />

      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-[#F7F7F8]">Billing</h1>
        <p className="mt-1 text-sm text-[#A1A0AB]">
          Your plan, payment method and invoices.
        </p>
      </header>

      {loading && (
        <div className={`${SECTION} animate-pulse`} aria-busy="true" aria-label="Loading billing">
          <div className="mb-3 h-5 w-32 rounded bg-white/10" />
          <div className="h-4 w-64 rounded bg-white/5" />
        </div>
      )}

      {!loading && error && !status && (
        <Notice tone="warn" icon={<AlertTriangle size={16} />}>
          Couldn&apos;t load your billing details. {error.message}
        </Notice>
      )}

      {status && (
        <>
          {!status.configured && (
            <Notice icon={<Info size={16} className="text-purple-400" />}>
              Billing isn&apos;t live yet — everything is free during the pilot, so there is
              nothing to pay for or manage here today.
            </Notice>
          )}
          {status.configured && !status.enforced && (
            <Notice icon={<Info size={16} className="text-purple-400" />}>
              Paid plans are open for early supporters. Features aren&apos;t limited by plan
              yet, so everything stays available while we run the pilot.
            </Notice>
          )}
          {status.status === "past_due" && (
            <Notice tone="warn" icon={<AlertTriangle size={16} />}>
              We couldn&apos;t charge your card. Update it in the billing portal to avoid losing
              access.
            </Notice>
          )}

          <div className="space-y-6">
            <section className={SECTION} aria-labelledby="plan-heading">
              <h2 id="plan-heading" className={SECTION_TITLE}>
                Current plan
              </h2>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold text-[#F7F7F8]">
                    {plan.name}
                    <span className="ml-3 text-sm font-normal text-[#A1A0AB]">
                      {plan.price}
                      {plan.period}
                    </span>
                  </p>
                  <p className="mt-1 text-[13px] text-[#A1A0AB]">
                    {renewal ?? plan.description}
                  </p>
                </div>

                <div className="flex gap-3">
                  {!isPro && status.configured && (
                    <button
                      type="button"
                      className={PRIMARY_BTN}
                      disabled={busy === "checkout"}
                      onClick={run(startCheckout)}
                    >
                      {busy === "checkout" ? "Redirecting…" : "Upgrade to Pro"}
                    </button>
                  )}
                  {!isPro && (
                    <Link to="/pricing" className={SECONDARY_BTN}>
                      Compare plans
                    </Link>
                  )}
                </div>
              </div>

              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {included.map((feature) => (
                  <li
                    key={feature.text}
                    className="flex items-start gap-2 text-[13px] text-[#D4D4DC]"
                  >
                    <Check
                      size={15}
                      className="mt-0.5 shrink-0 text-purple-400"
                      aria-hidden="true"
                    />
                    {feature.text}
                  </li>
                ))}
              </ul>
            </section>

            {/* Card, invoices and cancellation all live in Polar's hosted portal,
                so we link to it instead of rebuilding (and securing) them. */}
            <section className={SECTION} aria-labelledby="portal-heading">
              <h2 id="portal-heading" className={SECTION_TITLE}>
                Payment method &amp; invoices
              </h2>

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <CreditCard
                    size={20}
                    className="mt-0.5 shrink-0 text-zinc-500"
                    aria-hidden="true"
                  />
                  <p className="text-[13px] text-[#A1A0AB]">
                    {hasBillingAccount
                      ? "Update your card, download invoices or cancel your subscription in the secure billing portal."
                      : "You don't have a billing account yet. It's created when you subscribe."}
                  </p>
                </div>

                <button
                  type="button"
                  className={SECONDARY_BTN}
                  disabled={!status.configured || !hasBillingAccount || busy === "portal"}
                  onClick={run(openPortal)}
                >
                  {busy === "portal" ? "Opening…" : "Manage billing"}
                </button>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default BillingPage;
