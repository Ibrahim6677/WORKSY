# دليل ربط Google Calendar

تم إضا4. أضف Authorized redirect URIs:
   ```
   http://localhost:4000/auth/google/callback
   http://localhost:3000/auth/google/callback
   ```
5. احفظ Client ID و Client Secret

**مثال لإعداد OAuth consent screen:**
- اذهب إلى "OAuth consent screen"
- اختر "External" للاختبار
- أضف معلومات التطبيق الأساسية
- أضف test users إذا لزم الأمرمل Google Calendar إلى التطبيق لمزامنة الأحداث مع Google Calendar.

## الميزات المضافة

### 1. **خدمات Google Calendar**
- `googleCalendarApi.ts`: خدمة للتفاعل مع Google Calendar API
- `googleAuth.ts`: خدمة مصادقة Google OAuth 2.0
- `useGoogleCalendar.ts`: Hook لاستخدام Google Calendar

### 2. **مكونات الواجهة**
- `GoogleCalendarAuth.tsx`: مكون لربط وإدارة الاتصال بـ Google
- `GoogleAuthCallback.tsx`: صفحة معالجة OAuth callback

### 3. **التكامل مع التقويم**
- عرض أحداث Google Calendar في التقويم المحلي
- إنشاء أحداث جديدة في Google Calendar
- مزامنة الأحداث تلقائياً

## إعداد Google Calendar API

### 1. إنشاء مشروع في Google Cloud Console

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعّل Google Calendar API:
   - اذهب إلى "APIs & Services" > "Library"
   - ابحث عن "Google Calendar API"
   - اضغط "Enable"

### 2. إنشاء OAuth 2.0 Credentials

1. اذهب إلى "APIs & Services" > "Credentials"
2. اضغط "Create Credentials" > "OAuth 2.0 Client IDs"
3. اختر "Web application"
4. أضف Authorized redirect URIs:
   ```
   http://localhost:5173/auth/google/callback
   http://localhost:3000/auth/google/callback
   ```
5. احفظ Client ID و Client Secret

### 3. إعداد متغيرات البيئة

أنشئ ملف `.env.local` وأضف:

```bash
# Google Calendar API Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
VITE_GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback
```

**ملاحظة مهمة**: استخدم `VITE_` prefix لأن المشروع يستخدم Vite bundler.

## كيفية الاستخدام

### 1. ربط حساب Google

1. اذهب إلى صفحة التقويم
2. اضغط على "ربط مع Google"
3. اتبع خطوات المصادقة في Google
4. سيتم تحويلك تلقائياً بعد المصادقة

### 2. عرض الأحداث

- الأحداث من Google Calendar تظهر باللون الأزرق
- الأحداث المحلية تظهر بألوان مختلفة
- يتم تحديث الأحداث تلقائياً عند تغيير التاريخ

### 3. إنشاء أحداث

- يمكن إنشاء أحداث جديدة ستُضاف تلقائياً إلى Google Calendar
- الأحداث الجديدة تظهر فوراً في التقويم

### 4. المزامنة

- اضغط زر "مزامنة" لتحديث الأحداث يدوياً
- المزامنة تتم تلقائياً عند تغيير الأسبوع

## الأمان

- يتم حفظ tokens في localStorage
- يتم تجديد Access Token تلقائياً باستخدام Refresh Token
- يمكن قطع الاتصال في أي وقت من واجهة التطبيق

## استكشاف الأخطاء

### مشكلة: "process is not defined"
- تأكد من استخدام `VITE_` prefix في متغيرات البيئة
- استخدم `import.meta.env` بدلاً من `process.env` في Vite
- أعد تشغيل dev server بعد إضافة متغيرات البيئة

### مشكلة: "Authentication failed"
- تأكد من صحة Client ID و Client Secret
- تأكد من إضافة Redirect URI الصحيح في Google Console
- تحقق من أن متغيرات البيئة محملة بشكل صحيح

### مشكلة: "Failed to fetch events"
- تأكد من تفعيل Google Calendar API في Google Cloud Console
- تحقق من صحة permissions المطلوبة

### مشكلة: CORS Error
- تأكد من إضافة domain الصحيح في Google Console
- للتطوير المحلي، استخدم `http://localhost:PORT`

## API المستخدمة

- **Google Calendar API v3**: لإدارة الأحداث والتقاويم
- **Google OAuth 2.0**: للمصادقة والتفويض
- **Scopes المطلوبة**:
  - `https://www.googleapis.com/auth/calendar`
  - `https://www.googleapis.com/auth/calendar.events`

## الملفات المضافة

```
src/
├── services/
│   ├── api/calendar/
│   │   └── googleCalendarApi.ts     # خدمة Google Calendar API
│   └── auth/
│       └── googleAuth.ts            # خدمة مصادقة Google
├── hooks/
│   └── useGoogleCalendar/
│       └── useGoogleCalendar.ts     # Hook للتفاعل مع Google Calendar
├── components/
│   └── atoms/GoogleCalendarAuth/
│       └── GoogleCalendarAuth.tsx   # مكون ربط Google Calendar
└── pages/
    └── auth/
        └── GoogleAuthCallback.tsx   # صفحة OAuth callback
```

## المطورين

تم تطوير هذا التكامل ليكون:
- آمن ومتوافق مع معايير OAuth 2.0
- سهل الاستخدام مع واجهة عربية
- قابل للتوسع لإضافة مزيد من الميزات

للدعم الفني أو الاستفسارات، يرجى مراجعة الكود أو فتح issue في المشروع.
