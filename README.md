# Eldilta - Import/Export Company Website

A comprehensive Next.js website for Eldilta, an import/export company, featuring static services, visitor forms, and admin management system.

## 🚀 Features

### Public Features (Visitors)
- **Static Services Display**: View company services with detailed information
- **Contact Form**: Submit contact messages to the company
- **Service Request Form**: Request specific services with detailed requirements
- **Website Review System**: Rate and review the website
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Unified Login System**: Single login for both Super Admin and Regular Admins
- **Dashboard**: Overview of requests, contacts, and reviews
- **Request Management**: View, update status, and manage service requests
- **Contact Management**: Handle incoming contact messages
- **Review Management**: Approve/reject website reviews
- **Admin Management**: Super Admin can create and manage other admins

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for different admin levels
- **Rate Limiting**: Protection against abuse and brute force attacks
- **Input Validation**: Comprehensive data validation and sanitization
- **Security Headers**: Enhanced security with HTTP headers

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with App Router
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT with HTTP-only cookies
- **Styling**: Tailwind CSS
- **Icons**: FontAwesome
- **Notifications**: React Toastify
- **Forms**: React Hook Form
- **Validation**: Zod

## 📁 Project Structure

```
eldilta/
├── src/
│   ├── app/
│   │   ├── (public)/          # Public routes
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── services/      # Services listing
│   │   │   ├── about-us/      # About company
│   │   │   └── contact-us/    # Contact page
│   │   ├── (auth)/            # Authentication routes
│   │   │   └── login/         # Login page
│   │   ├── (admin)/           # Admin routes
│   │   │   ├── dashboard/     # Admin dashboard
│   │   │   ├── requests/      # Request management
│   │   │   └── manage-services/ # Service management
│   │   └── api/               # API routes
│   │       ├── auth/          # Authentication APIs
│   │       ├── admin/         # Admin APIs
│   │       ├── requests/      # Service request APIs
│   │       ├── contact/       # Contact form APIs
│   │       ├── reviews/       # Review APIs
│   │       └── services/      # Service APIs
│   ├── lib/                   # Utility libraries
│   │   ├── mongodb.ts         # Database connection
│   │   └── auth.ts            # Authentication utilities
│   └── components/            # Reusable components
├── scripts/                   # Database setup scripts
├── public/                    # Static assets
├── middleware.ts              # Route protection
└── .env.local                 # Environment variables
```

## 🗄️ Database Collections

### Collections Structure

1. **super_admin**: Super administrator accounts
2. **admins**: Regular administrator accounts
3. **requests**: Service requests from visitors
4. **contacts**: Contact form submissions
5. **reviews**: Website reviews and ratings
6. **services**: Company services (static content)

### Key Fields

- **Authentication**: `email`, `password`, `role`, `status`
- **Requests**: `customerName`, `email`, `serviceName`, `status`, `adminNotes`
- **Contacts**: `name`, `email`, `message`, `status`
- **Reviews**: `name`, `email`, `rating`, `comment`, `status`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eldilta
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp env.example .env.local
   
   # Edit .env.local with your configuration
   MONGODB_URI=mongodb://localhost:27017/eldilta
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Database Setup**
   ```bash
   # Run database setup script
   node scripts/setup-database.js
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Admin: http://localhost:3000/admin
   - Login: http://localhost:3000/login

## 🔐 Default Credentials

After running the database setup script:

- **Super Admin**:
  - Email: `admin@eldilta.com`
  - Password: `admin123`

⚠️ **Important**: Change these credentials after first login!

## 📱 API Endpoints

### Public APIs
- `POST /api/contact` - Submit contact form
- `POST /api/requests` - Submit service request
- `POST /api/reviews` - Submit website review
- `GET /api/services` - Get all services
- `GET /api/reviews` - Get approved reviews

### Admin APIs
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/requests` - Get all requests
- `PATCH /api/admin/requests` - Update request status
- `GET /api/admin/admins` - Get all admins (Super Admin only)
- `POST /api/admin/admins` - Create new admin (Super Admin only)

## 🛡️ Security Features

### Authentication & Authorization
- JWT tokens with HTTP-only cookies
- Role-based access control
- Password hashing with bcrypt
- Session management

### Rate Limiting
- General rate limiting: 1000 requests per 15 minutes
- API-specific limits: 100 requests per 15 minutes
- IP-based tracking

### Input Validation
- Email format validation
- Required field validation
- Data sanitization
- SQL injection prevention

### Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy restrictions

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Tailwind CSS**: Utility-first CSS framework

## 📊 Admin Roles & Permissions

### Super Admin
- Full access to all features
- Create, modify, and delete other admins
- Manage all requests, contacts, and reviews
- System configuration access

### Regular Admin
- View and manage requests
- Update request statuses
- Handle contact messages
- Approve/reject reviews
- Limited admin management access

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables (Production)
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure production MongoDB URI
- Set up email service credentials

### Recommended Hosting
- **Vercel**: Optimized for Next.js
- **Netlify**: Good for static sites
- **AWS/GCP**: For custom server requirements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software for Eldilta Company.

## 📞 Support

For technical support or questions:
- Email: [support@eldilta.com]
- Documentation: [link-to-docs]

---

**Built with ❤️ for Eldilta Company**
