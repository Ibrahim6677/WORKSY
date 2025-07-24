# إعداد Google Calendar - خطوات سريعة

## المشكلة الحالية
```
Missing required parameter: client_id
Error 400: invalid_request
```

## الحل

### 1. احصل على Google OAuth Credentials

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعّل Google Calendar API:
   - APIs & Services > Library
   - ابحث عن "Google Calendar API" 
   - اضغط Enable

4. أنشئ OAuth 2.0 Credentials:
   - APIs & Services > Credentials
   - Create Credentials > OAuth 2.0 Client IDs
   - اختر "Web application"
   - أضف Authorized redirect URIs:
     ```
     http://localhost:4000/auth/google/callback
     ```

5. انسخ Client ID و Client Secret

### 2. أضف Credentials إلى التطبيق

أضف القيم الحقيقية في ملف `.env.local`:

```bash
VITE_GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnop.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=GOCSPX-1234567890abcdefghijklmnop
VITE_GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback
```

### 3. أعد تشغيل Dev Server

```bash
npm run dev
```

### 4. اختبر الاتصال

- اذهب إلى صفحة التقويم
- يجب أن تختفي رسالة التحذير الصفراء
- اضغط "ربط مع Google"
- يجب أن يعمل OAuth بدون أخطاء

## ملاحظات مهمة

- لا تضع credentials حقيقية في `.env.example`
- تأكد من إضافة `.env.local` إلى `.gitignore`
- الـ redirect URI يجب أن يطابق بالضبط ما في Google Console

## استكشاف الأخطاء

إذا لم يعمل، تحقق من:
- [ ] Client ID صحيح وليس فارغ
- [ ] Redirect URI يطابق Google Console
- [ ] Google Calendar API مفعل
- [ ] تم إعادة تشغيل dev server بعد تغيير .env
