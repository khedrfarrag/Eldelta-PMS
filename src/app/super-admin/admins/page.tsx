import AdminsTable from '@/components/admin/AdminsTable'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function SuperAdminAdminsPage() {
  return (
    <ProtectedRoute allowedRoles={['super_admin']}>
      <div>
        <h1 className="text-2xl font-bold mb-4">إدارة المشرفين</h1>
        <AdminsTable />
      </div>
    </ProtectedRoute>
  )
}


