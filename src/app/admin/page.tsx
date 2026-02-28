"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { isAdminUid } from "@/lib/security";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminSeasonsCategories from "@/components/admin/AdminSeasonsCategories";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminExcel from "@/components/admin/AdminExcel";
import AdminCompanySettings from "@/components/admin/AdminCompanySettings";
import AdminDangerZone from "@/components/admin/AdminDangerZone";

type Tab = "products" | "taxonomy" | "orders" | "excel" | "company" | "danger";

export default function AdminPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("products");

  const ok = useMemo(() => (uid ? isAdminUid(uid) : false), [uid]);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUid(u?.uid ?? null));
  }, []);

  if (!uid) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <p className="text-slate-700">يجب تسجيل الدخول أولاً.</p>
        <a className="text-brandBlue underline" href="/admin/login">اذهب لتسجيل الدخول</a>
      </div>
    );
  }

  if (!ok) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10 space-y-4">
        <p className="text-red-600 font-semibold">ليس لديك صلاحية الأدمن.</p>
        <button className="rounded-xl border px-4 py-2" onClick={() => signOut(auth)}>تسجيل خروج</button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <button className="rounded-xl border px-4 py-2" onClick={() => signOut(auth)}>
          تسجيل خروج
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <TabBtn active={tab==="products"} onClick={() => setTab("products")}>المنتجات</TabBtn>
        <TabBtn active={tab==="taxonomy"} onClick={() => setTab("taxonomy")}>المواسم/الأصناف</TabBtn>
        <TabBtn active={tab==="orders"} onClick={() => setTab("orders")}>الطلبات</TabBtn>
        <TabBtn active={tab==="excel"} onClick={() => setTab("excel")}>استيراد/تصدير Excel</TabBtn>
        <TabBtn active={tab==="company"} onClick={() => setTab("company")}>بيانات الشركة</TabBtn>
        <TabBtn active={tab==="danger"} onClick={() => setTab("danger")}>منطقة الخطر</TabBtn>
      </div>

      {tab === "products" ? <AdminProducts /> : null}
      {tab === "taxonomy" ? <AdminSeasonsCategories /> : null}
      {tab === "orders" ? <AdminOrders /> : null}
      {tab === "excel" ? <AdminExcel /> : null}
      {tab === "company" ? <AdminCompanySettings /> : null}
      {tab === "danger" ? <AdminDangerZone /> : null}
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-xl px-4 py-2 border text-sm font-semibold",
        active ? "bg-brandBlue text-white border-brandBlue" : "bg-white"
      ].join(" ")}
    >
      {children}
    </button>
  );
}
