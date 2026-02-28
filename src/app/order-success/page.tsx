"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function OrderSuccessPage() {
  const [orderId, setOrderId] = useState<string>("");
  const [orderNo, setOrderNo] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const waUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("lastWaUrl") || "";
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("orderId") || "";
    setOrderId(id);

    (async () => {
      try {
        if (!id) return;
        const snap = await getDoc(doc(db, "orders", id));
        if (snap.exists()) {
          const data: any = snap.data();
          setOrderNo(data.orderNo || "");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 space-y-6">
      <div className="rounded-3xl border bg-white p-6 space-y-3">
        <div className="text-2xl font-extrabold">تم تسجيل الطلب ✅</div>
        {loading ? (
          <div className="text-slate-600">جاري تحميل بيانات الطلب...</div>
        ) : (
          <>
            {orderNo ? (
              <div className="text-lg font-bold">
                رقم الطلب: <span className="text-brandBlue">{orderNo}</span>
              </div>
            ) : orderId ? (
              <div className="text-sm text-slate-600">رقم الطلب الداخلي: {orderId}</div>
            ) : null}

            <div className="text-slate-700 leading-7">
              تم حفظ طلبك لدينا وسيتم التواصل معك لتأكيد الطلب وتجهيز الشحن.
            </div>
          </>
        )}
      </div>

      <div className="rounded-3xl border bg-white p-6 space-y-3">
        <div className="font-bold">ماذا تريد الآن؟</div>
        <div className="grid gap-3">
          <a
            href="/"
            className="w-full text-center rounded-2xl border px-4 py-3 font-bold hover:bg-slate-50"
          >
            العودة للمتجر
          </a>

          {waUrl ? (
            <a
              href={waUrl}
              className="w-full text-center rounded-2xl bg-emerald-600 text-white px-4 py-3 font-extrabold"
            >
              فتح واتساب مرة أخرى
            </a>
          ) : null}
        </div>

        <div className="text-xs text-slate-500 leading-6">
          إذا لم يفتح واتساب تلقائيًا، اضغط “فتح واتساب مرة أخرى”.
        </div>
      </div>
    </div>
  );
}
