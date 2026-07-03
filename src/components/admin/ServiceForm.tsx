"use client";

import { useState, useEffect } from "react";
import { useAdminServices, Service } from "@/hooks/useServices";
import { useLanguage } from "@/contexts/LanguageContext";
// Runtime translation removed; optional server-side translate-on-write can be added later.

interface ServiceFormProps {
  service?: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ServiceForm({ service, isOpen, onClose, onSuccess }: ServiceFormProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const isEditing = !!service;

  const { createService, updateService, loading } = useAdminServices();

  const [formData, setFormData] = useState({
    name: { ar: "", en: "" },
    description: { ar: "", en: "" },
    features: [{ ar: "", en: "" }],
    status: "active" as "active" | "inactive",
    order: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);

  // Translation function using Google Translate API
  const translateText = async (text: string, from: string, to: string): Promise<string> => {
    try {
      // Using Google Translate API (free tier)
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`);
      const data = await response.json();
      return data[0][0][0] || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  };

  // Auto-translate function
  const handleAutoTranslate = async () => {
    if (isTranslating) return;
    
    setIsTranslating(true);
    try {
      // Translate from current language to the other
      const fromLang = language;
      const toLang = language === 'ar' ? 'en' : 'ar';
      
      // Translate name
      if (formData.name[fromLang].trim()) {
        const translatedName = await translateText(formData.name[fromLang], fromLang, toLang);
        setFormData(prev => ({
          ...prev,
          name: { ...prev.name, [toLang]: translatedName }
        }));
      }
      
      // Translate description
      if (formData.description[fromLang].trim()) {
        const translatedDesc = await translateText(formData.description[fromLang], fromLang, toLang);
        setFormData(prev => ({
          ...prev,
          description: { ...prev.description, [toLang]: translatedDesc }
        }));
      }
      
      // Translate features
      const translatedFeatures = await Promise.all(
        formData.features.map(async (feature) => {
          if (feature[fromLang].trim()) {
            const translated = await translateText(feature[fromLang], fromLang, toLang);
            return { ...feature, [toLang]: translated };
          }
          return feature;
        })
      );
      
      setFormData(prev => ({
        ...prev,
        features: translatedFeatures
      }));
      
    } catch (error) {
      console.error('Auto-translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // Initialize form with service data if editing, or reset if creating new
  useEffect(() => {
    if (service) {
      // Editing existing service - extract both languages
      const extractLangData = (val: any) => {
        if (typeof val === 'object' && val !== null) {
          return {
            ar: val.ar || '',
            en: val.en || ''
          };
        }
        return { ar: val || '', en: val || '' };
      };
      
      setFormData({
        name: extractLangData(service.name),
        description: extractLangData(service.description),
        features: Array.isArray(service.features)
          ? service.features.map((f: any) => extractLangData(f))
          : [{ ar: "", en: "" }],
        status: service.status,
        order: service.order,
      });
    } else {
      // Creating new service - reset form
      setFormData({
        name: { ar: "", en: "" },
        description: { ar: "", en: "" },
        features: [{ ar: "", en: "" }],
        status: "active",
        order: 1,
      });
    }
    // Clear errors when form opens
    setErrors({});
  }, [service, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Check if at least one language has content for name
    if (!formData.name.ar.trim() && !formData.name.en.trim()) {
      newErrors.name = language === 'ar' ? 'اسم الخدمة مطلوب (عربي أو إنجليزي)' : 'Service name is required (Arabic or English)';
    } else if (formData.name.ar.trim().length < 3 && formData.name.en.trim().length < 3) {
      newErrors.name = language === 'ar' ? 'اسم الخدمة يجب أن يكون 3 أحرف على الأقل' : 'Service name must be at least 3 characters';
    }

    // Check if at least one language has content for description
    if (!formData.description.ar.trim() && !formData.description.en.trim()) {
      newErrors.description = language === 'ar' ? 'وصف الخدمة مطلوب (عربي أو إنجليزي)' : 'Service description is required (Arabic or English)';
    } else if (formData.description.ar.trim().length < 10 && formData.description.en.trim().length < 10) {
      newErrors.description = language === 'ar' ? 'وصف الخدمة يجب أن يكون 10 أحرف على الأقل' : 'Service description must be at least 10 characters';
    }

    // Check features - at least one feature with content in any language
    const validFeatures = formData.features.filter(f => f.ar.trim().length > 0 || f.en.trim().length > 0);
    if (validFeatures.length === 0) {
      newErrors.features = language === 'ar' ? 'يجب إضافة مميزة واحدة على الأقل' : 'At least one feature is required';
    }

    if (formData.order < 1) {
      newErrors.order = language === 'ar' ? 'الترتيب يجب أن يكون أكبر من 0' : 'Order must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Filter out empty features
    const validFeatures = formData.features.filter(f => f.ar.trim().length > 0 || f.en.trim().length > 0);
    
    let result;
    if (isEditing && service) {
      // For editing, send the multilingual data
      const submitData = {
        name: formData.name,
        description: formData.description,
        features: validFeatures,
        status: formData.status,
        order: formData.order,
      };
      result = await updateService(service._id, submitData);
    } else {
      // Creating new service: send multilingual data
      const submitData = {
        name: formData.name,
        description: formData.description,
        features: validFeatures,
        status: formData.status,
        order: formData.order,
      };
      result = await createService(submitData);
    }

    if (result.success) {
      onSuccess();
      onClose();
    }
  };

  const handleFeatureChange = (index: number, lang: 'ar' | 'en', value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [lang]: value };
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { ar: "", en: "" }],
    });
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData({ ...formData, features: newFeatures });
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  const texts = {
    ar: {
      title: isEditing ? 'تعديل الخدمة' : 'إضافة خدمة جديدة',
      name: 'اسم الخدمة',
      description: 'وصف الخدمة',
      features: 'مميزات الخدمة',
      status: 'الحالة',
      order: 'الترتيب',
      active: 'نشط',
      inactive: 'غير نشط',
      addFeature: 'إضافة مميزة',
      removeFeature: 'حذف',
      save: isEditing ? 'حفظ التعديلات' : 'إنشاء الخدمة',
      cancel: 'إلغاء',
      namePlaceholder: 'أدخل اسم الخدمة...',
      descriptionPlaceholder: 'أدخل وصف الخدمة...',
      featurePlaceholder: 'أدخل المميزة...',
      autoTranslate: 'ترجمة تلقائية',
      translating: 'جاري الترجمة...',
      arabic: 'عربي',
      english: 'إنجليزي',
    },
    en: {
      title: isEditing ? 'Edit Service' : 'Add New Service',
      name: 'Service Name',
      description: 'Service Description',
      features: 'Service Features',
      status: 'Status',
      order: 'Order',
      active: 'Active',
      inactive: 'Inactive',
      addFeature: 'Add Feature',
      removeFeature: 'Remove',
      save: isEditing ? 'Save Changes' : 'Create Service',
      cancel: 'Cancel',
      namePlaceholder: 'Enter service name...',
      descriptionPlaceholder: 'Enter service description...',
      featurePlaceholder: 'Enter feature...',
      autoTranslate: 'Auto Translate',
      translating: 'Translating...',
      arabic: 'Arabic',
      english: 'English',
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {texts[language].title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Auto Translate Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAutoTranslate}
                disabled={isTranslating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isTranslating ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {texts[language].translating}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    {texts[language].autoTranslate}
                  </>
                )}
              </button>
            </div>

            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {texts[language].name} *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Arabic Name */}
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {texts[language].arabic}
                  </label>
                  <input
                    type="text"
                    value={formData.name.ar}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, ar: e.target.value } })}
                    placeholder={texts[language].namePlaceholder}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    dir="rtl"
                  />
                </div>
                {/* English Name */}
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {texts[language].english}
                  </label>
                  <input
                    type="text"
                    value={formData.name.en}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                    placeholder={texts[language].namePlaceholder}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    dir="ltr"
                  />
                </div>
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Service Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {texts[language].description} *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Arabic Description */}
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {texts[language].arabic}
                  </label>
                  <textarea
                    value={formData.description.ar}
                    onChange={(e) => setFormData({ ...formData, description: { ...formData.description, ar: e.target.value } })}
                    placeholder={texts[language].descriptionPlaceholder}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    dir="rtl"
                  />
                </div>
                {/* English Description */}
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {texts[language].english}
                  </label>
                  <textarea
                    value={formData.description.en}
                    onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                    placeholder={texts[language].descriptionPlaceholder}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    dir="ltr"
                  />
                </div>
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
              )}
            </div>

            {/* Service Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {texts[language].features} *
              </label>
              <div className="space-y-4">
                {formData.features.map((feature, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Arabic Feature */}
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {texts[language].arabic} - {texts[language].featurePlaceholder} {index + 1}
                        </label>
                        <input
                          type="text"
                          value={feature.ar}
                          onChange={(e) => handleFeatureChange(index, 'ar', e.target.value)}
                          placeholder={texts[language].featurePlaceholder}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors.features ? 'border-red-500' : 'border-gray-300'
                          }`}
                          dir="rtl"
                        />
                      </div>
                      {/* English Feature */}
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {texts[language].english} - {texts[language].featurePlaceholder} {index + 1}
                        </label>
                        <input
                          type="text"
                          value={feature.en}
                          onChange={(e) => handleFeatureChange(index, 'en', e.target.value)}
                          placeholder={texts[language].featurePlaceholder}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors.features ? 'border-red-500' : 'border-gray-300'
                          }`}
                          dir="ltr"
                        />
                      </div>
                    </div>
                    {formData.features.length > 1 && (
                      <div className="flex justify-end mt-2">
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="px-3 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
                        >
                          {texts[language].removeFeature}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium border border-dashed border-gray-300 dark:border-gray-600 rounded-lg w-full"
                >
                  + {texts[language].addFeature}
                </button>
              </div>
              {errors.features && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.features}</p>
              )}
            </div>

            {/* Status and Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {texts[language].status}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="active">{texts[language].active}</option>
                  <option value="inactive">{texts[language].inactive}</option>
                </select>
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {texts[language].order}
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.order ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.order && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.order}</p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {texts[language].cancel}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                  </div>
                ) : (
                  texts[language].save
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
