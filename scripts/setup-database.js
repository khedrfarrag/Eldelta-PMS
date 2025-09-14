const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

async function setupDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    
    const client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    
    const db = client.db(process.env.MONGODB_DB)
    console.log('✅ Connected to database:', process.env.MONGODB_DB)
    
    // Create collections
    console.log('📚 Creating collections...')
    
    const collections = [
      'super_admin',
      'admins', 
      'requests',
      'contacts',
      'reviews',
      'services'
    ]
    
    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName)
        console.log(`✅ Created collection: ${collectionName}`)
      } catch (error) {
        if (error.code === 48) { // Collection already exists
          console.log(`ℹ️  Collection already exists: ${collectionName}`)
        } else {
          console.error(`❌ Error creating collection ${collectionName}:`, error.message)
        }
      }
    }
    
    // Create indexes
    console.log('🔍 Creating indexes...')
    
    // Admins collection indexes
    await db.collection('admins').createIndex({ email: 1 }, { unique: true })
    await db.collection('admins').createIndex({ status: 1 })
    console.log('✅ Created indexes for admins collection')
    
    // Super admin collection indexes
    await db.collection('super_admin').createIndex({ email: 1 }, { unique: true })
    console.log('✅ Created indexes for super_admin collection')
    
    // Requests collection indexes - Updated for new fields
    await db.collection('requests').createIndex({ email: 1 })
    await db.collection('requests').createIndex({ status: 1 })
    await db.collection('requests').createIndex({ serviceId: 1 })
    await db.collection('requests').createIndex({ productType: 1 })
    await db.collection('requests').createIndex({ destinationCountry: 1 })
    await db.collection('requests').createIndex({ createdAt: -1 })
    console.log('✅ Created indexes for requests collection (updated)')
    
    // Contacts collection indexes
    await db.collection('contacts').createIndex({ email: 1 })
    await db.collection('contacts').createIndex({ status: 1 })
    await db.collection('contacts').createIndex({ createdAt: -1 })
    console.log('✅ Created indexes for contacts collection')
    
    // Reviews collection indexes
    await db.collection('reviews').createIndex({ email: 1 })
    await db.collection('reviews').createIndex({ status: 1 })
    await db.collection('reviews').createIndex({ rating: 1 })
    await db.collection('reviews').createIndex({ createdAt: -1 })
    console.log('✅ Created indexes for reviews collection')
    
    // Services collection indexes
    await db.collection('services').createIndex({ name: 1 }, { unique: true })
    await db.collection('services').createIndex({ status: 1 })
    await db.collection('services').createIndex({ order: 1 })
    console.log('✅ Created indexes for services collection')
    
    // Check if super admin exists
    const superAdminExists = await db.collection('super_admin').countDocuments()
    
    if (superAdminExists === 0) {
      console.log('👑 Creating super admin account...')
      
      const hashedPassword = await bcrypt.hash('HhEe98865113@', 12)
      
      const superAdmin = {
        name: 'Super Admin',
        email: 'admin@eldilta.com',
        password: hashedPassword,
        role: 'super_admin',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await db.collection('super_admin').insertOne(superAdmin)
      console.log('✅ Super admin created successfully')
      console.log('📧 Email: admin@eldilta.com')
      console.log('🔑 Password: HhEe98865113@')
      console.log('⚠️  Please change these credentials after first login!')
    } else {
      console.log('ℹ️  Super admin already exists')
    }
    
    // Check if services exist
    const servicesExist = await db.collection('services').countDocuments()
    
    if (servicesExist === 0) {
      console.log('🛠️  Creating default services...')
      
      const defaultServices = [
        {
          name: 'الاستيراد من الصين',
          description: 'خدمات استيراد شاملة من الصين مع ضمان الجودة',
          features: [
            'التحقق من الموردين وضمان الجودة',
            'المساعدة في التخليص الجمركي',
            'تنسيق الشحن والخدمات اللوجيستية',
            'فحص واختبار الجودة'
          ],
          status: 'active',
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'خدمات التصدير',
          description: 'خدمات تصدير احترافية للأسواق العالمية',
          features: [
            'أبحاث السوق والتحليل',
            'إعداد مستندات التصدير',
            'تنسيق الشحن الدولي',
            'المساعدة في الامتثال التجاري'
          ],
          status: 'active',
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'التخليص الجمركي',
          description: 'خدمات التخليص الجمركي وإعداد المستندات',
          features: [
            'مستندات الاستيراد والتصدير',
            'حساب الرسوم الجمركية',
            'الامتثال للوائح',
            'تنسيق التخليص'
          ],
          status: 'active',
          order: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'الخدمات اللوجيستية',
          description: 'حلول لوجيستية شاملة لسلسلة التوريد',
          features: [
            'التخزين والمستودعات',
            'إدارة النقل',
            'تتبع المخزون',
            'تحسين سلسلة التوريد'
          ],
          status: 'active',
          order: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      
      const servicesResult = await db.collection('services').insertMany(defaultServices)
      console.log('✅ Default services created successfully')
      
      // Get the first service ID for sample request
      const firstServiceId = servicesResult.insertedIds[0]
      
      // Check if sample request exists (for testing new fields)
      const sampleRequestExists = await db.collection('requests').countDocuments()
      
      if (sampleRequestExists === 0) {
        console.log('📝 Creating sample request with new fields...')
        
        const sampleRequest = {
          customerName: 'عميل تجريبي',
          email: 'sample@example.com',
          phone: '+1234567890',
          serviceId: firstServiceId,
          serviceName: 'الاستيراد من الصين',
          productType: 'إلكترونيات',
          productSpecifications: 'هواتف ذكية وملحقاتها',
          commercialRecord: 'سجل تجاري 123456',
          estimatedQuantity: '1000 وحدة',
          destinationCountry: 'السعودية',
          exportCountry: 'الصين',
          totalValue: '50,000 ريال',
          preferredShippingMethod: 'شحن بحري',
          preferredDeliveryMethod: 'من الباب للباب',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        await db.collection('requests').insertOne(sampleRequest)
        console.log('✅ Sample request created successfully')
      } else {
        console.log('ℹ️  Sample request already exists')
      }
    } else {
      console.log('ℹ️  Services already exist')
    }
    
    console.log('\n🎉 Database setup completed successfully!')
    console.log('\n📋 Summary:')
    console.log(`   • Database: ${process.env.MONGODB_DB}`)
    console.log(`   • Collections: ${collections.length}`)
    console.log(`   • Indexes: Created for all collections (updated)`)
    console.log(`   • Super Admin: ${superAdminExists === 0 ? 'Created' : 'Exists'}`)
    console.log(`   • Services: ${servicesExist === 0 ? 'Created' : 'Exist'}`)
    console.log('\n🆕 New Request Fields:')
    console.log('   • serviceId, serviceName (linked to services)')
    console.log('   • productType, productSpecifications, commercialRecord')
    console.log('   • estimatedQuantity, destinationCountry, exportCountry, totalValue')
    console.log('   • preferredShippingMethod, preferredDeliveryMethod')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  } finally {
    await client.close()
    console.log('\n🔌 Database connection closed')
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
}

module.exports = { setupDatabase }
