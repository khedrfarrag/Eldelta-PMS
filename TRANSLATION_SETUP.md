# 🌐 Translation Setup Guide

This guide explains how to set up dynamic translation using LibreTranslate.

## 🚀 Quick Start

### 1. Install LibreTranslate

```bash
# Run the setup script
node scripts/setup-libretranslate.js
```

### 2. Fix Existing Services

```bash
# Convert existing services to translation format
node scripts/fix-existing-services.js
```

### 3. Add Environment Variable

Add to your `.env.local` file:
```
LIBRETRANSLATE_URL=http://localhost:5000
```

### 4. Restart Development Server

```bash
npm run dev
```

## 🔧 Manual Setup

### Using Docker (Recommended)

```bash
# Start LibreTranslate
docker run -d -p 5000:5000 --name libretranslate libretranslate/libretranslate

# Check if it's running
curl http://localhost:5000/translate -X POST -H "Content-Type: application/json" -d '{"q":"مرحبا","source":"ar","target":"en","format":"text"}'
```

### Using Python (Alternative)

```bash
# Install Python dependencies
pip install libretranslate

# Start LibreTranslate
libretranslate --host 0.0.0.0 --port 5000
```

## 📋 How It Works

### 1. Service Creation
When an admin creates a new service:
- Text is entered in Arabic
- LibreTranslate automatically translates to English
- Both versions are saved in the database

### 2. Service Display
When users view services:
- API endpoint receives `lang` parameter (`ar` or `en`)
- Appropriate language version is returned
- Frontend displays the correct language

### 3. Service Editing
When an admin edits a service:
- Changes are made to the current language
- LibreTranslate translates the changes
- Both language versions are updated

## 🗂️ Database Structure

Services are stored with this structure:
```json
{
  "name": {
    "ar": "تصدير",
    "en": "Export"
  },
  "description": {
    "ar": "وصف بالعربية",
    "en": "Description in English"
  },
  "features": [
    {
      "ar": "ميزة 1",
      "en": "Feature 1"
    }
  ],
  "translationStatus": "auto"
}
```

## 🔧 Management Commands

```bash
# Start LibreTranslate
docker start libretranslate

# Stop LibreTranslate
docker stop libretranslate

# View logs
docker logs libretranslate

# Remove LibreTranslate
docker rm libretranslate
```

## 🐛 Troubleshooting

### LibreTranslate Not Starting
- Check if port 5000 is available
- Ensure Docker is running
- Check Docker logs: `docker logs libretranslate`

### Translation Not Working
- Verify LibreTranslate is running: `curl http://localhost:5000`
- Check environment variable: `LIBRETRANSLATE_URL`
- Check network connectivity

### Poor Translation Quality
- LibreTranslate quality depends on the model
- Consider using Google Translate API for better quality
- Update LibreTranslate to latest version

## 📊 Performance

- **Memory Usage**: ~2GB RAM for LibreTranslate
- **Translation Speed**: 200-500ms per text
- **Cache**: Translations are cached to avoid repeated API calls
- **Fallback**: If translation fails, original text is used

## 🔒 Security

- LibreTranslate runs locally
- No data is sent to external services
- All translations happen on your server
- Full control over the translation process

