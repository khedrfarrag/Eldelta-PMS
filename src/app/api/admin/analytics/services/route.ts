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
    
    // Get detailed analytics for each service type
    const [
      importAnalytics,
      exportAnalytics,
      logisticsAnalytics,
      suppliersAnalytics
    ] = await Promise.all([
      // تحليلات الاستيراد
      db.collection('requests').aggregate([
        { $match: { serviceType: 'import' } },
        {
          $group: {
            _id: null,
            byCountry: {
              $push: {
                country: '$exportCountry',
                count: 1
              }
            },
            byProductType: {
              $push: {
                product: '$productType',
                count: 1
              }
            },
            byFrequency: {
              $push: {
                frequency: '$importFrequency',
                count: 1
              }
            },
            byShippingMethod: {
              $push: {
                method: '$preferredShippingMethod',
                count: 1
              }
            },
            totalValue: { $sum: { $toDouble: '$totalValue' } },
            avgValue: { $avg: { $toDouble: '$totalValue' } }
          }
        }
      ]).toArray(),
      
      // تحليلات التصدير
      db.collection('requests').aggregate([
        { $match: { serviceType: 'export' } },
        {
          $group: {
            _id: null,
            byDestination: {
              $push: {
                destination: '$destinationCountry',
                count: 1
              }
            },
            byProductType: {
              $push: {
                product: '$productType',
                count: 1
              }
            },
            byProductionCapacity: {
              $push: {
                capacity: '$productionCapacity',
                count: 1
              }
            },
            totalValue: { $sum: { $toDouble: '$totalValue' } },
            avgValue: { $avg: { $toDouble: '$totalValue' } }
          }
        }
      ]).toArray(),
      
      // تحليلات الشحن واللوجستيات
      db.collection('requests').aggregate([
        { $match: { serviceType: 'logistics' } },
        {
          $group: {
            _id: null,
            byRoute: {
              $push: {
                route: { $concat: ['$exportCountry', ' → ', '$destinationCountry'] },
                count: 1
              }
            },
            byCargoType: {
              $push: {
                cargo: '$cargoNature',
                count: 1
              }
            },
            byWeight: {
              $push: {
                weight: '$weight',
                count: 1
              }
            },
            byShipmentType: {
              $push: {
                type: '$shipmentType',
                count: 1
              }
            },
            totalValue: { $sum: { $toDouble: '$totalValue' } },
            avgValue: { $avg: { $toDouble: '$totalValue' } }
          }
        }
      ]).toArray(),
      
      // تحليلات الموردين/المستوردين
      db.collection('requests').aggregate([
        { $match: { serviceType: 'suppliers' } },
        {
          $group: {
            _id: null,
            bySearchType: {
              $push: {
                type: '$searchType',
                count: 1
              }
            },
            byQualityLevel: {
              $push: {
                level: '$qualityLevel',
                count: 1
              }
            },
            byCountry: {
              $push: {
                country: '$exportCountry',
                count: 1
              }
            },
            byCooperationTiming: {
              $push: {
                timing: '$cooperationTiming',
                count: 1
              }
            }
          }
        }
      ]).toArray()
    ])
    
    // Process and format the analytics data
    const processAnalytics = (data: any[]) => {
      if (!data || data.length === 0) return {}
      
      const result = data[0]
      return {
        byCountry: result.byCountry || [],
        byProductType: result.byProductType || [],
        byFrequency: result.byFrequency || [],
        byShippingMethod: result.byShippingMethod || [],
        byDestination: result.byDestination || [],
        byProductionCapacity: result.byProductionCapacity || [],
        byRoute: result.byRoute || [],
        byCargoType: result.byCargoType || [],
        byWeight: result.byWeight || [],
        byShipmentType: result.byShipmentType || [],
        bySearchType: result.bySearchType || [],
        byQualityLevel: result.byQualityLevel || [],
        byCooperationTiming: result.byCooperationTiming || [],
        totalValue: result.totalValue || 0,
        avgValue: result.avgValue || 0
      }
    }
    
    return NextResponse.json({
      success: true,
      analytics: {
        import: processAnalytics(importAnalytics),
        export: processAnalytics(exportAnalytics),
        logistics: processAnalytics(logisticsAnalytics),
        suppliers: processAnalytics(suppliersAnalytics)
      }
    })
    
  } catch (error) {
    console.error('Services analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
