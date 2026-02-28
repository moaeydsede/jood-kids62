"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function doShare() {
    const url = window.location.href;
    try {
      // Web Share API
      // @ts-ignore
      if (navigator.share) {
        // @ts-ignore
        await navigator.share({ title, url });
        return;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback prompt
      prompt("انسخ الرابط:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={doShare}
      className="px-3 py-2 rounded-xl border font-semibold flex items-center gap-2 hover:bg-slate-50"
      title="مشاركة المنتج"
    >
      {copied ? <Check /> : <Share2 />}
      <span className="text-sm">{copied ? "تم النسخ" : "مشاركة"}</span>
    </button>
  );
}
