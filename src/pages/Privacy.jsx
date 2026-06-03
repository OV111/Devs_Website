import { Link } from "react-router-dom";

const sections = [
  {
    title: "Information We Collect",
    content: [
      "Account information: first name, last name, username, email address, and profile image when you register.",
      "Content you create: blog posts, articles, and any other content you publish on the platform.",
      "Usage data: pages you visit and search queries you perform within the platform.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "To create and manage your account.",
      "To display your profile and published content to other users.",
      "To send newsletter updates if you have subscribed.",
      "To improve and maintain the platform.",
    ],
  },
  {
    title: "What We Do Not Do",
    content: [
      "We do not sell your personal data to third parties.",
      "We do not share your information with advertisers.",
      "We do not use your content for purposes beyond operating the platform.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "View and update your information at any time from your profile page.",
      "Delete your account and all associated data via the Delete Account option in settings.",
      "Unsubscribe from newsletter emails at any time using the unsubscribe link in any email.",
    ],
  },
  {
    title: "Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. Continued use of DevsWebs after changes constitutes your acceptance of the updated policy.",
    ],
  },
];

const Privacy = () => {
  return (
    <div className="relative overflow-hidden">

      <div className="mx-auto max-w-3xl px-6 sm:px-10 py-16 flex flex-col gap-10">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-purple-800 dark:text-purple-300">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Effective date: March 2025
          </p>
          <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            At <span className="font-semibold text-purple-700 dark:text-purple-400">DevsWebs</span>, we
            respect your privacy. This policy explains what information we collect, how we use it,
            and what rights you have over your data.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-8">
          {sections.map(({ title, content }) => (
            <div key={title} className="flex flex-col gap-3">
              <h2 className="text-lg sm:text-xl font-semibold text-purple-700 dark:text-purple-400">
                {title}
              </h2>
              <ul className="flex flex-col gap-2">
                {content.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-purple-400 dark:bg-purple-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-purple-700 dark:text-purple-400">
            Contact
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            If you have any questions about this Privacy Policy, please reach out via our{" "}
            <Link
              to="/contact"
              className="text-purple-600 dark:text-purple-400 underline underline-offset-2 hover:text-purple-800 dark:hover:text-purple-300 transition"
            >
              Contact page
            </Link>
            .
          </p>
        </div>

      </div>
    </div>
  );
};

export default Privacy;
