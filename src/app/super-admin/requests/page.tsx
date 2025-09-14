import RequestsTable from "@/components/admin/RequestsTable";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

export default function SuperAdminRequestsPage() {
  return (
    <ProtectedRoute allowedRoles={["super_admin"]}>
      <div>
        <h1 className="text-3xl font-bold mb-4 text-center">الطلبات </h1>
        <div className="flex items-center justify-center gap-2 mb-4" dir="rtl">
          <Link href={{ pathname: "/super-admin/requests", query: { serviceType: "import" } }} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            الاستيراد
          </Link>
          <Link href={{ pathname: "/super-admin/requests", query: { serviceType: "export" } }} className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200">
            التصدير
          </Link>
          <Link href={{ pathname: "/super-admin/requests", query: { serviceType: "logistics" } }} className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200">
            الشحن واللوجستيات
          </Link>
          <Link href={{ pathname: "/super-admin/requests", query: { serviceType: "suppliers" } }} className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
            الموردين/المستوردين
          </Link>
        </div>
        <RequestsTable />
      </div>
    </ProtectedRoute>
  );
}
