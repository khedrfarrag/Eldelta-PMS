"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import Pagination from "@/components/ui/Pagination";
import { getCategoryLabelAr } from "@/lib/constants/productCategories";
import GlobalSearch from "@/components/ui/GlobalSearch";
import FiltersSheet from "@/components/ui/FiltersSheet";
import { useLanguage } from "@/contexts/LanguageContext";

export type RequestItem = {
  _id: string;
  customerName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  serviceId?: string;
  serviceName?: string;
  serviceType?: 'import' | 'export' | 'logistics' | 'suppliers';
  
  // الحقول الأساسية الموجودة
  productType?: string;
  productSpecifications?: string;
  commercialRecord?: string;
  estimatedQuantity?: string;
  exportCountry?: string;
  destinationCountry?: string;
  totalValue?: string;
  preferredShippingMethod?: string;
  preferredDeliveryMethod?: string;
  insuranceNeeded?: string;
  readyDate?: string;
  desiredArrivalDate?: string;
  notes?: string;
  heardAboutUs?: string;
  
  // حقول الاستيراد
  importFrequency?: 'once' | 'monthly' | 'quarterly' | 'yearly';
  customsAssistance?: boolean;
  consultationNeeded?: boolean;
  additionalServices?: string[];
  productSpecsPdfUrl?: string;
  hasShippingPlan?: boolean;
  
  // حقول التصدير
  productDetails?: string;
  productionCapacity?: string;
  qualityCertificates?: boolean;
  packagingServices?: boolean;
  findImporters?: boolean;
  
  // حقول الشحن واللوجستيات
  fromCountry?: string;
  toCountry?: string;
  fromCity?: string;
  toCity?: string;
  shipmentType?: 'full_container' | 'partial_container' | 'air' | 'land' | 'express';
  cargoNature?: 'raw_materials' | 'food' | 'electronics' | 'chemicals' | 'other';
  weight?: number;
  volume?: number;
  packagesCount?: number;
  tracking?: boolean;
  doorToDoor?: boolean;
  customsAgent?: boolean;
  shippingUrgency?: 'urgent' | 'normal';
  
  // حقول الموردين/المستوردين
  searchType?: 'supplier' | 'importer';
  expectedQuantity?: string;
  preferredCountry?: string;
  hasExistingPartners?: boolean;
  existingPartnersDetails?: string;
  qualityLevel?: 'normal' | 'medium' | 'high' | 'world_class';
  factoryVisits?: boolean;
  negotiationServices?: boolean;
  productionSupervision?: boolean;
  samples?: boolean;
  cooperationTiming?: 'immediate' | 'one_month' | 'three_months';
  
  status?: "pending" | "in_progress" | "completed" | "rejected" | string;
  createdAt?: string;
  updatedAt?: string;
};

type RequestsResponse = {
  success: boolean;
  requests: RequestItem[];
  pagination: {
    CurrentPage: number;
    PageSize: number;
    TotalCount: number;
    TotalPages: number;
  };
};

const STATUS_OPTIONS = [
  { value: "all", label: "الكل" },
  { value: "pending", label: "قيد الانتظار" },
  { value: "in_progress", label: "قيد التنفيذ" },
  { value: "completed", label: "مكتمل" },
  { value: "rejected", label: "مرفوض" },
];

const SERVICE_TYPE_OPTIONS = [
  { value: "all", label: "جميع الخدمات" },
  { value: "import", label: "الاستيراد" },
  { value: "export", label: "التصدير" },
  { value: "logistics", label: "الشحن واللوجستيات" },
  { value: "suppliers", label: "الموردين/المستوردين" },
];

// Delete Modal Component
function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  requestId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  requestId: string;
}) {
  const { language } = useLanguage();

  const isRTL = language === "ar";

  const texts = {
    ar: {
      title: "حذف الطلب",
      message:
        "هل أنت متأكد من حذف هذا الطلب؟ سيتم حذف جميع البيانات المرتبطة به نهائياً. لا يمكن التراجع عن هذا الإجراء.",
      cancel: "إلغاء",
      delete: "حذف",
    },
    en: {
      title: "Delete Request",
      message:
        "Are you sure you want to delete this request? All associated data will be permanently removed. This action cannot be undone.",
      cancel: "Cancel",
      delete: "Delete",
    },
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="absolute inset-0  bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
            <div className={`${isRTL ? "mr-3" : "ml-3"} flex-1`}>
              <h3 className="text-lg font-medium text-gray-900">
                {texts[language].title}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {texts[language].message}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Request ID: {requestId}
              </p>
            </div>
          </div>
          <div
            className={`mt-6 flex ${isRTL ? "flex-row-reverse" : "flex-row"} gap-3`}
          >
            <button
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {texts[language].cancel}
            </button>
            <button
              onClick={onConfirm}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {texts[language].delete}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const cls =
    status === "completed"
      ? "bg-emerald-50 text-emerald-700"
      : status === "pending"
        ? "bg-yellow-50 text-yellow-700"
        : status === "in_progress"
          ? "bg-blue-50 text-blue-700"
          : status === "rejected"
            ? "bg-rose-50 text-rose-700"
            : "bg-gray-50 text-gray-600";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
      {status || "-"}
    </span>
  );
}

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function RequestsTable() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<RequestItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [status, setStatus] = useState<string>("all");
  const [serviceType, setServiceType] = useState<string>(searchParams.get("serviceType") || "all");
  const [destinationCountry, setDestinationCountry] = useState<string>("");
  const [exportCountry, setExportCountry] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounced(search);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

  const query = useMemo(
    () => ({
      status,
      serviceType,
      destinationCountry,
      exportCountry,
      search: debouncedSearch,
      page,
      limit,
    }),
    [status, serviceType, destinationCountry, exportCountry, debouncedSearch, page, limit]
  );

  async function fetchRequests() {
    try {
      setLoading(true);
      const res = await api.get<RequestsResponse>("/api/admin/requests", {
        params: {
          status: query.status,
          serviceType: query.serviceType,
          destinationCountry: query.destinationCountry || undefined,
          exportCountry: query.exportCountry || undefined,
          search: query.search || undefined,
          page: query.page,
          limit: query.limit,
        },
      });
      setItems(res.data.requests);
      setTotalPages(res.data.pagination.TotalPages);
      setTotalCount(res.data.pagination.TotalCount);
      setError(null);
    } catch (e: any) {
      setError(e?.response?.data?.error || "تعذر تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, serviceType, destinationCountry, exportCountry, debouncedSearch, page]);

  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (serviceType) current.set('serviceType', serviceType);
    router.replace(`?${current.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceType]);

  async function updateStatus(requestId: string, newStatus: string) {
    try {
      await api.patch("/api/admin/requests", { requestId, status: newStatus });
      fetchRequests();
    } catch (e: any) {
      setError(e?.response?.data?.error || "تعذر تحديث الحالة");
    }
  }

  function openDeleteModal(requestId: string) {
    setRequestToDelete(requestId);
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setRequestToDelete(null);
  }

  async function confirmDelete() {
    if (!requestToDelete) return;

    try {
      await api.delete("/api/admin/requests", {
        params: { id: requestToDelete },
      });
      fetchRequests();
      closeDeleteModal();
    } catch (e: any) {
      setError(e?.response?.data?.error || "تعذر حذف الطلب");
    }
  }

  const [filtersOpen, setFiltersOpen] = useState(false);
  const applyFilters = (fn: () => void) => {
    fn();
    setPage(1);
    setFiltersOpen(false);
  };

  const formatDate = (v?: string) => (v ? new Date(v).toLocaleString() : "-");

  // Texts for different languages
  const texts = {
    ar: {
      searchPlaceholder: "ابحث بالاسم/البريد/الخ...",
      filters: "فلاتر",
      reset: "إعادة تعيين",
      noRequests: "لا توجد طلبات",
      delete: "حذف",
    },
    en: {
      searchPlaceholder: "Search by name/email/etc...",
      filters: "Filters",
      reset: "Reset",
      noRequests: "No requests found",
      delete: "Delete",
    },
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div
        className={`mb-4 flex items-center gap-2 flex-wrap ${isRTL ? "flex-row-reverse" : "flex-row"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="sm:w-auto">
          <GlobalSearch
            value={search}
            onChange={setSearch}
            placeholder={texts[language].searchPlaceholder}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
        <button
          onClick={() => setFiltersOpen(true)}
          className="cursor-pointer px-4 py-2 rounded-lg bg-gray-800 text-white hover:opacity-90  sm:w-auto"
        >
          {texts[language].filters}
        </button>
        <button
          onClick={() => {
            setStatus("all");
            setDestinationCountry("");
            setExportCountry("");
            setSearch("");
            setPage(1);
          }}
          className=" cursor-pointer px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:opacity-90  sm:w-auto"
        >
          <i className="fa-solid fa-xmark" />
        </button>
      </div>

      <FiltersSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="الفلاتر"
        dir="rtl"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">الحالة</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">نوع الخدمة</label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
            >
              {SERVICE_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              دولة الوجهة
            </label>
            <input
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="اكتب بلد الوجهة"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              بلد التصدير
            </label>
            <input
              value={exportCountry}
              onChange={(e) => setExportCountry(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="اكتب بلد التصدير"
            />
          </div>
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setFiltersOpen(false)}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800"
            >
              إلغاء
            </button>
            <button
              onClick={() => applyFilters(() => {})}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white"
            >
              تطبيق
            </button>
          </div>
        </div>
      </FiltersSheet>

      {error && (
        <div
          className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3"
          dir="rtl"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1">
        <div className=" rounded-xl p-6">
          <div className=" overflow-x-auto">
            <table className="w-max min-w-full divide-y" dir="rtl">
              <thead className=" text-gray-300 dark:text-gray-900">
                <tr>
                  {/* المعلومات الأساسية */}
                  <th className="px-4 py-3 text-right text-xs font-medium   uppercase tracking-wider">
                    المعرف
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    العميل
                  </th>
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    الشركة
                  </th>
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    البريد
                  </th>
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    الهاتف
                  </th>
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    الخدمة
                  </th>
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    نوع الخدمة
                  </th>
                  
                  {/* معلومات المنتج */}
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    نوع المنتج
                  </th>
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    مواصفات المنتج
                  </th>
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    ملف PDF
                  </th>
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    الكمية
                  </th>
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    القيمة الإجمالية
                  </th>
                  
                  {/* تفاصيل الشحنة */}
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    الوزن (كجم)
                  </th>
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    الحجم (م³)
                  </th>
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    عدد الطرود
                  </th>
                  
                  {/* معلومات الشحن */}
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    من
                  </th>
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    إلى
                  </th>
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    الميناء/المدينة (من)
                  </th>
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    الميناء/المدينة (إلى)
                  </th>
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    نوع الشحنة
                  </th>
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    طريقة الشحن
                  </th>
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    طريقة التسليم
                  </th>
                  
                  {/* الخدمات الإضافية */}
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    الخدمات الإضافية
                  </th>
                  
                  {/* معلومات إضافية */}
                  <th className=" px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    كيف سمعت عنا
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    ملاحظات
                  </th>
                  
                  {/* الحالة والتواريخ */}
                  <th className="px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                    أُنشئ في
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium  uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className=" divide-y divide-gray-100">
                {loading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 25 }).map((__, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 bg-gray-100 rounded w-28 animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr className="">
                    <td className="px-4 py-6 text-center" colSpan={25}>
                      {texts[language].noRequests}
                    </td>
                  </tr>
                ) : (
                  items.map((r) => (
                    <tr key={r._id} className="cursor-pointer">
                      {/* المعلومات الأساسية */}
                      <td className="px-4 py-3 text-xs  break-all">{r._id}</td>
                      <td className="px-4 py-3 text-sm ">
                        {r.customerName || "غير معروف"}
                      </td>
                      <td className="px-4 py-3 text-sm ">
                        {r.companyName || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm  break-all max-w-[180px]">
                        {r.email || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm  break-all max-w-[140px]">
                        {r.phone || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm ">
                        {r.serviceName || r.serviceId || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm ">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          r.serviceType === 'import' ? 'bg-blue-100 text-blue-800' :
                          r.serviceType === 'export' ? 'bg-green-100 text-green-800' :
                          r.serviceType === 'logistics' ? 'bg-orange-100 text-orange-800' :
                          r.serviceType === 'suppliers' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {r.serviceType === 'import' ? 'الاستيراد' :
                           r.serviceType === 'export' ? 'التصدير' :
                           r.serviceType === 'logistics' ? 'الشحن واللوجستيات' :
                           r.serviceType === 'suppliers' ? 'الموردين/المستوردين' :
                           '-'}
                        </span>
                      </td>
                      
                      {/* معلومات المنتج */}
                      <td className="px-4 py-3 text-sm ">
                        {/* {getCategoryLabelAr(r.productType) || "-"} */}
                        {getCategoryLabelAr(r.productType || r.cargoNature) || "-"}
                      </td>
                      <td
                        className="px-4 py-3 text-sm  max-w-[200px] sm:max-w-[320px] break-words truncate"
                        title={r.productSpecifications}
                      >
                        {r.productSpecifications || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm ">
                        {r.productSpecsPdfUrl ? (
                          <a
                            href={r.productSpecsPdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 transition-colors"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            تحميل
                          </a>
                        ) : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm ">
                        {r.estimatedQuantity || r.expectedQuantity || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm ">
                        {r.totalValue || "-"}
                      </td>
                      
                      {/* تفاصيل الشحنة */}
                      <td className="px-4 py-3 text-sm ">
                        {r.weight || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm ">
                        {r.volume || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm ">
                        {r.packagesCount || "-"}
                      </td>
                      
                      {/* معلومات الشحن */}
                      <td className="px-4 py-3 text-sm ">
                        {r.fromCountry || r.exportCountry || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm ">
                        {r.toCountry || r.destinationCountry || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm ">
                        {r.fromCity || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm ">
                        {r.toCity || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm ">
                        {r.shipmentType ? (
                          r.shipmentType === 'full_container' ? 'حاوية كاملة' :
                          r.shipmentType === 'partial_container' ? 'جزء من حاوية' :
                          r.shipmentType === 'air' ? 'شحن جوي' :
                          r.shipmentType === 'land' ? 'شحن بري' :
                          r.shipmentType === 'express' ? 'سريع' : r.shipmentType
                        ) : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm ">
                        {r.preferredShippingMethod ? (
                          r.preferredShippingMethod === 'sea' ? 'بحري' :
                          r.preferredShippingMethod === 'air' ? 'جوي' :
                          r.preferredShippingMethod === 'land' ? 'بري' :
                          r.preferredShippingMethod === 'express' ? 'سريع' : r.preferredShippingMethod
                        ) : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm ">
                        {r.preferredDeliveryMethod ? (
                          r.preferredDeliveryMethod === 'door-to-door' ? 'Door to Door' :
                          r.preferredDeliveryMethod === 'port-to-port' ? 'Port to Port' :
                          r.preferredDeliveryMethod === 'cif' ? 'CIF' :
                          r.preferredDeliveryMethod === 'fob' ? 'FOB' : r.preferredDeliveryMethod
                        ) : "-"}
                      </td>
                      
                      {/* الخدمات الإضافية */}
                      <td className="px-4 py-3 text-sm ">
                        <div className="flex flex-wrap gap-1">
                          {/* الخدمات من additionalServices */}
                          {r.additionalServices && r.additionalServices.map((service, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {service}
                            </span>
                          ))}
                          
                          {/* خدمات الاستيراد */}
                          {r.qualityCertificates && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              شهادات جودة
                            </span>
                          )}
                          {r.packagingServices && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              خدمات تغليف
                            </span>
                          )}
                          {r.findImporters && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              البحث عن مستوردين
                            </span>
                          )}
                          {r.factoryVisits && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              زيارات مصانع
                            </span>
                          )}
                          {r.negotiationServices && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              خدمات تفاوض
                            </span>
                          )}
                          {r.productionSupervision && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              إشراف إنتاج
                            </span>
                          )}
                          {r.samples && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              عينات
                            </span>
                          )}
                          
                          {/* خدمات الشحن واللوجستيات */}
                          {r.insuranceNeeded && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                              التأمين: {r.insuranceNeeded}
                            </span>
                          )}
                          {r.tracking && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                              التتبع
                            </span>
                          )}
                          {r.doorToDoor && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                              توصيل لباب العميل
                            </span>
                          )}
                          {r.customsAgent && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                              وكيل جمركي
                            </span>
                          )}
                          {r.shippingUrgency && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                              موعد الشحن: {r.shippingUrgency === 'urgent' ? 'مستعجل' : 'عادي'}
                            </span>
                          )}
                          
                          {/* خدمات أخرى */}
                          {r.consultationNeeded && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                              الاستشارة
                            </span>
                          )}
                          {r.customsAssistance && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                              المساعدة الجمركية
                            </span>
                          )}
                          {r.hasShippingPlan === true && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                              خطة الشحن
                            </span>
                          )}
                          
                          {/* إذا لم توجد أي خدمات */}
                          {!r.additionalServices && 
                           !r.qualityCertificates && 
                           !r.packagingServices && 
                           !r.findImporters && 
                           !r.factoryVisits && 
                           !r.negotiationServices && 
                           !r.productionSupervision && 
                           !r.samples && 
                           !r.insuranceNeeded && 
                           !r.tracking && 
                           !r.doorToDoor && 
                           !r.customsAgent && 
                           !r.shippingUrgency && 
                           !r.consultationNeeded && 
                           !r.customsAssistance && 
                           r.hasShippingPlan !== true && (
                            <span className="text-gray-500 text-xs">-</span>
                          )}
                        </div>
                      </td>
                      
                      {/* معلومات إضافية */}
                      <td className="px-4 py-3 text-sm ">
                        {r.heardAboutUs || "-"}
                      </td>
                      <td
                        className="px-4 py-3 text-sm  max-w-[200px] sm:max-w-[320px] break-words truncate"
                        title={r.notes}
                      >
                        {r.notes || "-"}
                      </td>
                      
                      {/* الحالة والتواريخ */}
                      <td className="px-4 py-3 text-sm">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3 text-sm  whitespace-nowrap">
                        {formatDate(r.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className=" flex items-center gap-2 justify-end">
                          <select
                            value={r.status || "pending"}
                            onChange={(e) =>
                              updateStatus(r._id, e.target.value)
                            }
                            className=" text-gray-300 dark:text-gray-900 border rounded-lg px-2 py-1 "
                          >
                            {STATUS_OPTIONS.filter(
                              (s) => s.value !== "all"
                            ).map((s) => (
                              <option
                                key={s.value}
                                value={s.value}
                                className="text-gray-800 "
                              >
                                {s.label}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => openDeleteModal(r._id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:opacity-90"
                          >
                            {texts[language].delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          currentPage={page}
          pageSize={limit}
          totalCount={totalCount}
          onPageChange={(p) => setPage(p)}
          dir={isRTL ? "rtl" : "ltr"}
        />
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        requestId={requestToDelete || ""}
      />
    </div>
  );
}

