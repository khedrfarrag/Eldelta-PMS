# دليل إعداد البيئة - Environment Setup Guide

## المشكلة الحالية
أنت تريد العمل محلياً (local development) مع قاعدة البيانات على السيرفر، ولكن تواجه خطأ 500 عند تشغيل السيرفر المحلي.

## الحل الأمثل: إعداد بيئة مختلطة

### الخطوة 1: إنشاء ملف .env.local

أنشئ ملف `.env.local` في جذر المشروع مع المحتوى التالي:

```bash
# Local Development Environment Variables
# This file is for local development and should not be committed to git

# MongoDB Configuration - Using Atlas for both local and production
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

# Email Configuration (for OTP) - Optional for local development
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# LibreTranslate Configuration - Optional for local development
LIBRETRANSLATE_URL=http://localhost:5000

# Development specific settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### الخطوة 2: تحديث ملف .env.production

تأكد من أن ملف `.env.production` يحتوي على:

```bash
# Production Environment Variables for Netlify
# Copy these to Netlify Environment Variables

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/eldilta?retryWrites=true&w=majority
MONGODB_DB=eldilta

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-64-characters-long-for-production
JWT_EXPIRES_IN=7d

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-nextauth-key-for-production
NEXTAUTH_URL=https://your-domain.netlify.app

# Environment
NODE_ENV=production

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# LibreTranslate Configuration (Optional)
LIBRETRANSLATE_URL=https://your-libretranslate-instance.com
```

### الخطوة 3: إعداد قاعدة البيانات

1. **استخدم MongoDB Atlas** (الموصى به):
   - نفس قاعدة البيانات للعمل المحلي والإنتاجي
   - أمان أفضل وإدارة أسهل
   - نسخ احتياطية تلقائية

2. **أو استخدم MongoDB محلي** (اختياري):
   ```bash
   # تثبيت MongoDB محلياً
   npm install -g mongodb
   # أو استخدم Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

### الخطوة 4: تشغيل المشروع

```bash
# تثبيت التبعيات
npm install

# تشغيل المشروع محلياً
npm run dev

# أو تشغيل في وضع الإنتاج محلياً
npm run build
npm start
```

## المميزات

✅ **نفس قاعدة البيانات**: للعمل المحلي والإنتاجي  
✅ **إعدادات منفصلة**: لكل بيئة  
✅ **أمان**: مفاتيح مختلفة لكل بيئة  
✅ **مرونة**: يمكن التبديل بين البيئات بسهولة  

## استكشاف الأخطاء

### خطأ 500 عند التشغيل المحلي:
1. تأكد من وجود ملف `.env.local`
2. تأكد من صحة `MONGODB_URI`
3. تأكد من أن جميع المتغيرات المطلوبة موجودة
4. أعد تشغيل السيرفر بعد إضافة المتغيرات

### خطأ في الاتصال بقاعدة البيانات:
1. تأكد من صحة رابط MongoDB Atlas
2. تأكد من أن IP الخاص بك مسموح في MongoDB Atlas
3. تأكد من صحة اسم المستخدم وكلمة المرور

## نصائح إضافية

- استخدم مفاتيح مختلفة للبيئة المحلية والإنتاجية
- لا تشارك ملف `.env.local` في Git
- استخدم MongoDB Atlas للبيئة الإنتاجية
- فعّل النسخ الاحتياطية التلقائية في MongoDB Atlas
