"use client";

import { Service } from "@/hooks/useServices";
import { useLanguage } from "@/contexts/LanguageContext";
// Removed runtime translation; data comes localized from API.

interface ServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

// Service Status Badge Component
function ServiceStatusBadge({ status }: { status: 'active' | 'inactive' }) {
  const { language } = useLanguage();
  
  const isActive = status === 'active';
  const text = isActive ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive');
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      }`}
    >
      {text}
    </span>
  );
}

export default function ServiceModal({ 
  service, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}: ServiceModalProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  if (!isOpen || !service) return null;

  const pick = (val: any) =>
    typeof val === 'object' && val !== null
      ? (val as any)[language] || (val as any).ar || (val as any).en || ''
      : val;

  const translatedService = {
    name: pick(service.name),
    description: pick(service.description),
    features: Array.isArray(service.features)
      ? service.features.map((f: any) => (typeof f === 'object' ? pick(f) : f))
      : [],
  };

  const texts = {
    ar: {
      title: 'تفاصيل الخدمة',
      name: 'اسم الخدمة',
      description: 'وصف الخدمة',
      features: 'مميزات الخدمة',
      status: 'الحالة',
      order: 'الترتيب',
      createdAt: 'تاريخ الإنشاء',
      updatedAt: 'آخر تحديث',
      edit: 'تعديل',
      delete: 'حذف',
      close: 'إغلاق',
      noFeatures: 'لا توجد مميزات محددة',
    },
    en: {
      title: 'Service Details',
      name: 'Service Name',
      description: 'Service Description',
      features: 'Service Features',
      status: 'Status',
      order: 'Order',
      createdAt: 'Created At',
      updatedAt: 'Last Updated',
      edit: 'Edit',
      delete: 'Delete',
      close: 'Close',
      noFeatures: 'No features specified',
    },
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

          {/* Service Details */}
          <div className="space-y-6">
            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {texts[language].name}
              </label>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {translatedService.name}
              </p>
            </div>

            {/* Service Description */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {texts[language].description}
              </label>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {translatedService.description}
              </p>
            </div>

            {/* Service Features */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {texts[language].features} ({translatedService.features.length})
              </label>
              {translatedService.features.length > 0 ? (
                <ul className="space-y-2">
                  {translatedService.features.map((feature: any, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 dark:text-blue-400 mr-2 mt-1">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  {texts[language].noFeatures}
                </p>
              )}
            </div>

            {/* Status and Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {texts[language].status}
                </label>
                <ServiceStatusBadge status={service.status} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {texts[language].order}
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {service.order}
                </p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {texts[language].createdAt}
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(service.createdAt)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {texts[language].updatedAt}
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(service.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {texts[language].close}
            </button>
            <button
              onClick={() => onEdit(service)}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {texts[language].edit}
            </button>
            <button
              onClick={() => onDelete(service)}
              className="px-4 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {texts[language].delete}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
