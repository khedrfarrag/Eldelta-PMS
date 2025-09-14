import ReviewsTable from '@/components/admin/ReviewsTable'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminReviewsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div>
        <h1 className="text-2xl font-bold mb-4">المراجعات</h1>
        <ReviewsTable />
      </div>
    </ProtectedRoute>
  )
}


