export default function PolicyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">سياسة الدفع والاسترجاع والاستبدال</h1>

      <section className="space-y-3 leading-8 text-slate-800">
        <h2 className="text-xl font-semibold">سياسة الاستبدال والاسترجاع</h2>
        <ul className="list-disc pr-6 space-y-2">
          <li>يمكنك عمل طلب استرجاع أو استبدال للمنتجات خلال <b>7 أيام</b> من تاريخ استلام الطلب.</li>
          <li>وفي حالات <b>عيوب الصناعة</b> يمكن التقديم خلال <b>10 أيام</b> من وقت وصول الطلب.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">شروط قبول الإرجاع</h2>
        <ul className="list-disc pr-6 space-y-2">
          <li>عند إرجاع المنتج، تأكد من وجود جميع الملحقات الخاصة بالطلب بحالتها السليمة.</li>
          <li>أن يكون المنتج في <b>عبوته الأصلية</b> و<b>بتغليفه الأصلي</b>.</li>
          <li>والملابس بحالتها كما وصلت للعميل: <b>غير مستعملة أو ملبوسة أو مغسولة</b>.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">الاستبدال والاسترجاع</h2>
        <ul className="list-disc pr-6 space-y-2">
          <li>الاستبدال والاسترجاع على <b>الملابس الخارجية فقط</b>.</li>
          <li>المنتجات التي عليها <b>خصم/عروض</b> لا يشملها الاستبدال أو الاسترجاع.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">طرق الدفع</h2>
        <ol className="list-decimal pr-6 space-y-2">
          <li>نقدًا من خلال أحد فروعنا</li>
          <li>تحويلات بنكية</li>
          <li>إنستا باي (InstaPay)</li>
          <li>محافظ إلكترونية (فودافون كاش / اتصالات كاش / أورنج كاش)</li>
          <li>نعتذر من عملائنا الكرام، لا يوجد بيع بالآجل لأي سبب كان</li>
        </ol>

        <div className="rounded-2xl border p-4 bg-slate-50 mt-6">
          <b>تنويه مهم للشحن عند الإرجاع:</b>
          <p className="mt-2">
            عند رجوع البضاعة بدون تبليغنا قبل الاسترجاع بـ <b>3 أيام</b> على الأقل، سيتم خصم قيمة الشحن
            <b> ذهابًا وإيابًا</b> من العربون المدفوع لدينا.
          </p>
        </div>
      </section>
    </div>
  );
}
