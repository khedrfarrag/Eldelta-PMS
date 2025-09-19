import { MongoClient } from 'mongodb'
import { env } from '@/config/env'

let client: MongoClient | undefined
let clientPromise: Promise<MongoClient> | undefined

async function getMongoClient(): Promise<MongoClient> {
  const uri = env.MONGODB_URI
  if (!uri) {
    throw new Error('Please add your Mongo URI to .env.local or environment variables')
  }

  const options = {}

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
