# GoDaddy Deployment Instructions

## 1. Environment Variables Setup

Create these environment variables in your GoDaddy hosting panel:

### Database Configuration
- MONGODB_URI=mongodb://username:password@host:port/database
- MONGODB_DB=your-database-name

### Authentication
- JWT_SECRET=your-super-secret-jwt-key
- NEXTAUTH_SECRET=your-nextauth-secret

### Email Configuration
- SMTP_HOST=your-smtp-host
- SMTP_PORT=587
- SMTP_USER=your-email@domain.com
- SMTP_PASS=your-email-password
- FROM_EMAIL=noreply@yourdomain.com
- FROM_NAME=Eldilta

### Application Settings
- NODE_ENV=production
- NEXTAUTH_URL=https://yourdomain.com

### Admin Setup
- SUPER_ADMIN_EMAIL=admin@yourdomain.com
- SUPER_ADMIN_PASSWORD=your-secure-password

## 2. Files to Upload

Upload these folders/files to your GoDaddy hosting:
- .next/ (build output)
- public/ (static files)
- package.json
- package-lock.json
- next.config.ts

## 3. Server Requirements

- Node.js 18+ 
- MongoDB database
- SMTP email service

## 4. Database Setup

Run these scripts on your server:
- npm run setup-database
- npm run seed-super-admin

## 5. Start Application

- npm install
- npm start
