#!/usr/bin/env node

/**
 * Environment Setup Script
 * This script helps you set up the environment variables for local development
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupEnvironment() {
  console.log('🚀 Setting up environment for Eldelta PMS...\n');

  // Check if .env.local already exists
  const envLocalPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const overwrite = await question('⚠️  .env.local already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('❌ Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('📝 Please provide the following information:\n');

  // MongoDB Configuration
  const mongodbUri = await question('🔗 MongoDB URI (Atlas recommended): ');
  const mongodbDb = await question('🗄️  MongoDB Database Name (default: eldilta): ') || 'eldilta';

  // JWT Configuration
  const jwtSecret = await question('🔐 JWT Secret (min 32 characters): ');
  const jwtExpiresIn = await question('⏰ JWT Expires In (default: 7d): ') || '7d';

  // NextAuth Configuration
  const nextauthSecret = await question('🔑 NextAuth Secret: ');
  const nextauthUrl = await question('🌐 NextAuth URL (default: http://localhost:3000): ') || 'http://localhost:3000';

  // Email Configuration (Optional)
  const emailHost = await question('📧 Email Host (default: smtp.gmail.com): ') || 'smtp.gmail.com';
  const emailPort = await question('📮 Email Port (default: 587): ') || '587';
  const emailUser = await question('👤 Email User (optional): ');
  const emailPass = await question('🔒 Email Password (optional): ');

  // LibreTranslate Configuration (Optional)
  const libreTranslateUrl = await question('🌍 LibreTranslate URL (optional): ');

  // Generate .env.local content
  const envContent = `# Local Development Environment Variables
# This file is for local development and should not be committed to git

# MongoDB Configuration
MONGODB_URI=${mongodbUri}
MONGODB_DB=${mongodbDb}

# JWT Configuration
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=${jwtExpiresIn}

# NextAuth Configuration
NEXTAUTH_SECRET=${nextauthSecret}
NEXTAUTH_URL=${nextauthUrl}

# Environment
NODE_ENV=development

# Email Configuration (for OTP)${emailUser ? `
EMAIL_HOST=${emailHost}
EMAIL_PORT=${emailPort}
EMAIL_USER=${emailUser}
EMAIL_PASS=${emailPass}` : ''}

# LibreTranslate Configuration${libreTranslateUrl ? `
LIBRETRANSLATE_URL=${libreTranslateUrl}` : ''}

# Development specific settings
NEXT_PUBLIC_APP_URL=${nextauthUrl}
NEXT_PUBLIC_API_URL=${nextauthUrl}/api
`;

  // Write .env.local file
  try {
    fs.writeFileSync(envLocalPath, envContent);
    console.log('\n✅ .env.local file created successfully!');
    console.log('📁 Location:', envLocalPath);
    
    console.log('\n🎉 Environment setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm install');
    console.log('2. Run: npm run dev');
    console.log('3. Open: http://localhost:3000');
    
    console.log('\n⚠️  Important:');
    console.log('- Never commit .env.local to git');
    console.log('- Keep your secrets secure');
    console.log('- Use MongoDB Atlas for production');
    
  } catch (error) {
    console.error('❌ Error creating .env.local:', error.message);
  }

  rl.close();
}

// Run the setup
setupEnvironment().catch(console.error);
