"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { requestsAPI } from "@/lib/axios";
import { mapLogisticsData } from "@/lib/requestMappers";
import { PRODUCT_CATEGORIES } from "@/lib/constants/productCategories";

type ServiceDetails = {
  _id: string
  name: string
  description?: string
}

type Step = 1 | 2 | 3 | 4 | 5;

export default function LogisticsForm() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  
  const serviceId = useMemo(() => {
    const id = params?.serviceId;
    return Array.isArray(id) ? id[0] : id;
  }, [params]);
  
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [loadingService, setLoadingService] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<Step>(1);

  type FormValues = {
    // الخطوة 1: البيانات الأساسية
    customerName: string;
    companyName: string;
    phone: string;
    email: string;
    
    // الخطوة 2: بيانات الشحن
    fromCountry: string;
    toCountry: string;
    fromCity: string;
    toCity: string;
    shipmentType: string;
    productType: string;
    
    // الخطوة 3: تفاصيل الشحنة
    weight: string;
    volume: string;
    packagesCount: string;
    estimatedValue: string;
    preferredDeliveryMethod: string;
    
    // الخطوة 4: الخدمات الإضافية
    insuranceNeeded: boolean;
    trackingNeeded: boolean;
    doorToDoor: boolean;
    customsAgent: boolean;
    shippingUrgency: 'urgent' | 'normal';
    
    // الخطوة 5: معلومات إضافية
    heardAboutUs: string;
    notes: string;
  };

  const {
    register,
    handleSubmit,
    trigger,
    setError: setFormError,
    setFocus,
    formState: { errors },
    getValues,
    watch,
    setValue
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      customerName: '',
      companyName: '',
      phone: '',
      email: '',
      fromCountry: '',
      toCountry: '',
      fromCity: '',
      toCity: '',
      shipmentType: '',
      productType: '',
      weight: '',
      volume: '',
      packagesCount: '',
      estimatedValue: '',
      preferredDeliveryMethod: '',
      insuranceNeeded: false,
      trackingNeeded: false,
      doorToDoor: false,
      customsAgent: false,
      shippingUrgency: 'normal',
      heardAboutUs: '',
      notes: ''
    }
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
          const nameText = typeof data.service.name === 'string'
            ? data.service.name
            : (data.service.name?.[language] || data.service.name?.ar || data.service.name?.en || '')
          const descText = typeof data.service.description === 'string'
            ? data.service.description
            : (data.service.description?.[language] || data.service.description?.ar || data.service.description?.en || '')
          setService({ _id: data.service._id, name: nameText, description: descText })
        }
      } catch (e) {
        console.error('Error fetching service:', e)
        setError(isRTL ? 'خطأ في تحميل بيانات الخدمة' : 'Error loading service data')
      } finally {
        if (isMounted) setLoadingService(false)
      }
    })()
    return () => { isMounted = false }
  }, [serviceId, isRTL])

  const next = () => setStep((s) => (Math.min(5, (s + 1) as Step) as Step));
  const prev = () => setStep((s) => (Math.max(1, (s - 1) as Step) as Step));

  const validateStep = async (s: Step): Promise<{ message: string; field?: keyof FormValues } | null> => {
    if (s === 1) {
      const ok = await trigger(["customerName", "companyName", "phone", "email"]);
      if (!ok) {
        setFocus("customerName");
        return { message: isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields" };
      }
    } else if (s === 2) {
      const ok = await trigger(["fromCountry", "toCountry", "fromCity", "toCity", "shipmentType", "productType"]);
      if (!ok) {
        setFocus("fromCountry");
        return { message: isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields" };
      }
    } else if (s === 3) {
      const ok = await trigger(["weight", "volume", "packagesCount", "estimatedValue", "preferredDeliveryMethod"]);
      if (!ok) {
        setFocus("weight");
        return { message: isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields" };
      }
    }
    return null;
  };

  const handleNext = async () => {
    const validation = await validateStep(step);
    if (validation) {
      setError(validation.message);
      return;
    }
    setError(null);
    next();
  };

  const onSubmit = async (vals: FormValues) => {
    if (!serviceId) {
      setError(isRTL ? 'معرف الخدمة مطلوب' : 'Service ID is required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const requestData = mapLogisticsData(
        {
          ...vals,
          totalValue: vals.estimatedValue,
        },
        serviceId,
        service?.name
      );

      const response = await requestsAPI.create(requestData);
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/services');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setError(error.response?.data?.error || (isRTL ? 'حدث خطأ أثناء إرسال الطلب' : 'Error submitting request'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingService) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600" dir={isRTL ? "rtl" : "ltr"}>
            {isRTL ? 'جاري تحميل النموذج...' : 'Loading form...'}
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4" dir={isRTL ? "rtl" : "ltr"}>
            {isRTL ? 'تم إرسال طلبك بنجاح!' : 'Request submitted successfully!'}
          </h2>
          <p className="text-gray-600 mb-6" dir={isRTL ? "rtl" : "ltr"}>
            {isRTL ? 'سيتم التواصل معك قريباً لتأكيد التفاصيل' : 'We will contact you soon to confirm the details'}
          </p>
          <button
            onClick={() => router.push('/services')}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            {isRTL ? 'العودة للخدمات' : 'Back to Services'}
          </button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" dir={isRTL ? "rtl" : "ltr"}>
              {isRTL ? 'البيانات الأساسية' : 'Basic Information'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  {...register('customerName', { 
                    required: isRTL ? 'الاسم الكامل مطلوب' : 'Full name is required',
                    minLength: { value: 2, message: isRTL ? 'الاسم يجب أن يكون حرفين على الأقل' : 'Name must be at least 2 characters' }
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.customerName && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.customerName.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'اسم الشركة / النشاط التجاري *' : 'Company / Business Name *'}
                </label>
                <input
                  type="text"
                  {...register('companyName', { 
                    required: isRTL ? 'اسم الشركة مطلوب' : 'Company name is required',
                    minLength: { value: 2, message: isRTL ? 'اسم الشركة يجب أن يكون حرفين على الأقل' : 'Company name must be at least 2 characters' }
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.companyName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.companyName.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'رقم الهاتف *' : 'Phone Number *'}
                </label>
                <input
                  type="tel"
                  {...register('phone', { 
                    required: isRTL ? 'رقم الهاتف مطلوب' : 'Phone number is required',
                    pattern: {
                      value: /^[0-9+\-\s()]+$/,
                      message: isRTL ? 'رقم الهاتف غير صحيح' : 'Invalid phone number'
                    }
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.phone.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'البريد الإلكتروني *' : 'Email Address *'}
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: isRTL ? 'البريد الإلكتروني مطلوب' : 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: isRTL ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address'
                    }
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" dir={isRTL ? "rtl" : "ltr"}>
              {isRTL ? 'بيانات الشحن' : 'Shipping Information'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'بلد الشحن (من) *' : 'Shipping Country (From) *'}
                </label>
                <input
                  type="text"
                  {...register('fromCountry', { 
                    required: isRTL ? 'بلد الشحن مطلوب' : 'Shipping country is required',
                    minLength: { value: 2, message: isRTL ? 'اسم البلد يجب أن يكون حرفين على الأقل' : 'Country name must be at least 2 characters' }
                  })}
                  placeholder={isRTL ? 'مثال: السعودية، الصين، ألمانيا...' : 'Example: Saudi Arabia, China, Germany...'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.fromCountry ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.fromCountry && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.fromCountry.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'بلد الوجهة (إلى) *' : 'Destination Country (To) *'}
                </label>
                <input
                  type="text"
                  {...register('toCountry', { 
                    required: isRTL ? 'بلد الوجهة مطلوب' : 'Destination country is required',
                    minLength: { value: 2, message: isRTL ? 'اسم البلد يجب أن يكون حرفين على الأقل' : 'Country name must be at least 2 characters' }
                  })}
                  placeholder={isRTL ? 'مثال: الإمارات، الكويت، مصر...' : 'Example: UAE, Kuwait, Egypt...'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.toCountry ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.toCountry && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.toCountry.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'الميناء/المدينة (من) *' : 'Port/City (From) *'}
                </label>
                <input
                  type="text"
                  {...register('fromCity', { 
                    required: isRTL ? 'الميناء/المدينة مطلوب' : 'Port/City is required',
                    minLength: { value: 2, message: isRTL ? 'اسم الميناء/المدينة يجب أن يكون حرفين على الأقل' : 'Port/City name must be at least 2 characters' }
                  })}
                  placeholder={isRTL ? 'مثال: جدة، شنغهاي، هامبورغ...' : 'Example: Jeddah, Shanghai, Hamburg...'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.fromCity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.fromCity && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.fromCity.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'الميناء/المدينة (إلى) *' : 'Port/City (To) *'}
                </label>
                <input
                  type="text"
                  {...register('toCity', { 
                    required: isRTL ? 'الميناء/المدينة مطلوب' : 'Port/City is required',
                    minLength: { value: 2, message: isRTL ? 'اسم الميناء/المدينة يجب أن يكون حرفين على الأقل' : 'Port/City name must be at least 2 characters' }
                  })}
                  placeholder={isRTL ? 'مثال: دبي، الكويت، القاهرة...' : 'Example: Dubai, Kuwait, Cairo...'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.toCity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.toCity && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.toCity.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'نوع الشحنة *' : 'Shipment Type *'}
                </label>
                <select
                  {...register('shipmentType', { 
                    required: isRTL ? 'نوع الشحنة مطلوب' : 'Shipment type is required'
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.shipmentType ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <option value="">{isRTL ? 'اختر نوع الشحنة' : 'Select shipment type'}</option>
                  <option value="full_container">{isRTL ? 'حاوية كاملة' : 'Full Container'}</option>
                  <option value="partial_container">{isRTL ? 'جزء من حاوية' : 'Partial Container'}</option>
                  <option value="air">{isRTL ? 'شحن جوي' : 'Air Freight'}</option>
                  <option value="land">{isRTL ? 'شحن بري' : 'Land Freight'}</option>
                  <option value="express">{isRTL ? 'سريع' : 'Express'}</option>
                </select>
                {errors.shipmentType && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.shipmentType.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'نوع المنتج *' : 'Product Type *'}
                </label>
                <select
                  {...register('productType', { 
                    required: isRTL ? 'نوع المنتج مطلوب' : 'Product type is required'
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.productType ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <option value="">{isRTL ? 'اختر نوع المنتج' : 'Select product type'}</option>
                  {PRODUCT_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{isRTL ? cat.labelAr : cat.labelEn}</option>
                  ))}
                </select>
                {errors.productType && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.productType.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" dir={isRTL ? "rtl" : "ltr"}>
              {isRTL ? 'تفاصيل الشحنة' : 'Shipment Details'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'الوزن الإجمالي (كجم) *' : 'Total Weight (kg) *'}
                </label>
                <input
                  type="text"
                  {...register('weight', { 
                    required: isRTL ? 'الوزن مطلوب' : 'Weight is required',
                    pattern: {
                      value: /^[0-9.]+$/,
                      message: isRTL ? 'الوزن يجب أن يكون أرقام فقط' : 'Weight must be numbers only'
                    }
                  })}
                  placeholder={isRTL ? 'مثال: 1500.5' : 'Example: 1500.5'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.weight ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.weight.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'الحجم أو المتر المكعب *' : 'Volume or Cubic Meters *'}
                </label>
                <input
                  type="text"
                  {...register('volume', { 
                    required: isRTL ? 'الحجم مطلوب' : 'Volume is required',
                    pattern: {
                      value: /^[0-9.]+$/,
                      message: isRTL ? 'الحجم يجب أن يكون أرقام فقط' : 'Volume must be numbers only'
                    }
                  })}
                  placeholder={isRTL ? 'مثال: 25.5' : 'Example: 25.5'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.volume ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.volume && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.volume.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'عدد الطرود أو الحاويات *' : 'Number of Packages or Containers *'}
                </label>
                <input
                  type="text"
                  {...register('packagesCount', { 
                    required: isRTL ? 'عدد الطرود مطلوب' : 'Number of packages is required',
                    pattern: {
                      value: /^[0-9]+$/,
                      message: isRTL ? 'عدد الطرود يجب أن يكون أرقام فقط' : 'Number of packages must be numbers only'
                    }
                  })}
                  placeholder={isRTL ? 'مثال: 50' : 'Example: 50'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.packagesCount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.packagesCount && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.packagesCount.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'القيمة التقديرية للشحنة (بالدولار) *' : 'Estimated value of shipment (USD) *'}
                </label>
                <input
                  type="text"
                  {...register('estimatedValue', { 
                    required: isRTL ? 'القيمة التقديرية مطلوبة' : 'Estimated value is required',
                    pattern: {
                      value: /^[0-9.]+$/,
                      message: isRTL ? 'القيمة يجب أن تكون أرقام فقط' : 'Value must be numbers only'
                    }
                  })}
                  placeholder={isRTL ? 'مثال: 50000' : 'Example: 50000'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.estimatedValue ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.estimatedValue && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.estimatedValue.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'طريقة التسليم المطلوبة *' : 'Required delivery method *'}
                </label>
                <select
                  {...register('preferredDeliveryMethod', { 
                    required: isRTL ? 'طريقة التسليم مطلوبة' : 'Delivery method is required'
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.preferredDeliveryMethod ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <option value="">{isRTL ? 'اختر طريقة التسليم' : 'Select delivery method'}</option>
                  <option value="door-to-door">{isRTL ? 'Door to Door' : 'Door to Door'}</option>
                  <option value="port-to-port">{isRTL ? 'Port to Port' : 'Port to Port'}</option>
                  <option value="cif">{isRTL ? 'CIF' : 'CIF'}</option>
                  <option value="fob">{isRTL ? 'FOB' : 'FOB'}</option>
                </select>
                {errors.preferredDeliveryMethod && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.preferredDeliveryMethod.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" dir={isRTL ? "rtl" : "ltr"}>
              {isRTL ? 'الخدمات الإضافية' : 'Additional Services'}
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('insuranceNeeded')}
                  className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'هل تحتاج تأمين على الشحنة؟' : 'Do you need insurance for the shipment?'}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('trackingNeeded')}
                  className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'هل تحتاج تتبع مباشر للشحنة؟' : 'Do you need real-time tracking for the shipment?'}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('doorToDoor')}
                  className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'هل تحتاج خدمة توصيل حتى باب العميل؟' : 'Do you need door-to-door delivery service?'}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('customsAgent')}
                  className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'هل لديك وكيل تخليص جمركي خاص بك؟' : 'Do you have your own customs clearance agent?'}
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                {isRTL ? 'موعد الشحن المطلوب' : 'Required shipping date'}
              </label>
              <select
                {...register('shippingUrgency')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <option value="normal">{isRTL ? 'عادي' : 'Normal'}</option>
                <option value="urgent">{isRTL ? 'مستعجل' : 'Urgent'}</option>
              </select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" dir={isRTL ? "rtl" : "ltr"}>
              {isRTL ? 'معلومات إضافية' : 'Additional Information'}
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                {isRTL ? 'كيف سمعت عن خدماتنا؟' : 'How did you hear about our services?'}
              </label>
              <select
                {...register('heardAboutUs')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <option value="">{isRTL ? 'اختر...' : 'Select...'}</option>
                <option value="google">{isRTL ? 'جوجل' : 'Google'}</option>
                <option value="facebook">{isRTL ? 'فيسبوك' : 'Facebook'}</option>
                <option value="instagram">{isRTL ? 'انستقرام' : 'Instagram'}</option>
                <option value="twitter">{isRTL ? 'تويتر' : 'Twitter'}</option>
                <option value="friend">{isRTL ? 'صديق' : 'Friend'}</option>
                <option value="other">{isRTL ? 'أخرى' : 'Other'}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                {isRTL ? 'ملاحظات إضافية' : 'Additional notes'}
              </label>
              <textarea
                {...register('notes')}
                rows={4}
                placeholder={isRTL ? 'أي معلومات إضافية تريد مشاركتها معنا...' : 'Any additional information you want to share with us...'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2" dir={isRTL ? "rtl" : "ltr"}>
              {isRTL ? 'طلب خدمة الشحن واللوجستيات' : 'Logistics & Shipping Service Request'}
            </h1>
            <p className="text-gray-600" dir={isRTL ? "rtl" : "ltr"}>
              {isRTL ? 'املأ النموذج أدناه وسنقوم بالتواصل معك قريباً' : 'Fill out the form below and we will contact you soon'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700" dir={isRTL ? "rtl" : "ltr"}>
                {isRTL ? `الخطوة ${step} من 5` : `Step ${step} of 5`}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((step / 5) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" dir={isRTL ? "rtl" : "ltr"}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={prev}
                disabled={step === 1}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {isRTL ? 'السابق' : 'Previous'}
              </button>
              
              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {isRTL ? 'التالي' : 'Next'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={submitting}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {submitting ? (isRTL ? 'جاري الإرسال...' : 'Submitting...') : (isRTL ? 'إرسال الطلب' : 'Submit Request')}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}