# دليل النشر على Netlify

## 📋 **خطوات النشر:**

### **1. إعداد MongoDB Atlas:**
1. اذهب لـ [MongoDB Atlas](https://cloud.mongodb.com)
2. أنشئ cluster جديد
3. أنشئ database user جديد
4. أضف IP address (0.0.0.0/0)
5. انسخ connection string

### **2. إعداد Gmail App Password:**
1. اذهب لـ [Google Account](https://myaccount.google.com)
2. Security → 2-Step Verification (فعله)
3. Security → App passwords
4. اختر "Mail" و "Other"
5. انسخ الـ 16-character password

### **3. إعداد Netlify:**
1. اذهب لـ [Netlify](https://netlify.com)
2. New site from Git
3. اختر GitHub repository
4. Build command: `npm run build`
5. Publish directory: `.next`

### **4. إضافة Environment Variables:**
اذهب لـ Site Settings → Environment Variables وأضف:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/eldilta?retryWrites=true&w=majority
MONGODB_DB=eldilta
JWT_SECRET=your-super-secret-jwt-key-64-characters-long-for-production
JWT_EXPIRES_IN=7d
NEXTAUTH_SECRET=your-super-secret-nextauth-key-for-production
NEXTAUTH_URL=https://your-domain.netlify.app
NODE_ENV=production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### **5. إعداد Custom Domain (اختياري):**
1. Site Settings → Domain Management
2. Add custom domain
3. اتبع التعليمات لإعداد DNS

### **6. إعداد SSL:**
- Netlify يوفر SSL تلقائياً
- تأكد من تفعيل "Force HTTPS"

## 🔧 **استكشاف الأخطاء:**

### **مشاكل شائعة:**
1. **MongoDB Connection Error**: تأكد من صحة URI
2. **Email Not Sending**: تأكد من App Password
3. **JWT Error**: تأكد من JWT_SECRET
4. **Build Error**: تأكد من NODE_ENV=production

### **فحص Logs:**
1. اذهب لـ Site → Functions
2. شاهد logs للـ API calls
3. اذهب لـ Deploys → شاهد build logs

## 📊 **مراقبة الأداء:**
1. Site Analytics
2. Function Logs
3. Error Tracking
4. Performance Monitoring

## 🔒 **الأمان:**
1. استخدم HTTPS دائماً
2. لا تشارك Environment Variables
3. استخدم App Passwords للبريد
4. فعّل 2FA على جميع الحسابات
