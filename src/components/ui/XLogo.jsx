// The X (formerly Twitter) mark. lucide-react only ships the old bird, which
// is no longer the brand — so it's drawn here once and reused everywhere.
// `size` + currentColor make it a drop-in for lucide icons.
const XLogo = ({ size = 16, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default XLogo;
