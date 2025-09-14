import ProtectedRoute from '@/components/ProtectedRoute'
import ServicesTable from '@/components/admin/ServicesTable'

export default function SuperAdminServicesPage() {
  return (
    <ProtectedRoute allowedRoles={['super_admin']}>
      <ServicesTable />
    </ProtectedRoute>
  )
}


