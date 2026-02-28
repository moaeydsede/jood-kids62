"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product, CompanyInfo } from "@/lib/types";
import Lightbox from "@/components/Lightbox";
import ImageSlider from "@/components/ImageSlider";
import { addToCart } from "@/lib/cart";
import { waLink } from "@/lib/whatsapp";
import { MessageCircle, ShoppingCart } from "lucide-react";

export default function ProductDetails({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [info, setInfo] = useState<CompanyInfo>({});
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "products", productId));
      if (snap.exists()) setProduct({ id: snap.id, ...(snap.data() as any) } as Product);

      const s = await getDoc(doc(db, "settings", "company"));
      if (s.exists()) setInfo(s.data() as CompanyInfo);
    })();
  }, [productId]);

  const images = useMemo(() => (product?.images ?? []).map((i) => i.url).filter(Boolean), [product]);

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <div className="animate-pulse grid md:grid-cols-2 gap-6">
          <div className="aspect-square rounded-3xl bg-slate-100" />
          <div className="space-y-3">
            <div className="h-7 w-2/3 bg-slate-100 rounded-xl" />
            <div className="h-4 w-1/3 bg-slate-100 rounded-xl" />
            <div className="h-10 w-1/2 bg-slate-100 rounded-xl" />
            <div className="h-24 w-full bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const showDiscount =
    !!product.hasDiscount &&
    typeof product.discountPrice === "number" &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const pageLink =
    typeof window !== "undefined" ? window.location.href : `https://example.com/product/${product.id}`;

  const msg = [
    "السلام عليكم، أريد طلب هذا الموديل:",
    `• الاسم: ${product.title}`,
    `• رقم الموديل: ${product.modelNumber}`,
    `• السعر: ${showDiscount ? product.discountPrice : product.price} ج`,
    `• الرابط: ${pageLink}`,
  ].join("\n");

  const wa = waLink(info.whatsappNumber || "", msg);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <ImageSlider
          images={images}
          title={product.title}
          onOpen={(i) => {
            setIndex(i);
            setOpen(true);
          }}
        />

        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold">{product.title}</h1>
            <div className="text-sm text-slate-600">موديل: <span className="font-bold">{product.modelNumber}</span></div>
          </div>

          <div className="rounded-2xl border bg-white p-4">
            {showDiscount ? (
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-brandBlue">{product.discountPrice} ج</span>
                <span className="text-sm text-slate-400 line-through">{product.price} ج</span>
                <span className="mr-auto rounded-full bg-brandPeach/10 text-brandPeach px-3 py-1 text-xs font-bold">عرض</span>
              </div>
            ) : (
              <span className="text-2xl font-extrabold text-brandBlue">{product.price} ج</span>
            )}

            <div className="mt-4 grid gap-2">
              <button
                className="w-full rounded-2xl bg-emerald-600 text-white px-4 py-3 font-extrabold flex items-center justify-center gap-2 hover:opacity-95"
                onClick={() => window.open(wa, "_blank")}
              >
                <MessageCircle />
                طلب على واتساب
              </button>

              <button
                className="w-full rounded-2xl border px-4 py-3 font-bold flex items-center justify-center gap-2 hover:bg-slate-50"
                onClick={() => {
                  addToCart(product, 1);
                  alert("تمت الإضافة إلى السلة ✅");
                }}
              >
                <ShoppingCart />
                إضافة للسلة
              </button>
            </div>
          </div>

          {product.description ? (
            <div className="rounded-2xl border bg-white p-4">
              <div className="font-bold mb-1">الوصف</div>
              <p className="text-slate-700 leading-7">{product.description}</p>
            </div>
          ) : null}

          <div className="rounded-2xl border p-4 bg-white">
            <div className="text-sm font-bold mb-2">طرق الدفع</div>
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

      <Lightbox open={open} onClose={() => setOpen(false)} images={images} index={index} onIndex={setIndex} />
    </div>
  );
}
