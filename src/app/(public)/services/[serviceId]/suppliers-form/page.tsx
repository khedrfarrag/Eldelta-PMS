"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { requestsAPI } from "@/lib/axios";
import { mapSuppliersData } from "@/lib/requestMappers";
import { PRODUCT_CATEGORIES } from "@/lib/constants/productCategories";

type ServiceDetails = {
  _id: string
  name: string
  description?: string
}

type Step = 1 | 2 | 3 | 4 | 5;

export default function SuppliersForm() {
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
    
    // الخطوة 2: نوع البحث
    searchType: 'supplier' | 'importer';
    productType: string;
    productDetails: string;
    expectedQuantity: string;
    preferredCountry: string;
    
    // الخطوة 3: الخبرة والجودة
    hasExistingPartners: boolean;
    existingPartnersDetails: string;
    qualityLevel: 'normal' | 'medium' | 'high' | 'world_class';
    
    // الخطوة 4: الخدمات المطلوبة
    factoryVisits: boolean;
    negotiationServices: boolean;
    productionSupervision: boolean;
    samples: boolean;
    cooperationTiming: 'immediate' | 'one_month' | 'three_months';
    
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
      searchType: 'supplier',
      productType: '',
      productDetails: '',
      expectedQuantity: '',
      preferredCountry: '',
      hasExistingPartners: false,
      existingPartnersDetails: '',
      qualityLevel: 'normal',
      factoryVisits: false,
      negotiationServices: false,
      productionSupervision: false,
      samples: false,
      cooperationTiming: 'immediate',
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
          setService({ _id: data.service._id, name: data.service.name, description: data.service.description })
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
      const ok = await trigger(["searchType", "productType", "productDetails", "expectedQuantity", "preferredCountry"]);
      if (!ok) {
        setFocus("productType");
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
      const requestData = mapSuppliersData(
        {
          ...vals,
          productSpecifications: vals.productDetails,
          expectedQuantity: vals.expectedQuantity,
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-800 dark:text-gray-200" dir={isRTL ? "rtl" : "ltr"}>
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
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4" dir={isRTL ? "rtl" : "ltr"}>
            {isRTL ? 'تم إرسال طلبك بنجاح!' : 'Request submitted successfully!'}
          </h2>
          <p className="text-gray-800 dark:text-gray-200 mb-6" dir={isRTL ? "rtl" : "ltr"}>
            {isRTL ? 'سيتم التواصل معك قريباً لتأكيد التفاصيل' : 'We will contact you soon to confirm the details'}
          </p>
          <button
            onClick={() => router.push('/services')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
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
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  {...register('customerName', { 
                    required: isRTL ? 'الاسم الكامل مطلوب' : 'Full name is required',
                    minLength: { value: 2, message: isRTL ? 'الاسم يجب أن يكون حرفين على الأقل' : 'Name must be at least 2 characters' }
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
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
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'اسم الشركة / النشاط التجاري *' : 'Company / Business Name *'}
                </label>
                <input
                  type="text"
                  {...register('companyName', { 
                    required: isRTL ? 'اسم الشركة مطلوب' : 'Company name is required',
                    minLength: { value: 2, message: isRTL ? 'اسم الشركة يجب أن يكون حرفين على الأقل' : 'Company name must be at least 2 characters' }
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
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
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2" dir={isRTL ? "rtl" : "ltr"}>
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
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
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2" dir={isRTL ? "rtl" : "ltr"}>
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
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
              {isRTL ? 'نوع البحث' : 'Search Type'}
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3" dir={isRTL ? "rtl" : "ltr"}>
                {isRTL ? 'تبحث عن *' : 'Looking for *'}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="supplier"
                    {...register('searchType', { 
                      required: isRTL ? 'نوع البحث مطلوب' : 'Search type is required'
                    })}
                    className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <div>
                    <div className="font-medium text-gray-900" dir={isRTL ? "rtl" : "ltr"}>
                      {isRTL ? 'مورد' : 'Supplier'}
                    </div>
                    <div className="text-sm text-gray-500" dir={isRTL ? "rtl" : "ltr"}>
                      {isRTL ? 'البحث عن موردين للمنتجات' : 'Looking for product suppliers'}
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="importer"
                    {...register('searchType', { 
                      required: isRTL ? 'نوع البحث مطلوب' : 'Search type is required'
                    })}
                    className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <div>
                    <div className="font-medium text-gray-900" dir={isRTL ? "rtl" : "ltr"}>
                      {isRTL ? 'مستورد' : 'Importer'}
                    </div>
                    <div className="text-sm text-gray-500" dir={isRTL ? "rtl" : "ltr"}>
                      {isRTL ? 'البحث عن مستوردين للمنتجات' : 'Looking for product importers'}
                    </div>
                  </div>
                </label>
              </div>
              {errors.searchType && (
                <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                  {errors.searchType.message}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                {isRTL ? 'نوع المنتج أو المجال المطلوب *' : 'Required product type or field *'}
              </label>
              <select
                {...register('productType', { required: isRTL ? 'نوع المنتج مطلوب' : 'Product type is required' })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
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
                {isRTL ? 'تفاصيل المنتج (مواصفات – مستوى الجودة – الفئة السعرية) *' : 'Product details (specifications – quality level – price range) *'}
              </label>
              <textarea
                {...register('productDetails', { 
                  required: isRTL ? 'تفاصيل المنتج مطلوبة' : 'Product details are required',
                  minLength: { value: 10, message: isRTL ? 'تفاصيل المنتج يجب أن تكون 10 أحرف على الأقل' : 'Product details must be at least 10 characters' }
                })}
                rows={4}
                placeholder={isRTL ? 'اذكر المواصفات المطلوبة ومستوى الجودة والفئة السعرية...' : 'Describe required specifications, quality level, and price range...'}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
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
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'الكمية أو حجم الطلب المتوقع *' : 'Expected quantity or order size *'}
                </label>
                <input
                  type="text"
                  {...register('expectedQuantity', { 
                    required: isRTL ? 'الكمية المتوقعة مطلوبة' : 'Expected quantity is required',
                    minLength: { value: 2, message: isRTL ? 'الكمية يجب أن تكون حرفين على الأقل' : 'Quantity must be at least 2 characters' }
                  })}
                  placeholder={isRTL ? 'مثال: 1000 وحدة شهرياً' : 'Example: 1000 units monthly'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.expectedQuantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.expectedQuantity && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.expectedQuantity.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'البلد المفضل للتوريد أو التصدير *' : 'Preferred country for supply or export *'}
                </label>
                <input
                  type="text"
                  {...register('preferredCountry', { 
                    required: isRTL ? 'البلد المفضل مطلوب' : 'Preferred country is required',
                    minLength: { value: 2, message: isRTL ? 'اسم البلد يجب أن يكون حرفين على الأقل' : 'Country name must be at least 2 characters' }
                  })}
                  placeholder={isRTL ? 'مثال: الصين، تركيا، ألمانيا...' : 'Example: China, Turkey, Germany...'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.preferredCountry ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.preferredCountry && (
                  <p className="mt-1 text-sm text-red-600" dir={isRTL ? "rtl" : "ltr"}>
                    {errors.preferredCountry.message}
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
              {isRTL ? 'الخبرة والجودة' : 'Experience and Quality'}
            </h2>
            
            <div>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  {...register('hasExistingPartners')}
                  className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'هل لديك موردين أو مستوردين تتعامل معهم بالفعل؟' : 'Do you have existing suppliers or importers you work with?'}
                </label>
              </div>
              
              {watch('hasExistingPartners') && (
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                    {isRTL ? 'اذكر التفاصيل' : 'Please provide details'}
                  </label>
                  <textarea
                    {...register('existingPartnersDetails')}
                    rows={3}
                    placeholder={isRTL ? 'اذكر أسماء الشركات التي تتعامل معها حالياً...' : 'Mention the names of companies you currently work with...'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                {isRTL ? 'مستوى الجودة المطلوب' : 'Required quality level'}
              </label>
              <select
                {...register('qualityLevel')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <option value="normal">{isRTL ? 'عادي' : 'Normal'}</option>
                <option value="medium">{isRTL ? 'متوسط' : 'Medium'}</option>
                <option value="high">{isRTL ? 'عالي' : 'High'}</option>
                <option value="world_class">{isRTL ? 'عالمي' : 'World Class'}</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" dir={isRTL ? "rtl" : "ltr"}>
              {isRTL ? 'الخدمات المطلوبة' : 'Required Services'}
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('factoryVisits')}
                  className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'هل تحتاج زيارات مصانع أو تحقق ميداني؟' : 'Do you need factory visits or field verification?'}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('negotiationServices')}
                  className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'هل تحتاج خدمات تفاوض أو ترجمة؟' : 'Do you need negotiation or translation services?'}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('productionSupervision')}
                  className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'هل تحتاج إشراف على الإنتاج أو فحص جودة؟' : 'Do you need production supervision or quality inspection?'}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('samples')}
                  className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? 'هل تحتاج عينات قبل التعاقد؟' : 'Do you need samples before contracting?'}
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                {isRTL ? 'متى ترغب ببدء التعاون' : 'When do you want to start cooperation'}
              </label>
              <select
                {...register('cooperationTiming')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <option value="immediate">{isRTL ? 'فوري' : 'Immediate'}</option>
                <option value="one_month">{isRTL ? 'خلال شهر' : 'Within a month'}</option>
                <option value="three_months">{isRTL ? 'خلال 3 شهور' : 'Within 3 months'}</option>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                {isRTL ? 'ملاحظات أو طلبات خاصة' : 'Notes or special requests'}
              </label>
              <textarea
                {...register('notes')}
                rows={4}
                placeholder={isRTL ? 'أي معلومات إضافية أو طلبات خاصة تريد مشاركتها معنا...' : 'Any additional information or special requests you want to share with us...'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2" dir={isRTL ? "rtl" : "ltr"}>
              {isRTL ? 'طلب خدمة توفير الموردين/المستوردين' : 'Suppliers/Importers Service Request'}
            </h1>
            <p className="text-gray-800 dark:text-gray-200" dir={isRTL ? "rtl" : "ltr"}>
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
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
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
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {isRTL ? 'التالي' : 'Next'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={submitting}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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