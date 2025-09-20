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

  // Enhanced options for better connection handling
  const options = {
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
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
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
  return clientPromise
}

export default getMongoClient
