"use client";

import { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCompanySettings } from "@/lib/settings";
import { readCart, writeCart } from "@/lib/cart";
import type { CartItem } from "@/lib/types";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [shippingCompany, setShippingCompany] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("كاش");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const cart = readCart();
    setItems(cart);
    setLoading(false);
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  async function handleSubmit() {
    if (!customerName || !customerPhone || !city || !address) {
      alert("يرجى ملء جميع البيانات المطلوبة");
      return;
    }

    if (items.length === 0) {
      alert("السلة فارغة");
      return;
    }

    try {
      const orderRef = await addDoc(collection(db, "orders"), {
        customerName,
        customerPhone,
        city,
        address,
        shippingCompany,
        paymentMethod,
        notes,
        items,
        total,
        status: "new",
        createdAt: serverTimestamp(),
      });

      const company = await getCompanySettings();
      const phone = company?.whatsappNumber || "";

      const message =
        `طلب جديد ✅\n\n` +
        `رقم الطلب: ${orderRef.id}\n\n` +
        `العميل: ${customerName}\n` +
        `الموبايل: ${customerPhone}\n` +
        `المدينة: ${city}\n` +
        `العنوان: ${address}\n` +
        (shippingCompany ? `شركة الشحن: ${shippingCompany}\n` : "") +
        `طريقة الدفع: ${paymentMethod}\n\n` +
        `المنتجات:\n` +
        items
          .map(
            (i, idx) =>
              `${idx + 1}) ${i.title} | موديل ${i.modelNumber} | كمية ${i.qty} | ${i.price * i.qty}`
          )
          .join("\n") +
        `\n\nالإجمالي: ${total}`;

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(
        message
      )}`;

      writeCart([]); // تفريغ السلة
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ الطلب");
    }
  }

  if (loading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">إتمام الطلب</h1>

      <div className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="الاسم"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="رقم الهاتف"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="المدينة"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="العنوان"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="شركة الشحن (اختياري)"
          value={shippingCompany}
          onChange={(e) => setShippingCompany(e.target.value)}
        />

        <select
          className="w-full border p-2 rounded"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option>كاش</option>
          <option>بوليصة شحن</option>
          <option>إنستا باي</option>
          <option>تحويل بنكي</option>
          <option>محفظة إلكترونية</option>
        </select>

        <textarea
          className="w-full border p-2 rounded"
          placeholder="ملاحظات"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="border-t pt-4">
        <h2 className="font-bold mb-2">المنتجات</h2>
        {items.map((i, idx) => (
          <div key={idx} className="flex justify-between">
            <span>
              {i.title} × {i.qty}
            </span>
            <span>{i.price * i.qty}</span>
          </div>
        ))}

        <div className="font-bold mt-3">الإجمالي: {total}</div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white p-3 rounded font-bold"
      >
        إرسال الطلب على واتساب
      </button>
    </div>
  );
}
