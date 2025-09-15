"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdminServices, Service } from "@/hooks/useServices";
import Pagination from "@/components/ui/Pagination";
import GlobalSearch from "@/components/ui/GlobalSearch";
import FiltersSheet from "@/components/ui/FiltersSheet";
import ServiceModal from "./ServiceModal";
import ServiceForm from "./ServiceForm";
import { useLanguage } from "@/contexts/LanguageContext";
// Removed runtime translation; table receives localized data from API.

const STATUS_OPTIONS = [
  { value: "all", label: "الكل" },
  { value: "active", label: "نشط" },
  { value: "inactive", label: "غير نشط" },
];

// Delete Modal Component
function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceName: string;
}) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const texts = {
    ar: {
      title: "حذف الخدمة",
      message: `هل أنت متأكد من حذف الخدمة "${serviceName}"؟ سيتم حذف جميع البيانات المرتبطة بها نهائياً. لا يمكن التراجع عن هذا الإجراء.`,
      cancel: "إلغاء",
      delete: "حذف",
    },
    en: {
      title: "Delete Service",
      message: `Are you sure you want to delete the service "${serviceName}"? All associated data will be permanently removed. This action cannot be undone.`,
      cancel: "Cancel",
      delete: "Delete",
    },
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {texts[language].title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {texts[language].message}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {texts[language].cancel}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {texts[language].delete}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Service Status Badge Component
function ServiceStatusBadge({ status }: { status: "active" | "inactive" }) {
  const { language } = useLanguage();

  const isActive = status === "active";
  const text = isActive
    ? language === "ar"
      ? "نشط"
      : "Active"
    : language === "ar"
      ? "غير نشط"
      : "Inactive";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
      }`}
    >
      {text}
    </span>
  );
}

// Debounce hook
function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function ServicesTable() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const {
    services,
    loading,
    error,
    pagination,
    fetchAdminServices,
    deleteService,
  } = useAdminServices(language);

  const [page, setPage] = useState<number>(1);
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounced(search);

  // Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceFormOpen, setServiceFormOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const query = useMemo(
    () => ({
      status,
      search: debouncedSearch,
      page,
      limit: 10,
    }),
    [status, debouncedSearch, page]
  );

  useEffect(() => {
    fetchAdminServices(query);
  }, [query]);

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    const result = await deleteService(serviceToDelete._id);
    if (result.success) {
      setDeleteModalOpen(false);
      setServiceToDelete(null);
    }
  };

  const openDeleteModal = (service: Service) => {
    setServiceToDelete(service);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setServiceToDelete(null);
  };

  const openServiceModal = (service: Service) => {
    setSelectedService(service);
    setServiceModalOpen(true);
  };

  const closeServiceModal = () => {
    setServiceModalOpen(false);
    setSelectedService(null);
  };

  const openServiceForm = (service?: Service) => {
    setEditingService(service || null);
    setServiceFormOpen(true);
  };

  const closeServiceForm = () => {
    setServiceFormOpen(false);
    setEditingService(null);
  };

  const handleServiceSuccess = () => {
    // Refresh the services list
    fetchAdminServices(query);
  };

  if (loading && services.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {language === "ar" ? "إدارة الخدمات" : "Services Management"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {language === "ar"
                ? "إدارة جميع الخدمات المتاحة في النظام"
                : "Manage all available services in the system"}
            </p>
          </div>
          <button
            onClick={() => openServiceForm()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {language === "ar" ? "إضافة خدمة جديدة" : "Add New Service"}
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <GlobalSearch
              value={search}
              onChange={setSearch}
              placeholder={
                language === "ar" ? "البحث في الخدمات..." : "Search services..."
              }
            />
          </div>
          <FiltersSheet
            open={false}
            onClose={() => {}}
            title={language === "ar" ? "الفلاتر" : "Filters"}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar" ? "الحالة" : "Status"}
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </FiltersSheet>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-xl ml-3">⚠️</span>
            <div>
              <p className="font-semibold">
                {language === "ar"
                  ? "خطأ في تحميل البيانات"
                  : "Error loading data"}
              </p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Services Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
        <div className="overflow-x-auto">
          <table
            className="w-full divide-y divide-gray-200 dark:divide-gray-700"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === "ar" ? "الاسم" : "Name"}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === "ar" ? "الوصف" : "Description"}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === "ar" ? "المميزات" : "Features"}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === "ar" ? "الحالة" : "Status"}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === "ar" ? "الترتيب" : "Order"}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === "ar" ? "الإجراءات" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {services.map((service) => {
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
                  return (
                    <tr
                      key={service._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => openServiceModal(service)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {translatedService.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {translatedService.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {translatedService.features.length}{" "}
                          {language === "ar" ? "مميزة" : "features"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ServiceStatusBadge status={service.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {service.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div
                          className="flex gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => openServiceForm(service)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {language === "ar" ? "تعديل" : "Edit"}
                          </button>
                          <button
                            onClick={() => openDeleteModal(service)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            {language === "ar" ? "حذف" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {services.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
              📋
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {language === "ar" ? "لا توجد خدمات" : "No services found"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {language === "ar"
                ? "لم يتم العثور على أي خدمات تطابق معايير البحث"
                : "No services found matching the search criteria"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.TotalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={pagination.CurrentPage}
              pageSize={pagination.PageSize}
              totalCount={pagination.TotalCount}
              onPageChange={setPage}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        serviceName={(() => {
          if (!serviceToDelete) return "";
          if (typeof serviceToDelete.name === 'string') {
            return serviceToDelete.name;
          } else if (serviceToDelete.name && typeof serviceToDelete.name === 'object') {
            return serviceToDelete.name[language] || serviceToDelete.name.ar || serviceToDelete.name.en || "";
          }
          return "";
        })()}
      />

      {/* Service Modal */}
      <ServiceModal
        service={selectedService}
        isOpen={serviceModalOpen}
        onClose={closeServiceModal}
        onEdit={(service) => {
          closeServiceModal();
          openServiceForm(service);
        }}
        onDelete={(service) => {
          closeServiceModal();
          openDeleteModal(service);
        }}
      />

      {/* Service Form */}
      <ServiceForm
        service={editingService}
        isOpen={serviceFormOpen}
        onClose={closeServiceForm}
        onSuccess={handleServiceSuccess}
      />
    </div>
  );
}
