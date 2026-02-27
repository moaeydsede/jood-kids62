"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/lib/types";
import Image from "next/image";
import Lightbox from "@/components/Lightbox";

export default function ProductDetails({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "products", productId));
      if (snap.exists()) setProduct({ id: snap.id, ...(snap.data() as any) } as Product);
    })();
  }, [productId]);

  const images = useMemo(() => product?.images ?? [], [product]);

  if (!product) {
    return <div className="mx-auto w-full max-w-4xl px-4 py-10">جاري التحميل...</div>;
  }

  const showDiscount = !!product.hasDiscount && !!product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="relative w-full aspect-square rounded-2xl border bg-slate-50 overflow-hidden">
            {images[0]?.url ? (
              <button className="absolute inset-0" onClick={() => { setIndex(0); setOpen(true); }}>
                <Image src={images[0].url} alt={product.title} fill className="object-contain" />
              </button>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">بدون صورة</div>
            )}
          </div>

          {images.length > 1 ? (
            <div className="flex gap-2 overflow-auto">
              {images.map((im, i) => (
                <button
                  key={im.publicId || im.url}
                  onClick={() => { setIndex(i); setOpen(true); }}
                  className="relative w-20 h-20 rounded-xl border bg-slate-50 overflow-hidden shrink-0"
                >
                  <Image src={im.url} alt="" fill className="object-contain" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <div className="text-sm text-slate-600">موديل: {product.modelNumber}</div>

          <div className="py-2">
            {showDiscount ? (
              <div className="flex items-baseline gap-3">
                <span className="text-xl font-extrabold text-brandBlue">{product.discountPrice} ج</span>
                <span className="text-sm text-slate-400 line-through">{product.price} ج</span>
              </div>
            ) : (
              <span className="text-xl font-extrabold text-brandBlue">{product.price} ج</span>
            )}
          </div>

          {product.description ? <p className="text-slate-700 leading-7">{product.description}</p> : null}

          <div className="rounded-2xl border p-4 bg-white">
            <div className="text-sm font-bold mb-2">طرق الدفع في السلة</div>
            <ul className="text-sm text-slate-700 list-disc pr-6 space-y-1">
              <li>الكاش</li>
              <li>بوليصة شحن</li>
              <li>إنستا باي</li>
              <li>محافظ إلكترونية (فودافون/اتصالات/أورنج)</li>
              <li>تحويلات بنكية</li>
              <li>نقدًا من خلال أحد فروعنا</li>
            </ul>
          </div>
        </div>
      </div>

      <Lightbox open={open} onClose={() => setOpen(false)} images={images.map(i => i.url)} index={index} onIndex={setIndex} />
    </div>
  );
}
