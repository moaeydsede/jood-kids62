import Image from "next/image";

export default function Hero() {
  return (
    <div className="rounded-3xl border bg-white overflow-hidden shadow-sm">
      <div className="p-5 md:p-7 flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold">
            JoodKids <span className="text-brandPeach">جملة</span> ملابس أطفال
          </h1>
          <p className="text-slate-600 leading-7 max-w-xl">
            مواسم + أصناف + موديلات مرتبة. عروض واضحة. تواصل سريع عبر واتساب.
          </p>
          <div className="flex gap-2 flex-wrap">
            <span className="rounded-full bg-brandBlue/10 text-brandBlue px-3 py-1 text-sm font-bold">صور واضحة</span>
            <span className="rounded-full bg-brandPeach/10 text-brandPeach px-3 py-1 text-sm font-bold">عروض</span>
            <span className="rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-sm font-bold">جملة</span>
          </div>
        </div>

        <div className="relative w-40 h-14">
          <Image src="/logo.jpg" alt="JoodKids" fill className="object-contain" />
        </div>
      </div>
    </div>
  );
}
