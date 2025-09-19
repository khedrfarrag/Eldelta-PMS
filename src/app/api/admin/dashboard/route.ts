import { NextRequest, NextResponse } from 'next/server'
import getMongoClient from '@/lib/mongodb'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
import { verifyAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const client = await getMongoClient()
    const db = client.db(process.env.MONGODB_DB)
    
    // Get dashboard statistics
    const [
      totalRequests,
      completedRequests,
      pendingRequests,
      rejectedRequests,
      totalServices,
      activeServices,
      // إحصائيات حسب نوع الخدمة
      importStats,
      exportStats,
      logisticsStats,
      suppliersStats
    ] = await Promise.all([
      db.collection('requests').countDocuments(),
      db.collection('requests').countDocuments({ status: 'completed' }),
      db.collection('requests').countDocuments({ status: 'pending' }),
      db.collection('requests').countDocuments({ status: 'rejected' }),
      db.collection('services').countDocuments(),
      db.collection('services').countDocuments({ status: 'active' }),
      // إحصائيات الاستيراد
      db.collection('requests').aggregate([
        { $match: { serviceType: 'import' } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            thisMonth: {
              $sum: {
                $cond: [
                  {
                    $gte: [
                      '$createdAt',
                      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]).toArray(),
      // إحصائيات التصدير
      db.collection('requests').aggregate([
        { $match: { serviceType: 'export' } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            thisMonth: {
              $sum: {
                $cond: [
                  {
                    $gte: [
                      '$createdAt',
                      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]).toArray(),
      // إحصائيات الشحن واللوجستيات
      db.collection('requests').aggregate([
        { $match: { serviceType: 'logistics' } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            thisMonth: {
              $sum: {
                $cond: [
                  {
                    $gte: [
                      '$createdAt',
                      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]).toArray(),
      // إحصائيات الموردين/المستوردين
      db.collection('requests').aggregate([
        { $match: { serviceType: 'suppliers' } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            thisMonth: {
              $sum: {
                $cond: [
                  {
                    $gte: [
                      '$createdAt',
                      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]).toArray()
    ])
    
    // Get recent requests with new fields
    const recentRequests = await db.collection('requests')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()
    
    // Get statistics by product type
    const productTypeStats = await db.collection('requests')
      .aggregate([
        { $group: { _id: '$productType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
      .toArray()
    
    // Get statistics by destination country
    const destinationCountryStats = await db.collection('requests')
      .aggregate([
        { $group: { _id: '$destinationCountry', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
      .toArray()
    
    // Calculate rates
    const completionRate = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0
    const pendingRate = totalRequests > 0 ? Math.round((pendingRequests / totalRequests) * 100) : 0
    
    // Process service-specific statistics
    const servicesStats = {
      import: {
        total: importStats[0]?.total || 0,
        pending: importStats[0]?.pending || 0,
        completed: importStats[0]?.completed || 0,
        thisMonth: importStats[0]?.thisMonth || 0
      },
      export: {
        total: exportStats[0]?.total || 0,
        pending: exportStats[0]?.pending || 0,
        completed: exportStats[0]?.completed || 0,
        thisMonth: exportStats[0]?.thisMonth || 0
      },
      logistics: {
        total: logisticsStats[0]?.total || 0,
        pending: logisticsStats[0]?.pending || 0,
        completed: logisticsStats[0]?.completed || 0,
        thisMonth: logisticsStats[0]?.thisMonth || 0
      },
      suppliers: {
        total: suppliersStats[0]?.total || 0,
        pending: suppliersStats[0]?.pending || 0,
        completed: suppliersStats[0]?.completed || 0,
        thisMonth: suppliersStats[0]?.thisMonth || 0
      }
    }
    
    return NextResponse.json({
      success: true,
      stats: {
        totalRequests,
        completedRequests,
        pendingRequests,
        rejectedRequests,
        totalServices,
        activeServices,
        completionRate,
        pendingRate
      },
      servicesStats, // إحصائيات منفصلة لكل نوع خدمة
      recentRequests,
      productTypeStats,
      destinationCountryStats
    })
    
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
