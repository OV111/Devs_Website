import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function FilterCheckbox({ label, count, active, onClick }) {
  return (
    <li className="flex items-center justify-between py-0.5">
      <Checkbox checked={!!active} onChange={onClick}>
        {label}
      </Checkbox>
      {count !== undefined && (
        <span className="text-[#444] text-[12px]">{count}</span>
      )}
    </li>
  );
}
