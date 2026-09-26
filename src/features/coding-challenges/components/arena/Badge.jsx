export default function Badge({ children, color, bg, border }) {
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-widest"
      style={{ color, background: bg, border: `1px solid ${border}` }}
    >
      {children}
    </span>
  );
}
