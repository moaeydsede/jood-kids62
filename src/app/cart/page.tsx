export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 space-y-4">
      <h1 className="text-2xl font-bold">السلة</h1>
      <div className="rounded-2xl border p-4 bg-white">
        <h2 className="font-bold mb-2">طرق الدفع</h2>
        <ul className="list-disc pr-6 space-y-1 text-slate-700">
          <li>الكاش</li>
          <li>بوليصة شحن</li>
          <li>نقدًا من خلال أحد فروعنا</li>
          <li>تحويلات بنكية</li>
          <li>انستا باي</li>
          <li>محافظ إلكترونية (فودافون كاش / اتصالات كاش / أورنج كاش)</li>
          <li>لا يوجد بيع بالآجل</li>
        </ul>
      </div>
    </div>
  );
}
