const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

async function updateSuperAdminPassword(newPlainPassword) {
  if (!newPlainPassword || newPlainPassword.length < 8) {
    console.error('❌ Please provide a strong new password as the first argument')
    process.exit(1)
  }

  const client = new MongoClient(process.env.MONGODB_URI)
  try {
    console.log('🔌 Connecting to MongoDB...')
    await client.connect()
    const db = client.db(process.env.MONGODB_DB)

    console.log('🔐 Hashing new password...')
    const hashedPassword = await bcrypt.hash(newPlainPassword, 12)

    const result = await db.collection('super_admin').updateOne(
      { email: 'admin@eldilta.com' },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      console.log('ℹ️  No super admin found with email admin@eldilta.com')
    } else {
      console.log('✅ Super admin password updated successfully')
    }
  } catch (err) {
    console.error('❌ Failed to update super admin password:', err)
    process.exit(1)
  } finally {
    await client.close()
    console.log('🔌 Connection closed')
  }
}

if (require.main === module) {
  const newPassword = process.argv[2] || 'HhEe98865113@'
  updateSuperAdminPassword(newPassword)
}

module.exports = { updateSuperAdminPassword }


