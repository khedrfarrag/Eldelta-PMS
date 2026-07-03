#!/usr/bin/env node

/**
 * Environment Variables Checker
 * يتحقق من صحة إعدادات البيئة قبل النشر
 */

// Load environment variables from .env.local
const path = require('path');
const fs = require('fs');

// Check if .env.local exists
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log(`📁 Loaded environment from: ${envPath}`);
} else {
  console.log('⚠️  .env.local file not found');
}

const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
]

const optionalEnvVars = [
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS',
  'LIBRETRANSLATE_URL',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_API_URL'
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
    console.log('📖 راجع ENVIRONMENT_SETUP.md للمساعدة')
    console.log('🔧 أو استخدم: npm run setup-env')
    process.exit(1)
  } else {
    console.log('✅ جميع الإعدادات صحيحة!')
    console.log('🚀 جاهز للتشغيل المحلي أو النشر على Netlify')
  }
}

// تشغيل الفحص
checkEnvironment()
