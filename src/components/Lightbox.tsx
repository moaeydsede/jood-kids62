"use client";

import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function Lightbox({
  open,
  onClose,
  images,
  index,
  onIndex,
}: {
  open: boolean;
  onClose: () => void;
  images: string[];
  index: number;
  onIndex: (n: number) => void;
}) {
  const [zoom, setZoom] = useState(1);

  const current = useMemo(() => images[index], [images, index]);

  useEffect(() => {
    if (!open) return;
    setZoom(1);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex(Math.min(index + 1, images.length - 1));
      if (e.key === "ArrowLeft") onIndex(Math.max(index - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onIndex, index, images.length]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl h-[80vh] bg-black rounded-2xl overflow-hidden">
          <button className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-white/10 text-white" onClick={onClose}>
            <X />
          </button>

          {images.length > 1 ? (
            <>
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-xl bg-white/10 text-white"
                onClick={() => onIndex(Math.max(index - 1, 0))}
              >
                <ChevronLeft />
              </button>
              <button
                className="absolute right-14 top-1/2 -translate-y-1/2 z-10 p-2 rounded-xl bg-white/10 text-white"
                onClick={() => onIndex(Math.min(index + 1, images.length - 1))}
              >
                <ChevronRight />
              </button>
            </>
          ) : null}

          <div className="absolute bottom-3 left-3 z-10 flex gap-2">
            <button className="px-3 py-2 rounded-xl bg-white/10 text-white text-sm font-semibold" onClick={() => setZoom(z => Math.min(z + 0.25, 3))}>
              +
            </button>
            <button className="px-3 py-2 rounded-xl bg-white/10 text-white text-sm font-semibold" onClick={() => setZoom(z => Math.max(z - 0.25, 1))}>
              -
            </button>
            <button className="px-3 py-2 rounded-xl bg-white/10 text-white text-sm font-semibold" onClick={() => setZoom(1)}>
              1x
            </button>
          </div>

          {current ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full" style={{ transform: `scale(${zoom})` }}>
                <Image src={current} alt="" fill className="object-contain" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
