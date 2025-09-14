"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { requestsAPI } from "@/lib/axios";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type ServiceDetails = {
  _id: string
  name: string
  description?: string
}

type ServiceType = 'import' | 'export' | 'logistics' | 'suppliers'

function inferServiceType(name?: string | any): ServiceType {
  let serviceName = '';
  if (typeof name === 'string') {
    serviceName = name.toLowerCase();
  } else if (name && typeof name === 'object') {
    serviceName = (name.ar || name.en || '').toLowerCase();
  } else {
    serviceName = String(name || '').toLowerCase();
  }
  
  if (serviceName.includes('استيراد') || serviceName.includes('import')) return 'import'
  if (serviceName.includes('تصدير') || serviceName.includes('export')) return 'export'
  if (serviceName.includes('شحن') || serviceName.includes('نقل') || serviceName.includes('logistics') || serviceName.includes('لوجستي')) return 'logistics'
  if (serviceName.includes('تخليص') || serviceName.includes('جمرك') || serviceName.includes('customs')) return 'suppliers'
  return 'suppliers' // Default to suppliers for other services
}

const PRODUCT_CATEGORIES = [
  'المنزل والديكور',
  'الرياضه والهويات',
  'الملابس والاكسسوارات',
  'مستلزمات صحيه واجهزه طبيه',
  'المواد الغزائيه',
  'الآلات والمعدات',
  'الالكترونيات والتكنولوجيا',
  'المواد الخام',
  'خطوط الانتاج',
]

export default function ServiceFormWizard() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [step, setStep] = useState<Step>(1);
  const serviceId = useMemo(() => {
    const id = params?.serviceId;
    return Array.isArray(id) ? id[0] : id;
  }, [params]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const [service, setService] = useState<ServiceDetails | null>(null)
  const [serviceType, setServiceType] = useState<ServiceType>('suppliers')
  const [loadingService, setLoadingService] = useState<boolean>(false)

  type FormValues = {
    productType: string;
    productSpecifications: string;
    commercialRecord: string;
    estimatedQuantity: string;
    exportCountry: string;
    destinationCountry: string;
    preferredShippingMethod: string;
    preferredDeliveryMethod: string;
    readyDate: string;
    desiredArrivalDate: string;
    budgetRange: string;
    insuranceNeeded: string;
    notes: string;
    heardAboutUs?: string;
    customerName: string;
    email: string;
    phone: string;
    totalValue: string;
  };

  const {
    register,
    handleSubmit,
    trigger,
    setError: setFormError,
    setFocus,
    formState: { errors },
    getValues,
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      productType: "",
      productSpecifications: "",
      commercialRecord: "",
      estimatedQuantity: "",
      exportCountry: "",
      destinationCountry: "",
      preferredShippingMethod: "",
      preferredDeliveryMethod: "",
      readyDate: "",
      desiredArrivalDate: "",
      budgetRange: "",
      insuranceNeeded: "",
      notes: "",
      heardAboutUs: "",
      customerName: "",
      email: "",
      phone: "",
      totalValue: "",
    },
  });

  useEffect(() => {
    if (!serviceId) return
    const objectIdRegex = /^[0-9a-fA-F]{24}$/
    if (!objectIdRegex.test(String(serviceId))) return
    let isMounted = true
    ;(async () => {
      try {
        setLoadingService(true)
        const res = await fetch(`/api/services/${serviceId}`)
        const data = await res.json()
        if (!isMounted) return
        if (data?.service) {
          setService({ _id: data.service._id, name: data.service.name, description: data.service.description })
          const detectedType = inferServiceType(data.service.name)
          setServiceType(detectedType)
          
          // Redirect to the appropriate specialized form
          let serviceName = '';
          if (typeof data.service.name === 'string') {
            serviceName = data.service.name.toLowerCase();
          } else if (data.service.name && typeof data.service.name === 'object') {
            serviceName = (data.service.name.ar || data.service.name.en || '').toLowerCase();
          } else {
            serviceName = String(data.service.name || '').toLowerCase();
          }
          
          if (serviceName.includes('استيراد') || serviceName.includes('import')) {
            router.replace(`/services/${serviceId}/import-form`)
            return
          } else if (serviceName.includes('تصدير') || serviceName.includes('export')) {
            router.replace(`/services/${serviceId}/export-form`)
            return
          } else if (serviceName.includes('شحن') || serviceName.includes('نقل') || serviceName.includes('logistics') || serviceName.includes('لوجستي')) {
            router.replace(`/services/${serviceId}/logistics-form`)
            return
          } else if (serviceName.includes('تخليص') || serviceName.includes('جمرك') || serviceName.includes('customs') || serviceName.includes('مورد') || serviceName.includes('مستورد')) {
            router.replace(`/services/${serviceId}/suppliers-form`)
            return
          }
        }
      } catch (e) {
        // ignore
      } finally {
        if (isMounted) setLoadingService(false)
      }
    })()
    return () => { isMounted = false }
  }, [serviceId, router])

  const next = () => setStep((s) => (Math.min(7, (s + 1) as Step) as Step));
  const prev = () => setStep((s) => (Math.max(1, (s - 1) as Step) as Step));

  const validateEmail = (val: string) => /.+@.+\..+/.test(val);

  const validateStep = async (s: Step): Promise<{ message: string; field?: keyof FormValues } | null> => {
    // minimal validation per API required fields
    if (s === 1) {
      const ok = await trigger(["productType", "productSpecifications", "commercialRecord"]);
      if (!ok) {
        const firstError = Object.keys(errors)[0] as keyof FormValues;
        return { message: isRTL ? "اكمل حقول الخطوة 1" : "Complete step 1 fields.", field: firstError };
      }
    }
    if (s === 2) {
      const ok = await trigger(["estimatedQuantity", "exportCountry", "destinationCountry"]);
      if (!ok) {
        const firstError = Object.keys(errors)[0] as keyof FormValues;
        return { message: isRTL ? "اكمل حقول الخطوة 2" : "Complete step 2 fields.", field: firstError };
      }
    }
    if (s === 4) {
      const ok = await trigger(["readyDate", "desiredArrivalDate"]);
      if (!ok) {
        const firstError = Object.keys(errors)[0] as keyof FormValues;
        return { message: isRTL ? "اكمل الجدولة" : "Complete schedule", field: firstError };
      }
    }
    if (s === 6) {
      const ok = await trigger(["customerName", "email", "phone"]);
      if (!ok) {
        const firstError = Object.keys(errors)[0] as keyof FormValues;
        return { message: isRTL ? "اكمل بيانات التواصل" : "Complete contact details", field: firstError };
      }
      const email = getValues("email");
      if (!validateEmail(email)) return { message: isRTL ? "بريد إلكتروني غير صالح" : "Invalid email", field: "email" };
    }
    return null;
  };

  const handleNext = async () => {
    const res = await validateStep(step);
    if (res) {
      setError(res.message);
      if (res.field) setFocus(res.field);
      return;
    }
    setError(null);
    next();
  };

  const onSubmit = async (vals: FormValues) => {
    if (!serviceId) {
      setError(isRTL ? "معرّف الخدمة غير موجود" : "Missing service ID");
      return;
    }

    // التحقق من صحة serviceId (ObjectId format)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(String(serviceId))) {
      setError(isRTL ? "معرّف الخدمة غير صالح. يجب أن يكون 24 حرف" : "Invalid service ID format. Must be 24 characters");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const serviceName = service?.name || ''
      const typeToSend = serviceType
      
      const payload = {
        customerName: vals.customerName,
        email: vals.email,
        phone: vals.phone,
        serviceId,
        serviceName,
        serviceType: typeToSend,
        productType: vals.productType,
        productSpecifications: vals.productSpecifications,
        commercialRecord: vals.commercialRecord,
        estimatedQuantity: vals.estimatedQuantity,
        destinationCountry: vals.destinationCountry,
        exportCountry: vals.exportCountry,
        totalValue: vals.totalValue || "0",
        preferredShippingMethod: vals.preferredShippingMethod,
        preferredDeliveryMethod: vals.preferredDeliveryMethod,
        readyDate: vals.readyDate,
        desiredArrivalDate: vals.desiredArrivalDate,
        insuranceNeeded: vals.insuranceNeeded,
        notes: vals.notes,
        budgetRange: vals.budgetRange,
        heardAboutUs: vals.heardAboutUs,
      }

      const { data } = await requestsAPI.create(payload);
      setSuccessId(data?.requestId || null);
      setStep(7);
    } catch (e: any) {
      
      let errorMessage = isRTL ? "حدث خطأ" : "Something went wrong";
      
      if (e?.response?.data?.error) {
        errorMessage = e.response.data.error;
      } else if (e?.message) {
        errorMessage = e.message;
      } else if (e?.response?.status === 400) {
        errorMessage = isRTL ? "بيانات غير صحيحة" : "Invalid data";
      } else if (e?.response?.status === 500) {
        errorMessage = isRTL ? "خطأ في السيرفر" : "Server error";
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const hint = (key: string) => {
    const t = serviceType
    const map: Record<string, Record<ServiceType, string>> = {
      productType: {
        import: 'اختر فئة المنتج المستورد لتسهيل مطابقة الموردين.' ,
        export: 'اختر فئة المنتج المُصدّر لتحديد متطلبات السوق.' ,
        logistics: 'اختر الفئة الأقرب لطبيعة الشحنة.' ,
        suppliers: 'اختر الفئة الأنسب لمنتجك.' ,
      },
      productSpecifications: {
        import: 'اذكر المواصفات التفصيلية (مواد، أبعاد، شهادة مطابقة إن وجدت).',
        export: 'اذكر المواصفات مع أي شهادات مطلوبة للأسواق المستهدفة.',
        logistics: 'اذكر الأبعاد والوزن والتغليف لتقدير الشحن.',
        suppliers: 'اذكر مواصفات المنتج بما يكفي لفهم الطلب.',
      },
      commercialRecord: {
        import: 'رقم السجل التجاري/الضريبي لشركتك للاستيراد.',
        export: 'رقم السجل التجاري/الضريبي لشركتك للتصدير.',
        logistics: 'أدخل بيانات المنشأة إن لزم التعاقد.',
        suppliers: 'أدخل بيانات المنشأة إن لزم.',
      },
      dates: {
        import: 'حدد تواريخ الجاهزية والوصول المتوقعة لتنسيق الشحن والجمارك.',
        export: 'حدد التواريخ لجدولة الإنتاج والشحن.',
        logistics: 'يساعد تحديد التواريخ على التخطيط اللوجستي.',
        suppliers: 'تحديد التواريخ يساعد في جدولة الخدمة.',
      },
    }
    return map[key]?.[t] || ''
  }

  return (
    <section className="w-full pt-24 pb-16 px-4 md:px-8 lg:px-12 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold" dir={isRTL ? "rtl" : "ltr"}>
            {isRTL ? "بدء طلب الخدمة" : "Start Service Request"}
          </h1>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400" dir={isRTL ? "rtl" : "ltr"}>
            {isRTL ? "اتّبع الخطوات التالية لتقديم معلومات طلبك" : "Follow the steps to provide your request details"}
          </div>
          <div className="mt-3 flex items-center justify-center gap-2" dir={isRTL ? 'rtl' : 'ltr'}>
            <span className="text-sm text-gray-700">{loadingService ? (isRTL ? 'جارٍ تحميل الخدمة...' : 'Loading service...') : (service?.name || '')}</span>
            {service && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${serviceType === 'import' ? 'bg-blue-50 text-blue-700' : serviceType === 'export' ? 'bg-emerald-50 text-emerald-700' : serviceType === 'logistics' ? 'bg-purple-50 text-purple-700' : 'bg-gray-50 text-gray-700'}`}>
                {serviceType === 'import' ? (isRTL ? 'استيراد' : 'Import') : serviceType === 'export' ? (isRTL ? 'تصدير' : 'Export') : serviceType === 'logistics' ? (isRTL ? 'لوجستيات' : 'Logistics') : (isRTL ? 'أخرى' : 'Other')}
              </span>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 dark:bg-teal-500 transition-all"
              style={{ width: `${(step / 7) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400" dir={isRTL ? "rtl" : "ltr"}>
            {isRTL ? `الخطوة ${step} من 7` : `Step ${step} of 7`}
          </div>
        </div>

        {/* Steps */}
        <div className="rounded-2xl p-6 shadow-2xl space-y-4">
          {error && (
            <div className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm" dir={isRTL ? "rtl" : "ltr"}>
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
              <h2 className="text-lg font-bold">{isRTL ? "الأساسيات" : "Basics"}</h2>
              <div>
                <select {...register("productType", { required: isRTL ? "نوع المنتج مطلوب" : "Product type required" })} className={`w-full px-4 py-3 border rounded-xl ${errors.productType ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}>
                  <option value="">{isRTL ? "اختر نوع المنتج" : "Select product category"}</option>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500" dir={isRTL ? 'rtl' : 'ltr'}>{hint('productType')}</p>
                {errors.productType && <p className="mt-1 text-sm text-red-600 dark:text-red-400" dir={isRTL ? "rtl" : "ltr"}>{errors.productType.message}</p>}
              </div>
              <div>
                <textarea {...register("productSpecifications", { required: isRTL ? "مواصفات المنتج مطلوبة" : "Product specifications required" })} className={`w-full px-4 py-3 border rounded-xl ${errors.productSpecifications ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`} rows={4} placeholder={isRTL ? "مواصفات المنتج" : "Product specifications"} />
                <p className="mt-1 text-xs text-gray-500" dir={isRTL ? 'rtl' : 'ltr'}>{hint('productSpecifications')}</p>
                {errors.productSpecifications && <p className="mt-1 text-sm text-red-600 dark:text-red-400" dir={isRTL ? "rtl" : "ltr"}>{errors.productSpecifications.message}</p>}
              </div>
              <div>
                <input {...register("commercialRecord", { required: isRTL ? "السجل التجاري/الضريبي مطلوب" : "Commercial/Tax record required" })} className={`w-full px-4 py-3 border rounded-xl ${errors.commercialRecord ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`} placeholder={isRTL ? "السجل التجاري/الضريبي" : "Commercial/Tax record"} />
                <p className="mt-1 text-xs text-gray-500" dir={isRTL ? 'rtl' : 'ltr'}>{hint('commercialRecord')}</p>
                {errors.commercialRecord && <p className="mt-1 text-sm text-red-600 dark:text-red-400" dir={isRTL ? "rtl" : "ltr"}>{errors.commercialRecord.message}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
              <h2 className="text-lg font-bold">{isRTL ? "تفاصيل الشحنة" : "Shipment details"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <input {...register("estimatedQuantity", { required: isRTL ? "الكمية التقديرية مطلوبة" : "Estimated quantity required" })} className={`px-4 py-3 border rounded-xl ${errors.estimatedQuantity ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`} placeholder={isRTL ? "الكمية التقديرية" : "Estimated quantity"} />
                  {errors.estimatedQuantity && <p className="mt-1 text-sm text-red-600 dark:text-red-400" dir={isRTL ? "rtl" : "ltr"}>{errors.estimatedQuantity.message}</p>}
                </div>
                <div>
                  <input {...register("totalValue")} className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl" placeholder={isRTL ? "قيمة إجمالية تقديرية (اختياري)" : "Estimated total value (optional)"} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <input {...register("exportCountry", { required: isRTL ? "بلد التصدير مطلوب" : "Export country required" })} className={`px-4 py-3 border rounded-xl ${errors.exportCountry ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`} placeholder={isRTL ? "بلد التصدير" : "Export country"} />
                  {errors.exportCountry && <p className="mt-1 text-sm text-red-600 dark:text-red-400" dir={isRTL ? "rtl" : "ltr"}>{errors.exportCountry.message}</p>}
                </div>
                <div>
                  <input {...register("destinationCountry", { required: isRTL ? "بلد الوجهة مطلوب" : "Destination country required" })} className={`px-4 py-3 border rounded-xl ${errors.destinationCountry ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`} placeholder={isRTL ? "بلد الوجهة" : "Destination country"} />
                  {errors.destinationCountry && <p className="mt-1 text-sm text-red-600 dark:text-red-400" dir={isRTL ? "rtl" : "ltr"}>{errors.destinationCountry.message}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
              <h2 className="text-lg font-bold">{isRTL ? "التفضيلات اللوجستية" : "Logistics preferences"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select {...register("preferredShippingMethod")} className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800">
                  <option value="">{isRTL ? "طريقة الشحن (اختياري)" : "Shipping method (optional)"}</option>
                  <option value="sea">{isRTL ? "بحري" : "Sea"}</option>
                  <option value="air">{isRTL ? "جوي" : "Air"}</option>
                  <option value="other">{isRTL ? "أخرى" : "Other"}</option>
                </select>
                <input {...register("preferredDeliveryMethod")} className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl" placeholder={isRTL ? "طريقة التسليم (اختياري)" : "Delivery method (optional)"} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
              <h2 className="text-lg font-bold">{isRTL ? "الجدولة والتكلفة" : "Schedule & budget"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <input {...register("readyDate", { required: isRTL ? "تاريخ جاهزية البضاعة مطلوب" : "Ready date required" })} type="date" className={`px-4 py-3 border rounded-xl ${errors.readyDate ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`} placeholder={isRTL ? "تاريخ جاهزية البضاعة" : "Ready date"} />
                  <p className="mt-1 text-xs text-gray-500" dir={isRTL ? 'rtl' : 'ltr'}>{hint('dates')}</p>
                  {errors.readyDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400" dir={isRTL ? "rtl" : "ltr"}>{errors.readyDate.message}</p>}
                </div>
                <div>
                  <input {...register("desiredArrivalDate", { required: isRTL ? "تاريخ الوصول المرغوب مطلوب" : "Desired arrival date required" })} type="date" className={`px-4 py-3 border rounded-xl ${errors.desiredArrivalDate ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`} placeholder={isRTL ? "تاريخ الوصول المرغوب" : "Desired arrival"} />
                  {errors.desiredArrivalDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400" dir={isRTL ? "rtl" : "ltr"}>{errors.desiredArrivalDate.message}</p>}
                </div>
              </div>
              <input {...register("budgetRange")} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl" placeholder={isRTL ? "نطاق الميزانية (اختياري)" : "Budget range (optional)"} />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
              <h2 className="text-lg font-bold">{isRTL ? "خيارات إضافية" : "Additional options"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select {...register("insuranceNeeded")} className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800">
                  <option value="">{isRTL ? "التأمين (اختياري)" : "Insurance (optional)"}</option>
                  <option value="yes">{isRTL ? "نعم" : "Yes"}</option>
                  <option value="no">{isRTL ? "لا" : "No"}</option>
                </select>
                <select {...register("heardAboutUs")} className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800">
                  <option value="">{isRTL ? "كيف سمعت عنا؟ (اختياري)" : "How did you hear about us? (optional)"}</option>
                  <option value="search">{isRTL ? "محرك بحث" : "Search engine"}</option>
                  <option value="ads">{isRTL ? "إعلانات" : "Ads"}</option>
                  <option value="referral">{isRTL ? "إحالة/صديق" : "Referral"}</option>
                  <option value="social">{isRTL ? "شبكات اجتماعية" : "Social media"}</option>
                  <option value="other">{isRTL ? "أخرى" : "Other"}</option>
                </select>
              </div>
              <input {...register("preferredDeliveryMethod")} className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl" placeholder={isRTL ? "طريقة التسليم (اختياري)" : "Delivery method (optional)"} />
              <textarea {...register("notes")} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl" rows={4} placeholder={isRTL ? "ملاحظات إضافية (اختياري)" : "Additional notes (optional)"} />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
              <h2 className="text-lg font.bold">{isRTL ? "بيانات التواصل" : "Contact details"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <input {...register("customerName", { required: isRTL ? "الاسم مطلوب" : "Name required" })} className={`px-4 py-3 border rounded-xl ${errors.customerName ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`} placeholder={isRTL ? "الاسم" : "Name"} />
                  {errors.customerName && <p className="mt-1 text-sm text-red-600 dark:text-red-400" dir={isRTL ? "rtl" : "ltr"}>{errors.customerName.message}</p>}
                </div>
                <div>
                  <input {...register("email", { required: isRTL ? "البريد الإلكتروني مطلوب" : "Email required", validate: (v)=>/.+@.+\..+/.test(v) || (isRTL ? "بريد إلكتروني غير صالح" : "Invalid email") })} className={`px-4 py-3 border rounded-xl ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`} placeholder="Email" />
                  {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400" dir={isRTL ? "rtl" : "ltr"}>{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <input {...register("phone", { required: isRTL ? "رقم الهاتف مطلوب" : "Phone required" })} className={`w-full px-4 py-3 border rounded-xl ${errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`} placeholder={isRTL ? "الهاتف" : "Phone"} />
                {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400" dir={isRTL ? "rtl" : "ltr"}>{errors.phone.message}</p>}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4 text-center" dir={isRTL ? "rtl" : "ltr"}>
              {successId ? (
                <>
                  <h2 className="text-lg font-bold">{isRTL ? "تم استلام طلبك" : "Your request was received"}</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isRTL ? `رقم الطلب: ${successId}` : `Request ID: ${successId}`}
                  </p>
                </>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">{isRTL ? "يرجى الإرسال لإكمال الطلب" : "Please submit to complete the request"}</p>
              )}
            </div>
          )}
        </div>

        {/* Nav */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => (step === 1 ? router.back() : prev())}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:opacity-90"
          >
            {step === 1 ? (isRTL ? "رجوع" : "Back") : (isRTL ? "السابق" : "Previous")}
          </button>
          {step < 7 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-lg bg-gray-800 dark:bg-gray-600 text-white hover:opacity-90"
            >
              {isRTL ? "التالي" : "Next"}
            </button>
          ) : (
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-gray-800 dark:bg-gray-600 text-white hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? (isRTL ? "جارٍ الإرسال..." : "Submitting...") : (isRTL ? "إرسال" : "Submit")}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}


