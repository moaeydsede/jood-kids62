"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@erp.local");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/admin");
    } catch (e: any) {
      setErr(e?.message ?? "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">تسجيل دخول الأدمن</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">البريد الإلكتروني</label>
          <input
            className="w-full rounded-xl border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">كلمة المرور</label>
          <input
            className="w-full rounded-xl border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
          />
        </div>

        {err ? <p className="text-sm text-red-600">{err}</p> : null}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-brandBlue text-white py-2 font-semibold disabled:opacity-60"
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
