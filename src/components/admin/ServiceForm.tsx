"use client";

import { useState, useEffect } from "react";
import { useAdminServices, Service } from "@/hooks/useServices";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateService, createServiceWithTranslations } from "@/lib/translationService";

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
    name: "",
    description: "",
    features: [""],
    status: "active" as "active" | "inactive",
    order: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with service data if editing, or reset if creating new
  useEffect(() => {
    if (service) {
      // Editing existing service - translate the data for display
      const translatedService = translateService(service, language);
      setFormData({
        name: translatedService.name,
        description: translatedService.description,
        features: translatedService.features.length > 0 ? translatedService.features : [""],
        status: service.status,
        order: service.order,
      });
    } else {
      // Creating new service - reset form
      setFormData({
        name: "",
        description: "",
        features: [""],
        status: "active",
        order: 1,
      });
    }
    // Clear errors when form opens
    setErrors({});
  }, [service, isOpen, language]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = language === 'ar' ? 'اسم الخدمة مطلوب' : 'Service name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = language === 'ar' ? 'اسم الخدمة يجب أن يكون 3 أحرف على الأقل' : 'Service name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = language === 'ar' ? 'وصف الخدمة مطلوب' : 'Service description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = language === 'ar' ? 'وصف الخدمة يجب أن يكون 10 أحرف على الأقل' : 'Service description must be at least 10 characters';
    }

    const validFeatures = formData.features.filter(f => f.trim().length > 0);
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

    const validFeatures = formData.features.filter(f => f.trim().length > 0);
    
    let result;
    if (isEditing && service) {
      // For editing, send the data as is (API will handle translation)
      const submitData = {
        ...formData,
        features: validFeatures,
      };
      result = await updateService(service._id, submitData);
    } else {
      // For creating new service, use translation service
      try {
        const translatedService = await createServiceWithTranslations({
          name: formData.name,
          description: formData.description,
          features: validFeatures,
          status: formData.status,
          order: formData.order,
        });
        
        // Send the translated service data directly to API
        result = await createService(translatedService);
      } catch (error) {
        console.error('Translation failed:', error);
        // Fallback to regular creation
        const submitData = {
          ...formData,
          features: validFeatures,
        };
        result = await createService(submitData);
      }
    }

    if (result.success) {
      onSuccess();
      onClose();
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""],
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
            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {texts[language].name} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={texts[language].namePlaceholder}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Service Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {texts[language].description} *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={texts[language].descriptionPlaceholder}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
              )}
            </div>

            {/* Service Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {texts[language].features} *
              </label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`${texts[language].featurePlaceholder} ${index + 1}`}
                      className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.features ? 'border-red-500' : 'border-gray-300'
                      }`}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        {texts[language].removeFeature}
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
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
