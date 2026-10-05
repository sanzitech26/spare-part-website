"use client";
import { useState } from "react";
import { Icon } from "./ui";

// Password input with a show/hide eye button.
export default function PasswordField({ name, placeholder, autoComplete, className, minLength }: { name: string; placeholder?: string; autoComplete?: string; className: string; minLength?: number }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input name={name} type={show ? "text" : "password"} required minLength={minLength} placeholder={placeholder} autoComplete={autoComplete} className={`${className} pr-10`} />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400 hover:text-slate-600">
        <Icon name={show ? "eyeOff" : "eye"} className="h-4 w-4" />
      </button>
    </div>
  );
}
