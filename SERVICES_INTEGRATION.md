# Services API Integration

## 📋 نظرة عامة
تم دمج `ServicesList` component مع API endpoints باستخدام axios لاستخدام البيانات الحقيقية من قاعدة البيانات بدلاً من البيانات الثابتة.

## 🔧 التغييرات المنجزة

### 1. إنشاء Custom Hook (`src/hooks/useServices.ts`)
- **الوظيفة**: جلب الخدمات من API endpoint
- **الميزات**:
  - Loading states
  - Error handling
  - TypeScript interfaces
  - Refetch functionality

```typescript
export const useServices = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // ... implementation
}
```

### 2. تحديث ServicesList Component
- **الوظيفة**: استخدام البيانات من API مع fallback data
- **الميزات**:
  - Loading spinner
  - Error handling مع retry button
  - Fallback data في حالة عدم وجود خدمات
  - مؤشر بصري للبيانات الافتراضية
  - دعم اللغتين العربية والإنجليزية

### 3. تحديث ServiceCard Component
- **التغيير**: تحديث interface ليتوافق مع API data
- **التفاصيل**: تغيير `id` من `number` إلى `string` ليتوافق مع MongoDB ObjectId

## 🌐 API Endpoints المستخدمة

### GET `/api/services`
- **الوصف**: جلب جميع الخدمات النشطة للزوار
- **المصادقة**: غير مطلوبة
- **الاستجابة**:
```json
{
  "success": true,
  "services": [
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "features": ["string"],
      "status": "active",
      "order": number,
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

## 🎨 واجهة المستخدم

### Loading State
- Spinner animation مع رسالة "جاري تحميل الخدمات..."
- دعم اللغتين العربية والإنجليزية

### Error State
- أيقونة تحذير مع رسالة خطأ
- زر "إعادة المحاولة" لإعادة تحميل الصفحة
- عرض رسالة الخطأ التفصيلية

### Fallback Data
- عرض البيانات الافتراضية في حالة عدم وجود خدمات من API
- مؤشر بصري أصفر يوضح "عرض البيانات الافتراضية"
- الحفاظ على نفس التصميم والوظائف

## 🔄 تدفق البيانات

1. **تحميل المكون**: `useServices` hook يبدأ جلب البيانات
2. **حالة التحميل**: عرض spinner
3. **نجح الطلب**: عرض الخدمات من API
4. **فشل الطلب**: عرض رسالة خطأ مع زر retry
5. **لا توجد بيانات**: عرض fallback data مع مؤشر

## 🛠️ الملفات المعدلة

- `src/hooks/useServices.ts` (جديد)
- `src/components/public/home/ServicesList.tsx` (محدث)
- `src/components/public/home/ServiceCard.tsx` (محدث)

## 🚀 كيفية الاستخدام

```tsx
import { useServices } from '@/hooks/useServices'

function MyComponent() {
  const { services, loading, error, refetch } = useServices()
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      {services.map(service => (
        <div key={service._id}>{service.name}</div>
      ))}
    </div>
  )
}
```

## 📝 ملاحظات مهمة

1. **TypeScript**: جميع المكونات تستخدم TypeScript مع interfaces محددة
2. **Error Handling**: معالجة شاملة للأخطاء مع رسائل واضحة
3. **Fallback**: البيانات الافتراضية تضمن عمل الموقع حتى لو فشل API
4. **Responsive**: التصميم متجاوب مع جميع أحجام الشاشات
5. **Accessibility**: استخدام semantic HTML مع ARIA labels
6. **Performance**: استخدام React hooks بشكل صحيح مع cleanup

## 🔮 التحسينات المستقبلية

- إضافة caching للبيانات
- إضافة pagination للخدمات
- إضافة search/filter functionality
- إضافة animations للانتقالات
- إضافة skeleton loading
