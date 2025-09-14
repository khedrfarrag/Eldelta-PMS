import RequestsTable from '@/components/admin/RequestsTable'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminRequestsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div>
        <h1 className="text-2xl font-bold mb-4">طلبات الخدمات</h1>
        <RequestsTable />
      </div>
    </ProtectedRoute>
  )
}


