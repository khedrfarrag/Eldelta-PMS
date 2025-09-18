#!/usr/bin/env node

/**
 * Environment Variables Checker
 * يتحقق من صحة إعدادات البيئة قبل النشر
 */

const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'EMAIL_HOST',
  'EMAIL_USER',
  'EMAIL_PASS'
]

const optionalEnvVars = [
  'EMAIL_PORT',
  'LIBRETRANSLATE_URL'
]

function checkEnvironment() {
  console.log('🔍 فحص إعدادات البيئة...\n')
  
  let hasErrors = false
  
  // فحص المتغيرات المطلوبة
  console.log('📋 المتغيرات المطلوبة:')
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName]
    if (!value) {
      console.log(`❌ ${varName}: غير محدد`)
      hasErrors = true
    } else {
      // إخفاء القيم الحساسة
      const displayValue = varName.includes('SECRET') || varName.includes('PASS') || varName.includes('URI')
        ? '***' + value.slice(-4)
        : value
      console.log(`✅ ${varName}: ${displayValue}`)
    }
  })
  
  console.log('\n📋 المتغيرات الاختيارية:')
  optionalEnvVars.forEach(varName => {
    const value = process.env[varName]
    if (!value) {
      console.log(`⚠️  ${varName}: غير محدد (اختياري)`)
    } else {
      console.log(`✅ ${varName}: ${value}`)
    }
  })
  
  // فحص صحة MongoDB URI
  if (process.env.MONGODB_URI) {
    const isAtlas = process.env.MONGODB_URI.includes('mongodb+srv://')
    const isLocal = process.env.MONGODB_URI.includes('mongodb://127.0.0.1') || process.env.MONGODB_URI.includes('mongodb://localhost')
    
    if (isAtlas) {
      console.log('\n🌐 MongoDB: Atlas (سحابي)')
    } else if (isLocal) {
      console.log('\n💻 MongoDB: محلي')
    } else {
      console.log('\n❓ MongoDB: نوع غير معروف')
    }
  }
  
  // فحص صحة Gmail
  if (process.env.EMAIL_USER && process.env.EMAIL_USER.includes('@gmail.com')) {
    console.log('\n📧 Email: Gmail')
  } else if (process.env.EMAIL_USER) {
    console.log('\n📧 Email: مخصص')
  }
  
  console.log('\n' + '='.repeat(50))
  
  if (hasErrors) {
    console.log('❌ يوجد أخطاء في إعدادات البيئة!')
    console.log('📖 راجع DEPLOYMENT_GUIDE.md للمساعدة')
    process.exit(1)
  } else {
    console.log('✅ جميع الإعدادات صحيحة!')
    console.log('🚀 جاهز للنشر على Netlify')
  }
}

// تشغيل الفحص
checkEnvironment()
