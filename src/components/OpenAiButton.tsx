"use client";

/** Opens the floating chat widget, on the AI tab by default or on the mentor tab. */
export default function OpenAiButton({ children, className = "btn btn-secondary", prompt, tab = "ai" }: { children: React.ReactNode; className?: string; prompt?: string; tab?: "ai" | "human" }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new CustomEvent("cr:open-chat", { detail: { tab, prompt } }))}>
      {children}
    </button>
  );
}
