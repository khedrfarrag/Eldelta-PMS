# 🏠 الصفحة الرئيسية - مرجع الـ Sections

## 📋 قائمة الـ Sections المطلوبة (من تصميم Figma)

### ✅ **تم تنفيذها:**
1. **Hero Section** - `src/components/public/Hero.tsx`
   - العنوان الرئيسي: "تربط تجارتك بالعالم..."
   - الوصف: "تصدير واستيراد بسهولة وأمان"
   - صورة سفينة شحن مع حاويات ملونة
   - زر "اكتشف المزيد"

2. **Services Overview** - `src/components/public/ServicesList.tsx`
   - العنوان: "خدمات متكاملة لتجارتك العالمية"
   - 4 خدمات أساسية: تصدير، استيراد، تخليص جمركي، شحن ولوجستيات
   - منتجات متنوعة: زيوت ودهون، مواد كيميائية، مواد غذائية، مواد بناء

3. **Contact Info** - `src/components/public/ContactInfo.tsx`
   - معلومات التواصل الأساسية: إيميل، هاتف، عنوان

4. **Navigation System** - `src/components/shared/Navigation/`
   - **VisitorNav** - ناف بار للزائرين مع دعم اللغتين
   - **AdminNav** - ناف بار للمشرفين والسوبر أدمن
   - **ThemeToggle** - تبديل الثيم (فاتح/داكن) + تغيير اللون الأساسي
   - **LanguageToggle** - تبديل اللغة (عربي/إنجليزي)

5. **Theme System** - `src/contexts/ThemeContext.tsx`
   - دعم الوضع الفاتح والداكن
   - 3 ألوان أساسية: أزرق رمادي، رمادي، أزرق داكن
   - حفظ التفضيلات في localStorage

6. **Language System** - `src/contexts/LanguageContext.tsx`
   - دعم اللغتين العربية والإنجليزية
   - تبديل تلقائي للـ RTL/LTR
   - حفظ اللغة المفضلة في localStorage

7. **CSS Variables** - `src/styles/variables.css`
   - نظام ألوان ديناميكي
   - دعم الثيم الداكن
   - متغيرات CSS للألوان الأساسية

8. **Fonts System** - `src/styles/fonts.ts`
   - خط Cairo للعربية
   - خط Inter للإنجليزية
   - تحميل محسن مع Next.js

9. **Middleware** - `middleware.ts`
   - توجيه تلقائي للغة الإنجليزية (افتراضية)
   - دعم المسارات مع prefix: `/en/`, `/ar/`

10. **Translation Files** - `src/messages/`
    - `en.json` - الترجمات الإنجليزية
    - `ar.json` - الترجمات العربية

### ⏳ **لم يتم تنفيذها بعد:**

11. **Statistics Cards** - `src/components/public/StatisticsSection.tsx`
    - 4 بطاقات إحصائيات:
      - تقييم: 4.5
      - عملاء: +50K
      - معدل النجاح: 90%
      - شحنات: +10K

12. **Features Section** - `src/components/public/FeaturesSection.tsx`
    - العنوان: "كل ما تحتاجه للتجارة... في مكان واحد"
    - 3 ميزات: تتبع الشحنات، إدارة المستندات، حلول متكاملة
    - دعم لوجستي، شبكة عالمية

13. **FAQ Section** - `src/components/public/FAQSection.tsx`
    - العنوان: "كل ما تحتاج معرفته قبل أن تبدأ"
    - أسئلة شائعة قابلة للتوسيع:
      - كيف أبدأ عملية الشحن أو الاستيراد؟
      - هل أستطيع تتبع شحناتي؟
      - ما هي رسومكم؟
      - هل تقدمون خدمات التخليص الجمركي؟

14. **Testimonials Section** - `src/components/public/TestimonialsSection.tsx`
    - العنوان: "ماذا يقول عملاؤنا عن تجربتهم معنا؟"
    - بطاقات آراء العملاء مع صور شخصية وتقييمات 5 نجوم
    - أسماء: أحمد يوسف، مصطفى رضا، إلخ

15. **Contact Form Section** - `src/components/public/ContactFormSection.tsx`
    - العنوان: "جاهزون للرد على كل استفساراتك"
    - نموذج تواصل: اسم، إيميل، هاتف، رسالة
    - أيقونات وسائل التواصل الاجتماعي

16. **Footer** - `src/components/shared/Footer/Footer.tsx`
    - شعار الشركة "الدلتا"
    - روابط سريعة، خدماتنا
    - معلومات التواصل
    - حقوق النشر

---

## 🔗 **ربط الـ Sections بالصفحة الرئيسية:**

```tsx
// src/app/page.tsx
import { VisitorNav } from '@/components/shared/Navigation'
import Hero from '@/components/public/Hero'
import StatisticsSection from '@/components/public/StatisticsSection'
import ServicesList from '@/components/public/ServicesList'
import FeaturesSection from '@/components/public/FeaturesSection'
import FAQSection from '@/components/public/FAQSection'
import TestimonialsSection from '@/components/public/TestimonialsSection'
import ContactFormSection from '@/components/public/ContactFormSection'

export default function HomePage() {
  return (
    <>
      <VisitorNav />
      <Hero />
      <StatisticsSection />
      <ServicesList />
      <FeaturesSection />
      <FAQSection />
      <TestimonialsSection />
      <ContactFormSection />
    </>
  )
}
```

---

## 🌟 **المميزات المكتملة:**

### **نظام الثيم:**
- ✅ تبديل فاتح/داكن
- ✅ 3 ألوان أساسية قابلة للتغيير
- ✅ حفظ التفضيلات
- ✅ دعم CSS Variables

### **نظام اللغات:**
- ✅ عربي/إنجليزي
- ✅ تبديل RTL/LTR تلقائي
- ✅ ملفات ترجمة منفصلة
- ✅ middleware للتوجيه

### **الناف بار:**
- ✅ ناف بار للزائرين
- ✅ ناف بار للمشرفين
- ✅ أزرار تبديل الثيم واللغة
- ✅ دعم كامل للغتين

---

## 📝 **ملاحظات مهمة:**
- كل section يجب أن يكون responsive
- استخدام Tailwind CSS للتصميم
- الحفاظ على التصميم العربي (RTL)
- إضافة animations بسيطة للتفاعل
- التأكد من accessibility

---

## 🎯 **الخطة:**
1. ✅ إنشاء نظام الثيم واللغات
2. ✅ إنشاء الناف بار والتنقل
3. ⏳ إنشاء باقي الـ sections
4. ⏳ ربطهم بالصفحة الرئيسية
5. ⏳ اختبار التكامل
6. ⏳ تحسين UX/UI

---

## 🚀 **الخطوة التالية:**

يمكننا الآن:
1. **إنشاء باقي الـ sections** (Statistics, Features, FAQ, etc.)
2. **ربط الناف بار** بباقي الصفحات
3. **إنشاء Footer** للزائرين
4. **اختبار النظام** كاملاً

---

*آخر تحديث: [التاريخ الحالي]*
*الحالة: 10/16 sections مكتملة*
*النظام الأساسي: مكتمل ✅*
