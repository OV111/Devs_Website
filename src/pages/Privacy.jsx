import { Link } from "react-router-dom";

const sections = [
  {
    title: "Information We Collect",
    content: [
      "Account information: first name, last name, username, email address, and password (stored encrypted) when you register.",
      "OAuth identity: if you sign in with Google or GitHub, we store your provider ID, email, and display name returned by that provider.",
      "Profile details you choose to provide: bio, location, profile image, banner image, and links to GitHub, LinkedIn, and Twitter/X.",
      "Content you create: blog posts, comments, likes, and saved articles.",
      "Social activity: followers and following relationships, and in-app notifications.",
      "Learning progress: the roadmap path you are on, your current layer, completed layers, and per-layer progress status.",
      "Exam performance: scores, number of correct answers, total questions, time taken, whether you passed, and the topics you missed for each exam attempt.",
      "Weak spots: topics automatically flagged from failed exam questions, along with the associated path and layer.",
      "Activity metadata: your last active timestamp, updated on each login.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "To create and manage your account and authenticate your identity.",
      "To display your profile and published content to other users.",
      "To track and display your learning progress through roadmap paths.",
      "To power the AI agent — exam results, weak spots, and progress data are used to personalise recommendations and guidance.",
      "To surface topics you should revisit based on missed exam questions.",
      "To send newsletter updates if you have subscribed.",
      "To enforce rate limits on login and sign-up attempts (IP address is used temporarily and is not stored in the database).",
      "To improve and maintain the platform.",
    ],
  },
  {
    title: "Third-Party Services",
    content: [
      "Google OAuth — used for sign-in. We receive your name, email, and Google ID from Google.",
      "GitHub OAuth — used for sign-in and profile linking. We receive your GitHub username, ID, and primary email.",
      "Cloudinary — used to store and serve profile images and banner images you upload.",
      "MongoDB Atlas — our database provider where all user data is stored.",
      "Resend — used to send password reset and notification emails.",
    ],
  },
  {
    title: "What We Do Not Do",
    content: [
      "We do not sell your personal data to third parties.",
      "We do not share your information with advertisers.",
      "We do not use your content or learning data for purposes beyond operating and improving the platform.",
      "We do not store third-party OAuth access tokens beyond what is needed to complete authentication.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "View and update your profile information at any time from your profile settings.",
      "Delete your account and all associated data via the Delete Account option in settings.",
      "Unsubscribe from newsletter emails at any time using the unsubscribe link in any email.",
      "Request a copy of your data or ask questions about what we hold by contacting us.",
    ],
  },
  {
    title: "Data Retention",
    content: [
      "Your data is retained for as long as your account is active.",
      "Password reset tokens expire after 1 hour and are deleted after use.",
      "If you delete your account, all associated data including posts, progress, exam history, and weak spots is permanently removed.",
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
            Effective date: June 2026
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
