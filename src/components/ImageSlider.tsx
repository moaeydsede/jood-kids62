"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageSlider({
  images,
  title,
  onOpen,
}: {
  images: string[];
  title: string;
  onOpen: (index: number) => void;
}) {
  const safe = useMemo(() => images.filter(Boolean), [images]);
  const [i, setI] = useState(0);

  function prev() {
    setI((x) => (x - 1 + safe.length) % safe.length);
  }
  function next() {
    setI((x) => (x + 1) % safe.length);
  }

  return (
    <div className="space-y-3">
      <div className="relative w-full aspect-square rounded-3xl border bg-slate-50 overflow-hidden">
        {safe[0] ? (
          <>
            <button className="absolute inset-0" onClick={() => onOpen(i)} aria-label="تكبير">
              <Image src={safe[i]} alt={title} fill className="object-contain" priority />
            </button>

            {safe.length > 1 ? (
              <>
                <button
                  className="absolute top-1/2 -translate-y-1/2 left-3 w-10 h-10 rounded-full bg-white/90 border shadow-sm flex items-center justify-center"
                  onClick={prev}
                  aria-label="السابق"
                >
                  <ChevronLeft />
                </button>
                <button
                  className="absolute top-1/2 -translate-y-1/2 right-3 w-10 h-10 rounded-full bg-white/90 border shadow-sm flex items-center justify-center"
                  onClick={next}
                  aria-label="التالي"
                >
                  <ChevronRight />
                </button>
              </>
            ) : null}

            {safe.length > 1 ? (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-white/80 border rounded-full px-3 py-1.5">
                {safe.map((_, idx) => (
                  <button
                    key={idx}
                    className={[
                      "w-2 h-2 rounded-full",
                      idx === i ? "bg-brandBlue" : "bg-slate-300",
                    ].join(" ")}
                    onClick={() => setI(idx)}
                    aria-label={`صورة ${idx + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">بدون صورة</div>
        )}
      </div>

      {safe.length > 1 ? (
        <div className="flex gap-2 overflow-auto pb-1">
          {safe.map((url, idx) => (
            <button
              key={url + idx}
              onClick={() => setI(idx)}
              className={[
                "relative w-20 h-20 rounded-2xl border bg-white overflow-hidden shrink-0",
                idx === i ? "ring-2 ring-brandBlue" : "",
              ].join(" ")}
              aria-label={`اختيار صورة ${idx + 1}`}
            >
              <Image src={url} alt="" fill className="object-contain" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
