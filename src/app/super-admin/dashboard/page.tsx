"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

type DashboardResponse = {
  success: boolean;
  stats: {
    totalRequests: number;
    completedRequests: number;
    pendingRequests: number;
    rejectedRequests: number;
    totalServices: number;
    activeServices: number;
    completionRate: number;
    pendingRate: number;
  };
  servicesStats: {
    import: {
      total: number;
      pending: number;
      completed: number;
      thisMonth: number;
    };
    export: {
      total: number;
      pending: number;
      completed: number;
      thisMonth: number;
    };
    logistics: {
      total: number;
      pending: number;
      completed: number;
      thisMonth: number;
    };
    suppliers: {
      total: number;
      pending: number;
      completed: number;
      thisMonth: number;
    };
  };
  recentRequests: Array<{
    _id: string;
    customerName?: string;
    productType?: string;
    destinationCountry?: string;
    status?: string;
    createdAt?: string;
  }>;
  productTypeStats: Array<{ _id: string; count: number }>;
  destinationCountryStats: Array<{ _id: string; count: number }>;
};

function StatCard({
  title,
  value,
  iconBg,
  emoji,
  subtext,
}: {
  title: string;
  value: string | number;
  iconBg: string;
  emoji: string;
  subtext?: string;
}) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-xl border border-gray-100">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div
              className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center shadow-inner`}
            >
              <span className="text-white text-base">{emoji}</span>
            </div>
          </div>
          <div className="mr-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-2xl font-semibold text-gray-900 mt-1">
                {value}
              </dd>
              {subtext ? (
                <dd className="text-xs text-gray-400 mt-1">{subtext}</dd>
              ) : null}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white overflow-hidden shadow rounded-xl border border-gray-100 animate-pulse">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
          </div>
          <div className="mr-5 w-0 flex-1">
            <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-5 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get<DashboardResponse>("/api/admin/dashboard");
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

  return (
    <div>
      {/* <h1 className="text-3xl font-bold text-gray-900 mb-6">
        لوحة تحكم السوبر أدمن
      </h1> */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          مرحباً بك في لوحة تحكم السوبر أدمن
        </h2>
        <p className="text-gray-600">
          من هنا يمكنك إدارة جميع جوانب النظام، بما في ذلك إدارة المشرفين،
          مراقبة طلبات الخدمات، وإعداد التقارير الشاملة.
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <span className="text-xl ml-3">⚠️</span>
            <div>
              <p className="font-semibold">تعذر تحميل البيانات</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {loading || !data ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              title="إجمالي الطلبات"
              value={data.stats.totalRequests}
              iconBg="bg-blue-500"
              emoji="📦"
              subtext={`مكتملة ${data.stats.completionRate}%`}
            />
            <StatCard
              title="قيد المعالجة"
              value={data.stats.pendingRequests}
              iconBg="bg-yellow-500"
              emoji="⏳"
              subtext={`نسبة ${data.stats.pendingRate}%`}
            />
            <StatCard
              title="الخدمات المتاحة"
              value={data.stats.totalServices}
              iconBg="bg-emerald-500"
              emoji="⚙️"
              subtext={`نشطة ${data.stats.activeServices}`}
            />
            <StatCard
              title="طلبات مرفوضة"
              value={data.stats.rejectedRequests}
              iconBg="bg-rose-500"
              emoji="🚫"
            />
          </>
        )}
      </div>

      {/* Service-specific Statistics */}
      {data?.servicesStats && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">إحصائيات حسب نوع الخدمة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white shadow rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-600">الاستيراد</h4>
                  <p className="text-2xl font-bold text-blue-600">{data.servicesStats.import.total}</p>
                  <p className="text-xs text-gray-500">إجمالي: {data.servicesStats.import.total} | هذا الشهر: {data.servicesStats.import.thisMonth}</p>
                </div>
                <div className="text-blue-500 text-2xl">📥</div>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-600">التصدير</h4>
                  <p className="text-2xl font-bold text-green-600">{data.servicesStats.export.total}</p>
                  <p className="text-xs text-gray-500">إجمالي: {data.servicesStats.export.total} | هذا الشهر: {data.servicesStats.export.thisMonth}</p>
                </div>
                <div className="text-green-500 text-2xl">📤</div>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-xl p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-600">الشحن واللوجستيات</h4>
                  <p className="text-2xl font-bold text-orange-600">{data.servicesStats.logistics.total}</p>
                  <p className="text-xs text-gray-500">إجمالي: {data.servicesStats.logistics.total} | هذا الشهر: {data.servicesStats.logistics.thisMonth}</p>
                </div>
                <div className="text-orange-500 text-2xl">🚚</div>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-600">الموردين/المستوردين</h4>
                  <p className="text-2xl font-bold text-purple-600">{data.servicesStats.suppliers.total}</p>
                  <p className="text-xs text-gray-500">إجمالي: {data.servicesStats.suppliers.total} | هذا الشهر: {data.servicesStats.suppliers.thisMonth}</p>
                </div>
                <div className="text-purple-500 text-2xl">🤝</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            الطلبات الحديثة
          </h2>
          {loading || !data ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-12 bg-gray-100 rounded animate-pulse"
                />
              ))}
            </div>
          ) : data.recentRequests.length === 0 ? (
            <p className="text-gray-500">لا توجد طلبات حتى الآن.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العميل
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      نوع المنتج
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الدولة
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {data.recentRequests.map((r) => (
                    <tr key={r._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {r.customerName || "غير معروف"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {r.productType || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {r.destinationCountry || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            r.status === "completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : r.status === "pending"
                                ? "bg-yellow-50 text-yellow-700"
                                : r.status === "rejected"
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {r.status || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            إحصائيات سريعة
          </h2>
          {loading || !data ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-8 bg-gray-100 rounded animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">معدل الإكمال</span>
                <span className="text-sm font-medium text-gray-900">
                  {data.stats.completionRate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  الطلبات قيد الانتظار
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {data.stats.pendingRequests}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  حسب نوع المنتج
                </h3>
                <ul className="space-y-2 max-h-40 overflow-auto pr-1">
                  {data.productTypeStats.map((p) => (
                    <li
                      key={p._id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">
                        {p._id || "غير محدد"}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {p.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  حسب دولة الوجهة
                </h3>
                <ul className="space-y-2 max-h-40 overflow-auto pr-1">
                  {data.destinationCountryStats.map((c) => (
                    <li
                      key={c._id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">
                        {c._id || "غير محدد"}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {c.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
