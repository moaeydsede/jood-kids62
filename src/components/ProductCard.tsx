import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0]?.url;

  const showDiscount = !!product.hasDiscount && !!product.discountPrice && product.discountPrice < product.price;

  return (
    <Link href={`/product/${product.id}`} className="block rounded-2xl border bg-white overflow-hidden hover:shadow-sm">
      <div className="relative w-full aspect-square bg-slate-50">
        {img ? (
          <Image src={img} alt={product.title} fill className="object-contain" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">بدون صورة</div>
        )}
        {showDiscount ? (
          <div className="absolute top-2 left-2 bg-brandPeach text-white text-xs font-bold px-2 py-1 rounded-lg">
            عرض
          </div>
        ) : null}
      </div>

      <div className="p-3 space-y-1">
        <div className="text-sm font-bold line-clamp-2">{product.title}</div>
        <div className="text-xs text-slate-600">موديل: {product.modelNumber}</div>

        <div className="mt-1">
          {showDiscount ? (
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-brandBlue">{product.discountPrice} ج</span>
              <span className="text-xs text-slate-400 line-through">{product.price} ج</span>
            </div>
          ) : (
            <span className="text-sm font-bold text-brandBlue">{product.price} ج</span>
          )}
        </div>
      </div>
    </Link>
  );
}
