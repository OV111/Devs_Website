import SearchIcon from "@mui/icons-material/Search";
export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search…",
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.((value || "").trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Site search"
      className="w-full max-w-[400px]"
    >
      <div className="relative flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-[4px] text-white/10 backdrop-blur">
        <SearchIcon className="text-white/75" sx={{ fontSize: 20 }} />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 text-sm appearance-none  bg-transparent text-sm text-white outline-none transition-all duration-300 placeholder:text-white/55 placeholder:opacity-100 focus:placeholder:opacity-0 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
        />

        {value?.length > 0 && (
          <button
            type="button"
            onClick={() => onChange?.("")}
            aria-label="Clear search"
            className="rounded-lg px-1.5 py-0.5 text-sm text-white/75 hover:bg-white/10"
          >
            ✕
          </button>
        )}
      </div>
    </form>
  );
}
