// Page-wide hairline, inset from the screen edges. Shared by the Home hero
// and the Footer so both lines always have exactly the same width.
const Divider = ({ className = "" }) => (
  <hr className={`mx-6 border-white/10 sm:mx-10 lg:mx-16 ${className}`} />
);

export default Divider;
