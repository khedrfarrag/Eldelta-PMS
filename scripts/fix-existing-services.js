const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '.env.local' })

// Simple translation function for existing data
function translateText(text, targetLang) {
  const translations = {
    'تصدير': 'Export',
    'استيراد': 'Import',
    'الشحن والخدمات اللوجستية': 'Shipping and Logistics Services',
    'توفير الموردين أو المستوردين': 'Supplier or Importer Provision',
    'ندعمك لتصدير منتجاتك للعالم بخدمات تغليف، أوراق، وشحن متكاملة.': 'We support you in exporting your products to the world with integrated packaging, documentation, and shipping services.',
    'استيراد أمن وسهل من أي دولة، مع متابعة التوريد والتخليص والتسليم.': 'Safe and easy import from any country, with supply tracking, customs clearance, and delivery.',
    'خيارات شحن متنوعة مع إدارة احترافية لسلاسل الإمداد.': 'Diverse shipping options with professional supply chain management.',
    'ربطك بموردين موثوقين أو مستوردين جادين لبناء شراكات ناجحة.': 'Connecting you with reliable suppliers or serious importers to build successful partnerships.',
    'تغليف احترافي': 'Professional packaging',
    'أوراق رسمية': 'Official documentation',
    'شحن سريع': 'Fast shipping',
    'متابعة التوريد': 'Supply tracking',
    'تخليص جمركي': 'Customs clearance',
    'متابعة الشحن': 'Shipping tracking',
    'تسليم آمن': 'Safe delivery',
    'دعم فني': 'Technical support',
    'شحن بحري': 'Sea freight',
    'شحن جوي': 'Air freight',
    'تخزين مؤقت': 'Temporary storage',
    'توزيع محلي': 'Local distribution',
    'شبكة موردين': 'Supplier network',
    'فحص الجودة': 'Quality inspection',
    'تفاوض الأسعار': 'Price negotiation',
    'ضمان الجودة': 'Quality guarantee'
  };

  return translations[text] || text;
}

async function fixExistingServices() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    
    const client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    
    const db = client.db(process.env.MONGODB_DB)
    console.log('✅ Connected to database:', process.env.MONGODB_DB)
    
    // Get all services
    const services = await db.collection('services').find({}).toArray()
    console.log(`📋 Found ${services.length} services`)
    
    if (services.length === 0) {
      console.log('ℹ️  No services found to fix')
      return
    }
    
    // Check if services already have translation format
    const firstService = services[0]
    if (firstService.name && typeof firstService.name === 'object') {
      console.log('✅ Services already have translation format')
      return
    }
    
    console.log('🛠️  Converting services to translation format...')
    
    // Convert each service
    for (const service of services) {
      // Check if service already has translation format
      if (service.name && typeof service.name === 'object') {
        console.log(`ℹ️  Service already has translation format: ${service.name.ar || service.name}`)
        continue
      }
      
      const updatedService = {
        ...service,
        name: {
          ar: service.name,
          en: translateText(service.name, 'en')
        },
        description: {
          ar: service.description,
          en: translateText(service.description, 'en')
        },
        features: service.features.map(feature => ({
          ar: feature,
          en: translateText(feature, 'en')
        })),
        translationStatus: 'manual',
        updatedAt: new Date()
      }
      
      await db.collection('services').replaceOne(
        { _id: service._id },
        updatedService
      )
      
      console.log(`✅ Updated service: ${service.name}`)
    }
    
    console.log('\n🎉 All services converted successfully!')
    console.log('📝 Services now have both Arabic and English translations')
    
    // Verify the conversion
    console.log('\n🔍 Verifying conversion...')
    const updatedServices = await db.collection('services').find({}).toArray()
    
    updatedServices.forEach((service, index) => {
      console.log(`\n📋 Service ${index + 1}:`)
      console.log(`   Arabic Name: ${service.name.ar}`)
      console.log(`   English Name: ${service.name.en}`)
      console.log(`   Features: ${service.features.length} features`)
    })
    
  } catch (error) {
    console.error('❌ Error fixing services:', error)
  } finally {
    if (client) {
      await client.close()
      console.log('🔌 Database connection closed')
    }
  }
}

fixExistingServices()

