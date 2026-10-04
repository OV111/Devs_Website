import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const CTA_BASE =
  "mt-auto w-full rounded-md px-5 py-2.5 text-center text-sm font-medium transition-colors";

/**
 * One pricing card. Presentational only: the page decides what the call to
 * action does (`cta` is `{ label, to?, onClick?, disabled? }`), so this component
 * never learns about auth, Stripe or routing and stays reusable on /billing.
 */
const PlanCard = ({ plan, cta }) => {
  const ctaClass = `${CTA_BASE} ${
    plan.highlighted
      ? "bg-purple-600 text-white hover:bg-purple-500"
      : "border border-white/15 text-[#F7F7F8] hover:bg-white/5"
  } disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent`;

  return (
    <article
      className={`relative flex flex-col rounded-xl border p-6 ${
        plan.highlighted
          ? "border-purple-500/60 bg-zinc-900 shadow-lg shadow-purple-900/20"
          : "border-white/10 bg-zinc-950"
      }`}
    >
      {plan.highlighted && (
        <span className="absolute -top-3 left-6 rounded-full bg-purple-600 px-3 py-1 text-[11px] font-semibold text-white">
          Most popular
        </span>
      )}

      <h2 className="text-lg font-semibold text-[#F7F7F8]">{plan.name}</h2>
      <p className="mt-1 min-h-10 text-[13px] text-[#A1A0AB]">
        {plan.description}
      </p>

      <p className="mt-5 mb-6">
        <span className="text-4xl font-bold text-[#F7F7F8]">{plan.price}</span>
        <span className="text-[13px] text-[#A1A0AB]">{plan.period}</span>
      </p>

      <ul className="mb-8 space-y-2.5">
        {plan.features.map((feature) => (
          <li
            key={feature.text}
            className="flex items-start gap-2 text-[13px] text-[#D4D4DC]"
          >
            <Check
              size={15}
              className={`mt-0.5 shrink-0 ${
                feature.soon ? "text-zinc-600" : "text-purple-400"
              }`}
              aria-hidden="true"
            />
            <span className={feature.soon ? "text-[#A1A0AB]" : ""}>
              {feature.text}
              {feature.soon && (
                <span className="ml-2 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                  Soon
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {cta.to && !cta.disabled ? (
        <Link to={cta.to} className={ctaClass}>
          {cta.label}
        </Link>
      ) : (
        <button
          type="button"
          onClick={cta.onClick}
          disabled={cta.disabled}
          className={ctaClass}
        >
          {cta.label}
        </button>
      )}
    </article>
  );
};

export default PlanCard;
