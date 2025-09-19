"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { requestsAPI } from "@/lib/axios";
import { mapExportData } from "@/lib/requestMappers";
import { PRODUCT_CATEGORIES } from "@/lib/constants/productCategories";

type ServiceDetails = {
  _id: string
  name: string
  description?: string
}

type Step = 1 | 2 | 3 | 4 | 5;

export default function ExportForm() {
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
    
    // الخطوة 2: بيانات المنتج
    productType: string;
    productDetails: string;
    availableQuantity: string;
    productionCapacity: string;
    
    // الخطوة 3: بيانات التصدير
    exportCountry: string;
    destinationCountry: string;
    destinationCity: string;
    shippingPort: string;
    preferredShippingMethod: string;
    preferredDeliveryMethod: string;
    shippingDate: string;
    estimatedValue: string;
    
    // الخطوة 4: الشهادات والجودة
    qualityCertificates: boolean;
    qualityCertificatesDetails: string;
    packagingServices: boolean;
    findImporters: boolean;
    
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
      productType: '',
      productDetails: '',
      availableQuantity: '',
      productionCapacity: '',
      exportCountry: '',
      destinationCountry: '',
      destinationCity: '',
      shippingPort: '',
      preferredShippingMethod: '',
      preferredDeliveryMethod: '',
      shippingDate: '',
      estimatedValue: '',
      qualityCertificates: false,
      qualityCertificatesDetails: '',
      packagingServices: false,
      findImporters: false,
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
      const ok = await trigger(["productType", "productDetails", "availableQuantity", "productionCapacity"]);
      if (!ok) {
        setFocus("productType");
        return { message: isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields" };
      }
    } else if (s === 3) {
      const ok = await trigger(["exportCountry", "destinationCountry", "destinationCity", "shippingPort", "preferredShippingMethod", "preferredDeliveryMethod", "estimatedValue"]);
      if (!ok) {
        setFocus("exportCountry");
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
      const requestData = mapExportData(
        {
          ...vals,
          productSpecifications: vals.productDetails,
          estimatedQuantity: vals.availableQuantity,
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
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
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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
                  {isRTL ? 'رقم الهاتف (واتساب) *' : 'Phone Number (WhatsApp) *'}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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
              {isRTL ? 'بيانات المنتج' : 'Product Information'}
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                {isRTL ? 'نوع المنتج الذي ترغب في تصديره *' : 'Type of product you want to export *'}
              </label>
              <select
                {...register('productType', { required: isRTL ? 'نوع المنتج مطلوب' : 'Product type is required' })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                {isRTL ? 'تفاصيل المنتج (الخامة – التغليف – الشهادات المتوفرة مثل ISO/CE/FDA) *' : 'Product details (materials – packaging – available certificates like ISO/CE/FDA) *'}
              </label>
              <textarea
                {...register('productDetails', { 
                  required: isRTL ? 'تفاصيل المنتج مطلوبة' : 'Product details are required',
                  minLength: { value: 10, message: isRTL ? 'تفاصيل المنتج يجب أن تكون 10 أحرف على الأقل' : 'Product details must be at least 10 characters' }
                })}
                rows={4}
                placeholder={isRTL ? 'اذكر تفاصيل المنتج والمواد الخام المستخدمة وشهادات الجودة المتوفرة...' : 'Describe product details, materials used, and available quality certificates...'}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.productDetails ? 'border-red-500' : 'border-gray-300'
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              />
              {errors.productDetails && (
                <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                  {errors.productDetails.message}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'الكمية المتاحة للتصدير *' : 'Available quantity for export *'}
                </label>
                <input
                  type="text"
                  {...register('availableQuantity', { 
                    required: isRTL ? 'الكمية المتاحة مطلوبة' : 'Available quantity is required',
                    pattern: {
                      value: /^[0-9]+$/,
                      message: isRTL ? 'الكمية يجب أن تكون أرقام فقط' : 'Quantity must be numbers only'
                    }
                  })}
                  placeholder={isRTL ? 'مثال: 5000 كيلو شهرياً' : 'Example: 5000 kg monthly'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.availableQuantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.availableQuantity && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.availableQuantity.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'القدرة الإنتاجية الشهرية أو السنوية *' : 'Monthly or annual production capacity *'}
                </label>
                <input
                  type="text"
                  {...register('productionCapacity', { 
                    required: isRTL ? 'القدرة الإنتاجية مطلوبة' : 'Production capacity is required',
                    minLength: { value: 2, message: isRTL ? 'القدرة الإنتاجية يجب أن تكون حرفين على الأقل' : 'Production capacity must be at least 2 characters' }
                  })}
                  placeholder={isRTL ? 'مثال: 10000 وحدة شهرياً' : 'Example: 10000 units monthly'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.productionCapacity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.productionCapacity && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.productionCapacity.message}
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
              {isRTL ? 'بيانات التصدير' : 'Export Information'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'بلد التصدير *' : 'Export country *'}
                </label>
                <input
                  type="text"
                  {...register('exportCountry', { 
                    required: isRTL ? 'بلد التصدير مطلوب' : 'Export country is required',
                    minLength: { value: 2, message: isRTL ? 'اسم الدولة يجب أن يكون حرفين على الأقل' : 'Country name must be at least 2 characters' }
                  })}
                  placeholder={isRTL ? 'مثال: السعودية، الإمارات...' : 'Example: Saudi Arabia, UAE...'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.exportCountry ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.exportCountry && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.exportCountry.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'الدولة المستهدف التصدير إليها *' : 'Target country for export *'}
                </label>
                <input
                  type="text"
                  {...register('destinationCountry', { 
                    required: isRTL ? 'دولة الوجهة مطلوبة' : 'Destination country is required',
                    minLength: { value: 2, message: isRTL ? 'اسم الدولة يجب أن يكون حرفين على الأقل' : 'Country name must be at least 2 characters' }
                  })}
                  placeholder={isRTL ? 'مثال: الإمارات، الكويت، مصر...' : 'Example: UAE, Kuwait, Egypt...'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.destinationCountry ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.destinationCountry && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.destinationCountry.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'المدينة/الميناء المستهدف *' : 'Target city/port *'}
                </label>
                <input
                  type="text"
                  {...register('destinationCity', { 
                    required: isRTL ? 'المدينة/الميناء مطلوب' : 'City/port is required',
                    minLength: { value: 2, message: isRTL ? 'اسم المدينة/الميناء يجب أن يكون حرفين على الأقل' : 'City/port name must be at least 2 characters' }
                  })}
                  placeholder={isRTL ? 'مثال: دبي، الكويت، القاهرة...' : 'Example: Dubai, Kuwait, Cairo...'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.destinationCity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.destinationCity && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.destinationCity.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'ميناء الشحن في بلدك *' : 'Shipping port in your country *'}
                </label>
                <input
                  type="text"
                  {...register('shippingPort', { 
                    required: isRTL ? 'ميناء الشحن مطلوب' : 'Shipping port is required',
                    minLength: { value: 2, message: isRTL ? 'اسم الميناء يجب أن يكون حرفين على الأقل' : 'Port name must be at least 2 characters' }
                  })}
                  placeholder={isRTL ? 'مثال: ميناء جدة، ميناء الدمام...' : 'Example: Jeddah Port, Dammam Port...'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.shippingPort ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.shippingPort && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.shippingPort.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'طريقة الشحن المفضلة *' : 'Preferred shipping method *'}
                </label>
                <select
                  {...register('preferredShippingMethod', { 
                    required: isRTL ? 'طريقة الشحن مطلوبة' : 'Shipping method is required'
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.preferredShippingMethod ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <option value="">{isRTL ? 'اختر طريقة الشحن' : 'Select shipping method'}</option>
                  <option value="sea">{isRTL ? 'بحري' : 'Sea'}</option>
                  <option value="air">{isRTL ? 'جوي' : 'Air'}</option>
                  <option value="land">{isRTL ? 'بري' : 'Land'}</option>
                </select>
                {errors.preferredShippingMethod && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.preferredShippingMethod.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'طريقة التسليم المفضلة *' : 'Preferred delivery method *'}
                </label>
                <select
                  {...register('preferredDeliveryMethod', { 
                    required: isRTL ? 'طريقة التسليم مطلوبة' : 'Delivery method is required'
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.preferredDeliveryMethod ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <option value="">{isRTL ? 'اختر طريقة التسليم' : 'Select delivery method'}</option>
                  <option value="cif">{isRTL ? 'CIF' : 'CIF'}</option>
                  <option value="fob">{isRTL ? 'FOB' : 'FOB'}</option>
                  <option value="door-to-door">{isRTL ? 'Door to Door' : 'Door to Door'}</option>
                </select>
                {errors.preferredDeliveryMethod && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.preferredDeliveryMethod.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'القيمة التقديرية للشحنة *' : 'Estimated shipment value *'}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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
                  {isRTL ? 'هل لديك خطة زمنية محددة للشحن؟' : 'Do you have a specific shipping timeline?'}
                </label>
                <input
                  type="date"
                  {...register('shippingDate')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" dir={isRTL ? "rtl" : "ltr"}>
              {isRTL ? 'الشهادات والجودة' : 'Certificates and Quality'}
            </h2>
            
            <div>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  {...register('qualityCertificates')}
                  className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'هل لديك شهادات جودة أو مواصفات خاصة للتصدير؟' : 'Do you have quality certificates or special specifications for export?'}
                </label>
              </div>
              
              {watch('qualityCertificates') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                    {isRTL ? 'اذكر التفاصيل' : 'Please provide details'}
                  </label>
                  <textarea
                    {...register('qualityCertificatesDetails')}
                    rows={3}
                    placeholder={isRTL ? 'اذكر الشهادات المتوفرة مثل ISO, CE, FDA...' : 'Mention available certificates like ISO, CE, FDA...'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('packagingServices')}
                  className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'هل تحتاج خدمات تغليف أو تخزين إضافية؟' : 'Do you need additional packaging or storage services?'}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('findImporters')}
                  className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'هل تحتاج مساعدتنا في إيجاد مستوردين محتملين؟' : 'Do you need our help finding potential importers?'}
                </label>
              </div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              {isRTL ? 'طلب خدمة التصدير' : 'Export Service Request'}
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
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
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
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {isRTL ? 'التالي' : 'Next'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={submitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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