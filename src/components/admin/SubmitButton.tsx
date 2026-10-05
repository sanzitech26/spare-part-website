"use client";
import { useFormStatus } from "react-dom";
import { btn } from "./ui";

// Submit button that shows a spinner while its form's server action runs.
export default function SubmitButton({ children = "Save", className = btn, pendingText = "Saving…" }: { children?: React.ReactNode; className?: string; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className={className}>
      {pending && <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" /><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>}
      {pending ? pendingText : children}
    </button>
  );
}
