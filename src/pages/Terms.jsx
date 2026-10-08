import { Link } from "react-router-dom";
import { SITE } from "../../constants/site";

// Keep in step with Privacy.jsx. If billing, AI features or community rules
// change, update this page and the effective date.
const EFFECTIVE_DATE = "October 8, 2026";

const SECTIONS = [
  {
    id: "using",
    title: "Using Vahoha",
    items: [
      "Vahoha is a learning platform for developers: roadmaps, exams, an AI mentor, capstone projects and team projects.",
      "By creating an account or using the site, you agree to these terms. If you don't agree, don't use the service.",
      "You must provide accurate account details and keep your password secure. You are responsible for activity under your account.",
    ],
  },
  {
    id: "conduct",
    title: "Acceptable use",
    items: [
      "Don't attack, probe or overload the service, or try to access other users' accounts or data.",
      "Don't cheat the exam or challenge systems, for example by automating submissions or sharing answers to bypass grading.",
      "Don't post unlawful, harassing, hateful or spammy content, or content you don't have the right to share.",
      "We may remove content or suspend accounts that break these rules.",
    ],
  },
  {
    id: "content",
    title: "Your content",
    items: [
      "You own what you post and the code you submit. You give us permission to store, display and process it as needed to run the service, including showing your public profile and posts to other users.",
      "Team projects and capstones you publish may be visible to others as evidence of your work.",
    ],
  },
  {
    id: "ai",
    title: "AI mentor",
    items: [
      "The AI mentor and AI-graded features can be wrong. Treat their output as guidance, not as professional advice, and verify anything important.",
      "Usage limits apply and depend on your plan.",
    ],
  },
  {
    id: "billing",
    title: "Paid plans",
    items: [
      "Some features require a paid plan. Payments are handled by our payment provider, Polar, which acts as merchant of record.",
      "Subscriptions renew until cancelled. You can cancel at any time and keep access until the end of the paid period.",
      "Refunds are handled according to the payment provider's policy. Contact us if you have a billing problem.",
    ],
  },
  {
    id: "availability",
    title: "Availability and changes",
    items: [
      "The service is provided as is. We work to keep it running but don't guarantee it will be uninterrupted or error free.",
      "Features, limits and prices may change. We'll announce significant changes in the app or on this page.",
    ],
  },
  {
    id: "liability",
    title: "Liability",
    items: [
      "To the extent the law allows, Vahoha is not liable for indirect or consequential losses, or for loss of data, arising from your use of the service.",
    ],
  },
  {
    id: "termination",
    title: "Ending your account",
    items: [
      "You can delete your account in settings at any time. See the Privacy Policy for what is deleted.",
      "We may suspend or close accounts that break these terms.",
    ],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    items: [
      "If these terms change, we'll update this page and its effective date. Continuing to use Vahoha after a change means you accept the new terms.",
    ],
  },
];

const Terms = () => (
  <div className="mx-auto grid max-w-5xl gap-12 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[200px_1fr]">
    <nav aria-label="On this page" className="hidden lg:block">
      <div className="sticky top-[calc(var(--navbar-h,56px)+32px)] flex flex-col gap-2">
        <p className="mb-1 text-xs font-medium text-neutral-500">On this page</p>
        {SECTIONS.map(({ id, title }) => (
          <a key={id} href={`#${id}`} className="text-sm text-neutral-400 transition hover:text-white">
            {title}
          </a>
        ))}
      </div>
    </nav>

    <article className="flex max-w-2xl flex-col gap-12">
      <header className="flex flex-col gap-3">
        <h1
          className="text-3xl font-[450] tracking-tight text-white sm:text-4xl"
          style={{ fontFamily: '"Geist Variable", system-ui, sans-serif' }}
        >
          Terms of Service
        </h1>
        <p className="text-sm text-neutral-500">Effective {EFFECTIVE_DATE}</p>
      </header>

      {SECTIONS.map(({ id, title, items }) => (
        <section
          key={id}
          id={id}
          className="flex scroll-mt-[calc(var(--navbar-h,56px)+24px)] flex-col gap-4"
        >
          <h2 className="text-xl font-medium text-white">{title}</h2>
          <ul className="flex flex-col gap-3">
            {items.map((text) => (
              <li key={text} className="text-[15px] leading-relaxed text-neutral-400">
                {text}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="flex flex-col gap-3 border-t border-neutral-800 pt-8">
        <h2 className="text-xl font-medium text-white">Contact</h2>
        <p className="text-[15px] leading-relaxed text-neutral-400">
          Questions about these terms? Email{" "}
          <a href={`mailto:${SITE.email}`} className="text-purple-400 hover:text-purple-300">
            {SITE.email}
          </a>{" "}
          or use the{" "}
          <Link to="/contact" className="text-purple-400 hover:text-purple-300">
            contact form
          </Link>
          . See also our{" "}
          <Link to="/privacy" className="text-purple-400 hover:text-purple-300">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </article>
  </div>
);

export default Terms;
