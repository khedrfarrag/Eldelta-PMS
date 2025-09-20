# 🚀 دليل البدء السريع - Quick Start Guide

## المشكلة والحل

**المشكلة**: خطأ 500 عند تشغيل السيرفر المحلي بسبب إعدادات البيئة

**الحل**: إعداد بيئة مختلطة تسمح بالعمل المحلي مع قاعدة البيانات على السيرفر

## الخطوات السريعة

### 1️⃣ إعداد البيئة
```bash
# تشغيل سكريبت الإعداد التفاعلي
npm run setup-env
```

### 2️⃣ فحص الإعدادات
```bash
# التحقق من صحة الإعدادات
npm run check-env
```

### 3️⃣ تشغيل المشروع
```bash
# تثبيت التبعيات
npm install

# تشغيل المشروع محلياً
npm run dev
```

## الملفات المطلوبة

### `.env.local` (أنشئه يدوياً أو استخدم `npm run setup-env`)
```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/eldilta?retryWrites=true&w=majority
MONGODB_DB=eldilta

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-for-local-development-32-chars
JWT_EXPIRES_IN=7d

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-for-local-development
NEXTAUTH_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

## المميزات

✅ **نفس قاعدة البيانات** للعمل المحلي والإنتاجي  
✅ **إعدادات منفصلة** لكل بيئة  
✅ **أمان محسن** مع مفاتيح مختلفة  
✅ **سهولة التبديل** بين البيئات  

## استكشاف الأخطاء

### خطأ 500:
1. تأكد من وجود `.env.local`
2. تأكد من صحة `MONGODB_URI`
3. أعد تشغيل السيرفر

### خطأ في قاعدة البيانات:
1. تأكد من صحة رابط MongoDB Atlas
2. تأكد من أن IP الخاص بك مسموح
3. تأكد من صحة بيانات الدخول

## المساعدة

- 📖 راجع `ENVIRONMENT_SETUP.md` للتفاصيل الكاملة
- 🔧 استخدم `npm run setup-env` للإعداد التفاعلي
- ✅ استخدم `npm run check-env` للفحص
