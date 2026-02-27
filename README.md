# JoodKids (Next.js + Firebase + Cloudinary)

## تشغيل المشروع
1) ثبّت المتطلبات:
- Node.js 18+

2) داخل مجلد المشروع:
```bash
npm install
npm run dev
```

## إعداد Firebase
المشروع جاهز على Config الذي زوّدتني به داخل:
- `src/lib/firebase.ts`

## الأدمن (Admin UID)
تم تثبيت الأدمن كـ UID واحد فقط:
- `RFXkA9U7PeW6NkVYfFonufwq2Eg1`

## Cloudinary (Unsigned)
الإعدادات موجودة في:
- `src/lib/cloudinary.ts`

> مهم: Unsigned يسمح بالرفع من المتصفح. الحذف الكامل لصور Cloudinary يحتاج Cloud Function (سيرفر) لأن API Secret لا يوضع داخل المتصفح.

## Firestore Rules
ملف rules جاهز:
- `firestore.rules`

## ملاحظات
- استبدل ملفات الأيقونات في `public/` بملفات PNG صحيحة (192 و 512) + ضع شعارك الحقيقي في `public/logo.jpg`
- صفحة سياسة الدفع والاسترجاع موجودة: `/policy`
- العروض/الخصومات موجودة كـ `hasDiscount` و `discountPrice`

