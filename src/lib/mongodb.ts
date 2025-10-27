import { MongoClient } from 'mongodb'
import { env } from '@/config/env'

// Ensure environment variables are loaded (only in development)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  const fs = require('fs')
  if (fs.existsSync('.env.local')) {
    require('dotenv').config({ path: '.env.local' })
  }
}

let client: MongoClient | undefined
let clientPromise: Promise<MongoClient> | undefined

async function getMongoClient(): Promise<MongoClient> {
  const uri = env.MONGODB_URI
  if (!uri) {
    throw new Error('Please add your Mongo URI to .env.local or environment variables')
  }

  // Enhanced options for better connection handling and performance
  const options = {
    maxPoolSize: 20, // Maintain up to 20 socket connections (increased for better performance)
    serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds (increased)
    socketTimeoutMS: 60000, // Close sockets after 60 seconds of inactivity (increased)
    connectTimeoutMS: 10000, // Connection timeout (added)
    retryWrites: true, // Enable retry for write operations (added)
    retryReads: true, // Enable retry for read operations (added)
    maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity (added)
    heartbeatFrequencyMS: 10000, // Send heartbeat every 10 seconds (added)
  }

  if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // Production: Use singleton pattern to prevent multiple connections
    if (!client) {
      client = new MongoClient(uri, options)
      clientPromise = client.connect()
    }
    
    // Add connection retry logic for production
    try {
      return await clientPromise
    } catch (error) {
      console.error('MongoDB connection failed, retrying...', error)
      // Reset client and retry
      client = new MongoClient(uri, options)
      clientPromise = client.connect()
      return clientPromise
    }
  }
  return clientPromise
}

export default getMongoClient
