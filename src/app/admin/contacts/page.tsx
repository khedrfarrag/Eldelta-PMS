import ContactsTable from '@/components/admin/ContactsTable'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminContactsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div>
        <h1 className="text-2xl font-bold mb-4">رسائل التواصل</h1>
        <ContactsTable />
      </div>
    </ProtectedRoute>
  )
}


