const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up LibreTranslate...\n');

// Check if Docker is installed
function checkDocker() {
  return new Promise((resolve) => {
    exec('docker --version', (error) => {
      if (error) {
        console.log('❌ Docker is not installed. Please install Docker first.');
        console.log('📥 Download from: https://www.docker.com/products/docker-desktop');
        resolve(false);
      } else {
        console.log('✅ Docker is installed');
        resolve(true);
      }
    });
  });
}

// Start LibreTranslate with Docker
function startLibreTranslate() {
  return new Promise((resolve, reject) => {
    console.log('🐳 Starting LibreTranslate with Docker...');
    
    const command = 'docker run -d -p 5000:5000 --name libretranslate libretranslate/libretranslate';
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Failed to start LibreTranslate:', error.message);
        reject(error);
      } else {
        console.log('✅ LibreTranslate started successfully!');
        console.log('🌐 LibreTranslate is running on: http://localhost:5000');
        console.log('📝 Container ID:', stdout.trim());
        resolve(stdout.trim());
      }
    });
  });
}

// Test LibreTranslate connection
async function testConnection() {
  try {
    console.log('🧪 Testing LibreTranslate connection...');
    
    const response = await fetch('http://localhost:5000/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: 'مرحبا',
        source: 'ar',
        target: 'en',
        format: 'text'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ LibreTranslate is working!');
      console.log('🔤 Test translation: "مرحبا" -> "' + data.translatedText + '"');
      return true;
    } else {
      console.log('❌ LibreTranslate test failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot connect to LibreTranslate:', error.message);
    return false;
  }
}

// Main setup function
async function setup() {
  try {
    // Check Docker
    const dockerInstalled = await checkDocker();
    if (!dockerInstalled) {
      process.exit(1);
    }
    
    // Start LibreTranslate
    await startLibreTranslate();
    
    // Wait a bit for the service to start
    console.log('⏳ Waiting for LibreTranslate to initialize...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Test connection
    const isWorking = await testConnection();
    
    if (isWorking) {
      console.log('\n🎉 LibreTranslate setup completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Add LIBRETRANSLATE_URL=http://localhost:5000 to your .env.local file');
      console.log('2. Restart your Next.js development server');
      console.log('3. Test the translation feature in your admin panel');
      console.log('\n🔧 To stop LibreTranslate: docker stop libretranslate');
      console.log('🔧 To start LibreTranslate: docker start libretranslate');
    } else {
      console.log('\n❌ Setup failed. Please check the logs above.');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup();

