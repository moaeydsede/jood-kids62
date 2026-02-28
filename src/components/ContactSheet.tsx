"use client";

import { useEffect, useState } from "react";
import { X, Instagram, Facebook, Send, MessageCircle } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CompanyInfo } from "@/lib/types";

function IconBtn({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" className="flex items-center gap-2 rounded-xl border px-4 py-3 hover:bg-slate-50">
      {children}
      <span className="font-semibold">{label}</span>
    </a>
  );
}

export default function ContactSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [info, setInfo] = useState<CompanyInfo>({});

  useEffect(() => {
    if (!open) return;
    (async () => {
      const snap = await getDoc(doc(db, "settings", "company"));
      if (snap.exists()) setInfo(snap.data() as CompanyInfo);
    })();
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [open]);

  if (!open) return null;

  const wa = info.whatsappNumber ? info.whatsappNumber.replace(/[^0-9]/g, "") : "";
  const waLink = wa ? `https://wa.me/${wa}` : "https://wa.me/";

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">تواصل معنا</h2>
          <button className="p-2 rounded-xl hover:bg-slate-100" onClick={onClose} aria-label="إغلاق">
            <X />
          </button>
        </div>

        <div className="mt-4 grid gap-2">
          {info.instagramUrl ? (
            <IconBtn href={info.instagramUrl} label="Instagram">
              <Instagram />
            </IconBtn>
          ) : null}

          {info.facebookUrl ? (
            <IconBtn href={info.facebookUrl} label="Facebook">
              <Facebook />
            </IconBtn>
          ) : null}

          {info.telegramUrl ? (
            <IconBtn href={info.telegramUrl} label="Telegram">
              <Send />
            </IconBtn>
          ) : null}

          <IconBtn href={waLink} label="WhatsApp">
            <MessageCircle />
          </IconBtn>

          {info.factoryLocationUrl ? (
            <a className="text-sm underline" href={info.factoryLocationUrl} target="_blank">موقع المصنع على الخريطة</a>
          ) : null}
          {info.shopLocationUrl ? (
            <a className="text-sm underline" href={info.shopLocationUrl} target="_blank">موقع المحل على الخريطة</a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
