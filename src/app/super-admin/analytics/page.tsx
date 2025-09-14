"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";

type ServiceAnalytics = {
  byCountry: Array<{ country: string; count: number }>;
  byProductType: Array<{ product: string; count: number }>;
  byFrequency: Array<{ frequency: string; count: number }>;
  byShippingMethod: Array<{ method: string; count: number }>;
  byDestination: Array<{ destination: string; count: number }>;
  byProductionCapacity: Array<{ capacity: string; count: number }>;
  byRoute: Array<{ route: string; count: number }>;
  byCargoType: Array<{ cargo: string; count: number }>;
  byWeight: Array<{ weight: number; count: number }>;
  byShipmentType: Array<{ type: string; count: number }>;
  bySearchType: Array<{ type: string; count: number }>;
  byQualityLevel: Array<{ level: string; count: number }>;
  byCooperationTiming: Array<{ timing: string; count: number }>;
  totalValue: number;
  avgValue: number;
};

type AnalyticsResponse = {
  success: boolean;
  analytics: {
    import: ServiceAnalytics;
    export: ServiceAnalytics;
    logistics: ServiceAnalytics;
    suppliers: ServiceAnalytics;
  };
};

function AnalyticsCard({ title, data, type }: { title: string; data: any[]; type: string }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-500 text-center py-8">لا توجد بيانات متاحة</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-2">
        {data.slice(0, 10).map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <span className="text-sm text-gray-600">
              {type === 'country' ? item.country :
               type === 'product' ? item.product :
               type === 'frequency' ? item.frequency :
               type === 'method' ? item.method :
               type === 'destination' ? item.destination :
               type === 'capacity' ? item.capacity :
               type === 'route' ? item.route :
               type === 'cargo' ? item.cargo :
               type === 'weight' ? `${item.weight} كجم` :
               type === 'shipment' ? item.type :
               type === 'search' ? item.type :
               type === 'quality' ? item.level :
               type === 'timing' ? item.timing :
               item.name || item._id}
            </span>
            <span className="text-sm font-medium text-gray-900">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceAnalyticsSection({ 
  title, 
  analytics, 
  serviceType 
}: { 
  title: string; 
  analytics: ServiceAnalytics; 
  serviceType: string;
}) {
  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'import': return '📥';
      case 'export': return '📤';
      case 'logistics': return '🚚';
      case 'suppliers': return '🤝';
      default: return '📊';
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case 'import': return 'border-blue-200 bg-blue-50';
      case 'export': return 'border-green-200 bg-green-50';
      case 'logistics': return 'border-orange-200 bg-orange-50';
      case 'suppliers': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className={`border-2 rounded-xl p-6 ${getServiceColor(serviceType)}`}>
      <div className="flex items-center mb-6">
        <span className="text-3xl mr-3">{getServiceIcon(serviceType)}</span>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceType === 'import' && (
          <>
            <AnalyticsCard title="حسب البلد" data={analytics.byCountry} type="country" />
            <AnalyticsCard title="حسب نوع المنتج" data={analytics.byProductType} type="product" />
            <AnalyticsCard title="حسب التكرار" data={analytics.byFrequency} type="frequency" />
            <AnalyticsCard title="حسب طريقة الشحن" data={analytics.byShippingMethod} type="method" />
          </>
        )}
        
        {serviceType === 'export' && (
          <>
            <AnalyticsCard title="حسب الوجهة" data={analytics.byDestination} type="destination" />
            <AnalyticsCard title="حسب نوع المنتج" data={analytics.byProductType} type="product" />
            <AnalyticsCard title="حسب الطاقة الإنتاجية" data={analytics.byProductionCapacity} type="capacity" />
          </>
        )}
        
        {serviceType === 'logistics' && (
          <>
            <AnalyticsCard title="حسب الطريق" data={analytics.byRoute} type="route" />
            <AnalyticsCard title="حسب نوع البضائع" data={analytics.byCargoType} type="cargo" />
            <AnalyticsCard title="حسب الوزن" data={analytics.byWeight} type="weight" />
            <AnalyticsCard title="حسب نوع الشحنة" data={analytics.byShipmentType} type="shipment" />
          </>
        )}
        
        {serviceType === 'suppliers' && (
          <>
            <AnalyticsCard title="حسب نوع البحث" data={analytics.bySearchType} type="search" />
            <AnalyticsCard title="حسب مستوى الجودة" data={analytics.byQualityLevel} type="quality" />
            <AnalyticsCard title="حسب توقيت التعاون" data={analytics.byCooperationTiming} type="timing" />
          </>
        )}
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <h4 className="text-sm font-medium text-gray-600">إجمالي القيمة</h4>
          <p className="text-2xl font-bold text-gray-900">
            {analytics.totalValue ? `${analytics.totalValue.toLocaleString()} ريال` : 'غير محدد'}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <h4 className="text-sm font-medium text-gray-600">متوسط القيمة</h4>
          <p className="text-2xl font-bold text-gray-900">
            {analytics.avgValue ? `${analytics.avgValue.toLocaleString()} ريال` : 'غير محدد'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get<AnalyticsResponse>("/api/admin/analytics/services");
        if (!isMounted) return;
        setData(res.data);
        setError(null);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.response?.data?.error || "حدث خطأ غير متوقع");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['super_admin']}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل التقارير...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={['super_admin']}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">خطأ في التحميل</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['super_admin']}>
      <div className="space-y-8">
        <div className="bg-white shadow rounded-xl p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">التقارير المفصلة</h1>
          <p className="text-gray-600">تحليل شامل لجميع أنواع الخدمات والطلبات</p>
        </div>

        {data?.analytics && (
          <div className="space-y-8">
            <ServiceAnalyticsSection 
              title="تحليلات الاستيراد" 
              analytics={data.analytics.import} 
              serviceType="import"
            />
            
            <ServiceAnalyticsSection 
              title="تحليلات التصدير" 
              analytics={data.analytics.export} 
              serviceType="export"
            />
            
            <ServiceAnalyticsSection 
              title="تحليلات الشحن واللوجستيات" 
              analytics={data.analytics.logistics} 
              serviceType="logistics"
            />
            
            <ServiceAnalyticsSection 
              title="تحليلات الموردين/المستوردين" 
              analytics={data.analytics.suppliers} 
              serviceType="suppliers"
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
