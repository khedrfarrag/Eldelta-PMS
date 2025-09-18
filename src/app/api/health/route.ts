import { NextRequest, NextResponse } from 'next/server'
import getMongoClient from '@/lib/mongodb'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
import { testEmailConnection } from '@/lib/email'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const healthChecks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    services: {} as Record<string, any>,
    performance: {} as Record<string, any>,
    error: undefined as string | undefined
  }

  try {
    // Database health check
    const dbStartTime = Date.now()
    try {
    const client = await getMongoClient()
      await client.db().admin().ping()
      const dbEndTime = Date.now()
      
      healthChecks.services.database = {
        status: 'connected',
        responseTime: `${dbEndTime - dbStartTime}ms`,
        collections: await client.db().listCollections().toArray().then(cols => cols.length)
      }
    } catch (error) {
      healthChecks.services.database = {
        status: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
      healthChecks.status = 'degraded'
    }

    // Email service health check
    const emailStartTime = Date.now()
    try {
      const emailTest = await testEmailConnection()
      const emailEndTime = Date.now()
      
      healthChecks.services.email = {
        status: emailTest ? 'connected' : 'disconnected',
        responseTime: `${emailEndTime - emailStartTime}ms`
      }
      
      if (!emailTest) {
        healthChecks.status = 'degraded'
      }
    } catch (error) {
      healthChecks.services.email = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
      healthChecks.status = 'degraded'
    }

    // Memory usage check
    const memUsage = process.memoryUsage()
    healthChecks.performance.memory = {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
    }

    // CPU usage check
    const cpuUsage = process.cpuUsage()
    healthChecks.performance.cpu = {
      user: `${Math.round(cpuUsage.user / 1000)}ms`,
      system: `${Math.round(cpuUsage.system / 1000)}ms`
    }

    // Overall response time
    const totalTime = Date.now() - startTime
    healthChecks.performance.responseTime = `${totalTime}ms`

    // Set appropriate status code
    const statusCode = healthChecks.status === 'healthy' ? 200 : 
                      healthChecks.status === 'degraded' ? 200 : 503

    return NextResponse.json(healthChecks, { status: statusCode })

  } catch (error) {
    healthChecks.status = 'unhealthy'
    healthChecks.error = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(healthChecks, { status: 503 })
  }
}

// Detailed health check for specific services
export async function POST(request: NextRequest) {
  try {
    const { service } = await request.json()
    
    switch (service) {
      case 'database':
        const client = await getMongoClient()
        const dbStats = await client.db().stats()
        return NextResponse.json({
          status: 'healthy',
          service: 'database',
          stats: {
            collections: dbStats.collections,
            dataSize: `${Math.round(dbStats.dataSize / 1024 / 1024)}MB`,
            storageSize: `${Math.round(dbStats.storageSize / 1024 / 1024)}MB`,
            indexes: dbStats.indexes
          }
        })
        
      case 'email':
        const emailTest = await testEmailConnection()
        return NextResponse.json({
          status: emailTest ? 'healthy' : 'unhealthy',
          service: 'email',
          connected: emailTest
        })
        
      default:
        return NextResponse.json({
          error: 'Unknown service',
          availableServices: ['database', 'email']
        }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
