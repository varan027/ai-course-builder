"use client";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import type { Opt } from "@/constants/formOptions";

interface Props<T> {
  options: Opt<T>[];
  value?: T;
  onChange: (v: T) => void;
  placeholder?: string;
  align?: "right" | "left";
  defaultOpen?: boolean;
  className?: string;
  label: string;
}

function Dropdown<T> ({
  options,
  value,
  onChange,
  placeholder = "select",
  align = "right",
  defaultOpen = false,
  className = "",
  label
}: Props<T>) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") return setOpen(false);
      if (e.key === "ArrowDown") return setHighlighted((h) => h + 1);
      if (e.key === "ArrowUp") return setHighlighted((h) => Math.max(h - 1, 0));
      if (e.key === "Enter" && highlighted >= 0) {
        onChange(options[highlighted].value);
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, highlighted, options, onChange]);

  useEffect(() => {
    if (open) setHighlighted(options.findIndex((o) => o.value === value) || 0);
    else setHighlighted(-1);
  }, [open, options, value]);

  useEffect(() => {
    if (highlighted < 0 || !ref.current) return;
    const ul = ref.current.querySelector("ul");
    const el = ul?.children[highlighted] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlighted]);

  const selected = options.find((o) => o.value === value);

  return (
    <div className={`flex-1/2 bg-uibgclr rounded-lg ${className}`}>
      <div ref={ref} className="relative text-sm">
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          aria-haspopup="listbox"
          aria-expanded={open}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setHighlighted(0);
            }
          }}
          className={`gap-2 cursor-pointer w-full flex items-center justify-between hover:brightness-105 transition px-3 py-2 text-[#E6EEF3]`}
        >
          <div className="text-start">
            <label className="block text-xs text-gray-400 mb-2">
            {label}
            </label>
            <span className="font-medium">
              {selected ? selected.label : placeholder}
            </span>
          </div>
          <span className="text-xs opacity-80"><IoIosArrowForward/></span>
        </button>
{/* absolute z-50 w-full mt-1 glass backdrop-blur-xl rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto scrollbar-thin */}
        {open && (
          <ul
            role="listbox"
            aria-label="Options"
            className={`absolute mt-2 w-44 glass backdrop-blur-3xl rounded-xl p-2 shadow-[0_10px_30px_rgba(2,6,23,0.6)] border border-borderclr max-h-56 overflow-auto z-10 ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            {options.map((opt, i) => {
              const sel = opt.value === value;
              const highlight = i === highlighted;
              return (
                <li
                  key={String(opt.value)}
                  role="option"
                  aria-selected={sel}
                  onMouseEnter={() => setHighlighted(i)}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer select-none ${
                    highlight
                      ? "bg-white/6 text-[#E6EEF3]"
                      : "text-[#9AA3AD] hover:bg-white/3 hover:text-[#E6EEF3]"
                  } ${sel ? "font-semibold" : ""}`}
                >
                  <div className="flex flex-col">
                    <span>{opt.label}</span>
                    {opt.meta && (
                      <span className="text-[11px] text-[#7F8890]">
                        {opt.meta}
                      </span>
                    )}
                  </div>

                  {sel && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-[#06D6A0]"
                    >
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
