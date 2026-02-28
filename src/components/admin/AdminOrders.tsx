"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Order } from "@/lib/types";
import * as XLSX from "xlsx";

const STATUSES: { key: Order["status"]; label: string }[] = [
  { key: "new", label: "جديد" },
  { key: "processing", label: "قيد التجهيز" },
  { key: "done", label: "تم" },
  { key: "canceled", label: "ملغي" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string>("");

  async function load() {
    setLoading(true);
    const snap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));
    const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Order[];
    setOrders(list);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const visible = useMemo(() => {
                        const base = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);
const s = searchTerm.trim().toLowerCase();
if (!s) return base;
return base.filter((o) => {
  const orderNo = String((o as any).orderNo || o.id).toLowerCase();
  const name = String(o.customerName || "").toLowerCase();
  const phone = String(o.customerPhone || "").toLowerCase();
  return orderNo.includes(s) || name.includes(s) || phone.includes(s);
});

  }, [orders, statusFilter]);

  async function copyWhatsAppMessage(o: Order) {
    const lines = (o.items || []).map((it, idx) => {
      return `${idx + 1}) ${it.title} | موديل: ${it.modelNumber} | كمية: ${it.qty} | سعر: ${it.price}`;
    });

    const msg =
      `طلبية ✅\n` +
      `رقم الطلب: ${(o as any).orderNo || o.id}\n\n` +
      `العميل: ${o.customerName}\n` +
      `موبايل: ${o.customerPhone}\n` +
      `المدينة: ${o.city}\n` +
      `العنوان: ${o.address}\n` +
      (o.shippingCompany ? `شركة الشحن: ${o.shippingCompany}\n` : "") +
      `طريقة الدفع: ${o.paymentMethod}\n\n` +
      `المنتجات:\n${lines.join("\n")}\n\n` +
      `الإجمالي: ${o.total}\n` +
      (o.notes ? `ملاحظات: ${o.notes}\n` : "");

    try {
      await navigator.clipboard.writeText(msg);
      setCopiedId(o.id);
      setTimeout(() => setCopiedId(""), 1500);
    } catch {
      alert(msg);
    }
  }

  function openCustomerWhatsApp(o: Order) {
    const phone = String(o.customerPhone || "").replace(/\D/g, "");
    if (!phone) return alert("لا يوجد رقم هاتف للعميل.");
    const url = `https://wa.me/${phone}`;
    window.open(url, "_blank");
  }

function exportExcel() {
    const rows = visible.map((o) => ({
      orderNo: (o as any).orderNo || o.id,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      city: o.city,
      address: o.address,
      shippingCompany: o.shippingCompany,
      paymentMethod: o.paymentMethod,
      total: o.total,
      status: o.status,
      createdAt: (o as any).createdAt?.toDate ? (o as any).createdAt.toDate().toISOString() : "",
      items: (o.items || [])
        .map((it) => `${it.title} (موديل ${it.modelNumber}) x${it.qty} = ${it.price * it.qty}`)
        .join(" | "),
      notes: o.notes || "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, `joodkids-orders.xlsx`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-xl font-bold">الطلبات</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            className="rounded-xl border px-3 py-2 text-sm w-full md:w-64"
            placeholder="بحث: الاسم / الهاتف / رقم الطلب"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="rounded-xl border px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">كل الحالات</option>
            {STATUSES.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>

          <button className="rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-slate-50" onClick={load}>
            تحديث
          </button>

          <button className="rounded-xl bg-brandBlue text-white px-4 py-2 text-sm font-extrabold" onClick={exportExcel}>
            تصدير Excel
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-4">جاري تحميل الطلبات...</div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border bg-white p-4">لا توجد طلبات.</div>
      ) : (
        <div className="grid gap-3">
          {visible.map((o) => (
            <div key={o.id} className="rounded-2xl border bg-white p-4 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="font-extrabold">
                  رقم الطلب: <span className="text-brandBlue">{(o as any).orderNo || o.id}</span>
                </div>
                <select
                  className="rounded-xl border px-3 py-2 text-sm font-semibold"
                  value={o.status}
                  onChange={async (e) => {
                    const nv = e.target.value as Order["status"];
                    await updateDoc(doc(db, "orders", o.id), { status: nv } as any);
                    await load();
                  }}
                >
                  {STATUSES.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                  onClick={() => openCustomerWhatsApp(o)}
                >
                  واتساب العميل
                </button>

                <button
                  type="button"
                  className="rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                  onClick={() => copyWhatsAppMessage(o)}
                >
                  {copiedId === o.id ? "تم النسخ ✅" : "نسخ رسالة واتساب"}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-2 text-sm">

                <div><span className="font-bold">العميل:</span> {o.customerName}</div>
                <div><span className="font-bold">موبايل:</span> {o.customerPhone}</div>
                <div><span className="font-bold">المدينة:</span> {o.city}</div>
                <div><span className="font-bold">الدفع:</span> {o.paymentMethod}</div>
                <div className="md:col-span-2"><span className="font-bold">العنوان:</span> {o.address}</div>
                {o.shippingCompany ? (
                  <div className="md:col-span-2"><span className="font-bold">شركة الشحن:</span> {o.shippingCompany}</div>
                ) : null}
              </div>

              <div className="pt-2 border-t space-y-1">
                <div className="font-bold text-sm">المنتجات</div>
                <div className="space-y-1">
                  {(o.items || []).map((it, idx) => (
                    <div key={idx} className="text-sm text-slate-700">
                      {idx + 1}) {it.title} • موديل {it.modelNumber} • كمية {it.qty} • {it.price * it.qty}
                    </div>
                  ))}
                </div>
                <div className="font-extrabold text-sm pt-1">الإجمالي: {o.total}</div>
                {o.notes ? <div className="text-xs text-slate-600">ملاحظات: {o.notes}</div> : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
