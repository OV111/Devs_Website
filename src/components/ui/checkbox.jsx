import React from "react";

const getInputClasses = (checked, disabled, indeterminate) => {
  let className =
    "relative border w-4 h-4 duration-200 rounded inline-flex items-center justify-center";

  if (disabled) {
    if (!checked || indeterminate) {
      className += " bg-[#1a1a1a] border-[#333]";
      className += indeterminate ? " stroke-[#555]" : "";
    } else {
      className += " bg-purple-800 border-purple-800 fill-purple-800 stroke-white opacity-50";
    }
  } else {
    if (!checked || indeterminate) {
      className += " bg-transparent border-[#333] group-hover:border-purple-600/60 group-hover:bg-purple-600/10";
      className += indeterminate
        ? " stroke-purple-500"
        : " fill-transparent stroke-transparent";
    } else {
      className += " bg-purple-600 border-purple-600 fill-purple-600 stroke-white";
    }
  }

  return className;
};

export function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  indeterminate = false,
  children,
}) {
  return (
    <div
      className={`flex items-center  cursor-pointer text-[13px] font-sans group ${
        disabled ? "text-[#555]" : "text-[#e5e5e5]"
      }`}
      onClick={() => onChange && !indeterminate && onChange(!checked)}
    >
      <input
        disabled={disabled}
        type="checkbox"
        checked={checked}
        onChange={() => {}}
        className="sr-only"
      />
      <span className={getInputClasses(checked, disabled, indeterminate)}>
        <svg className="shrink-0" height="16" viewBox="0 0 20 20" width="16">
          {indeterminate ? (
            <line
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="5"
              x2="15"
              y1="10"
              y2="10"
            />
          ) : (
            <path
              d="M14 7L8.5 12.5L6 10"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          )}
        </svg>
      </span>
      {children && <span className="ml-2">{children}</span>}
    </div>
  );
}
