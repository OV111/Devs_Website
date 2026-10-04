import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import GradientText from "@/components/effects/GradientText";
import CapstoneStepper from "./CapstoneStepper";
import { PrimaryButton } from "./ui";
import { heroCopy } from "../lib/hero";
import { fadeUp, scrollToSection } from "../lib/motion";
import { stepState } from "../lib/steps";

const HIGHLIGHT = {
  success: "text-green-300",
  danger: "text-red-300",
};

// Same look as PrimaryButton, for CTAs that navigate.
const LINK_CTA =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(147,51,234,0.7)] transition-colors hover:bg-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950";

/** The single primary action for the current state. */
function HeroCta({ cta, busy, actions }) {
  if (!cta) return null;
  const label = (
    <>
      {cta.label}
      <ArrowRight size={16} aria-hidden="true" />
    </>
  );

  if (cta.kind === "link") {
    return (
      <Link to={cta.to} className={LINK_CTA}>
        {label}
      </Link>
    );
  }
  if (cta.kind === "action") {
    return (
      <PrimaryButton onClick={actions[cta.action]} busy={busy === cta.action}>
        {label}
      </PrimaryButton>
    );
  }
  return (
    <PrimaryButton onClick={() => scrollToSection(cta.target, cta.focus)}>
      {label}
    </PrimaryButton>
  );
}

/**
 * Top of the capstone page: track context, a headline + body that describe
 * the learner's CURRENT state, one primary action, and the progress stepper.
 */
export default function CapstoneHero({ status, busy, actions }) {
  const { active, failed } = stepState(status);
  const copy = heroCopy(status, busy);

  return (
    <div className="flex flex-col gap-6">
      <Motion.p
        {...fadeUp(0.04)}
        className="flex items-center gap-2 text-sm text-neutral-400"
      >
        <span className="font-semibold text-purple-300">Capstone</span>
        <span aria-hidden="true" className="text-neutral-600">
          /
        </span>
        <span>{status.track.title} track</span>
      </Motion.p>

      <Motion.h1
        {...fadeUp(0.08)}
        className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[56px]"
      >
        {copy.lead}
        <br />
        {copy.pre}
        {HIGHLIGHT[copy.tone] ? (
          <span className={HIGHLIGHT[copy.tone]}>{copy.highlight}</span>
        ) : (
          <GradientText className="font-bold">{copy.highlight}</GradientText>
        )}
      </Motion.h1>

      <Motion.p
        {...fadeUp(0.14)}
        className="max-w-lg text-base leading-relaxed text-neutral-300"
      >
        {copy.body}
      </Motion.p>

      {copy.cta && (
        <Motion.div {...fadeUp(0.18)}>
          <HeroCta cta={copy.cta} busy={busy} actions={actions} />
        </Motion.div>
      )}

      <Motion.div {...fadeUp(0.22)} className="pt-4">
        <CapstoneStepper active={active} failed={failed} />
      </Motion.div>
    </div>
  );
}
