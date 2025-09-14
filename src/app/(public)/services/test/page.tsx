"use client";
import { useState, useEffect } from "react";
import { servicesAPI } from "@/lib/axios";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TestServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const isRTL = language === "ar";

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await servicesAPI.getAll();
        setServices(response.data.services || []);
      } catch (err: any) {
        setError(err.message || "خطأ في تحميل الخدمات");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">{isRTL ? "جاري التحميل..." : "Loading..."}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-4">{isRTL ? "خطأ" : "Error"}</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8" dir={isRTL ? "rtl" : "ltr"}>
          {isRTL ? "الخدمات المتاحة - للاختبار" : "Available Services - For Testing"}
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-3" dir={isRTL ? "rtl" : "ltr"}>
                {typeof service.name === 'string' 
                  ? service.name 
                  : service.name?.[language] || service.name?.ar || service.name?.en || 'Service'}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4" dir={isRTL ? "rtl" : "ltr"}>
                {typeof service.description === 'string' 
                  ? service.description 
                  : service.description?.[language] || service.description?.ar || service.description?.en || ''}
              </p>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? "الميزات:" : "Features:"}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm" dir={isRTL ? "rtl" : "ltr"}>
                  {service.features?.map((feature: any, index: number) => {
                    const featureText = typeof feature === 'string' 
                      ? feature 
                      : feature?.[language] || feature?.ar || feature?.en || '';
                    return (
                      <li key={index} className="text-gray-600 dark:text-gray-300">
                        {featureText}
                      </li>
                    );
                  })}
                </ul>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">
                  <strong>Service ID:</strong>
                </p>
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm break-all">
                  {service._id}
                </code>
                
                <div className="mt-3">
                  {(() => {
                    const getFormRoute = (serviceName: any) => {
                      // Handle both string and translation object formats
                      let name = '';
                      if (typeof serviceName === 'string') {
                        name = serviceName.toLowerCase();
                      } else if (serviceName && typeof serviceName === 'object') {
                        name = (serviceName.ar || serviceName.en || '').toLowerCase();
                      } else {
                        name = String(serviceName || '').toLowerCase();
                      }
                      
                      if (name.includes('استيراد') || name.includes('import')) {
                        return `/services/${service._id}/import-form`;
                      } else if (name.includes('تصدير') || name.includes('export')) {
                        return `/services/${service._id}/export-form`;
                      } else if (name.includes('شحن') || name.includes('نقل') || name.includes('logistics') || name.includes('لوجستي')) {
                        return `/services/${service._id}/logistics-form`;
                      } else if (name.includes('تخليص') || name.includes('جمرك') || name.includes('customs') || name.includes('مورد') || name.includes('مستورد')) {
                        return `/services/${service._id}/suppliers-form`;
                      }
                      return `/services/${service._id}/suppliers-form`;
                    };
                    
                    return (
                      <a
                        href={getFormRoute(service.name)}
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        {isRTL ? "ابدأ الطلب" : "Start Request"}
                      </a>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg" dir={isRTL ? "rtl" : "ltr"}>
              {isRTL ? "لا توجد خدمات متاحة" : "No services available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
