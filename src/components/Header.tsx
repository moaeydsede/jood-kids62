"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, PhoneCall, ShoppingBag, Download } from "lucide-react";
import { cartCount, readCart } from "@/lib/cart";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};
import SideMenu from "@/components/SideMenu";
import ContactSheet from "@/components/ContactSheet";

export default function Header() {
  const router = useRouter();
  const clicks = useRef<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [installEvt, setInstallEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [cartN, setCartN] = useState(0);

  function onLogoClick() {
    const now = Date.now();
    clicks.current = clicks.current.filter((t) => now - t < 2000);
    clicks.current.push(now);
    if (clicks.current.length >= 5) {
      clicks.current = [];
      router.push("/admin");
    }
  }

  useEffect(() => {
    const onBIP = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  useEffect(() => {
    const sync = () => setCartN(cartCount(readCart()));
    sync();
    window.addEventListener("cartChanged", sync);
    return () => window.removeEventListener("cartChanged", sync);
  }, []);

  useEffect(() => {
    const onKey
 = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setContactOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
      <div className="mx-auto w-full max-w-6xl px-4 h-16 flex items-center justify-between gap-3">
        <button
          className="p-2 rounded-xl hover:bg-slate-100"
          onClick={() => setMenuOpen(true)}
          aria-label="القائمة"
        >
          <Menu />
        </button>

        <button
          className="flex items-center gap-2"
          onClick={onLogoClick}
          aria-label="JoodKids"
          title="اضغط 5 مرات لفتح لوحة التحكم"
        >
          <div className="relative w-28 h-10">
            <Image src="/logo.jpg" alt="JoodKids" fill className="object-contain" />
          </div>
        </button>

        <div className="flex items-center gap-2">
          <a href="/offers" className="p-2 rounded-xl border hover:bg-slate-50 text-sm font-semibold">العروض</a>{installEvt ? (
  <button
    className="p-2 rounded-xl border hover:bg-slate-50"
    aria-label="تثبيت التطبيق"
    onClick={async () => {
      try {
        await installEvt.prompt();
        await installEvt.userChoice;
        setInstallEvt(null);
      } catch {}
    }}
    title="تثبيت التطبيق"
  >
    <Download />
  </button>
) : null}

          <button
            className="px-3 py-2 rounded-xl bg-brandBlue text-white font-semibold flex items-center gap-2"
            onClick={() => setContactOpen(true)}
          >
            <PhoneCall size={18} />
            تواصل معنا
          </button>
          <a className="relative p-2 rounded-xl border hover:bg-slate-50" href="/cart" aria-label="السلة">
            <ShoppingBag />
            {cartN > 0 ? (
              <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-brandPeach text-white text-xs font-extrabold flex items-center justify-center">
                {cartN}
              </span>
            ) : null}
          </a>
        </div>
      </div>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <ContactSheet open={contactOpen} onClose={() => setContactOpen(false)} />
    </header>
  );
}
