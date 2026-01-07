# 🏡 FindLand - Platform Jual Beli Tanah Terpercaya

## 🌟 Overview

**FindLand** adalah platform digital terpercaya untuk jual beli tanah yang memudahkan pemilik tanah untuk menjual properti mereka dengan aman dan efisien. Platform ini menyediakan berbagai paket promosi, sistem pembayaran terintegrasi dengan Midtrans, dan panel admin untuk pengelolaan listing properti.

## ✨ Fitur Utama

### 🏠 **Landing Page & Beranda**
- **Hero Banner** dengan desain modern dan responsif
- **Properti Terbaru** dengan slider interaktif
- **Properti Pilihan** showcase unggulan
- **Call-to-Action** yang jelas untuk jual tanah
- **Loading Skeleton** untuk user experience yang optimal

### 🏘️ **Sistem Properti**
- **Daftar Properti** dengan filtering (Dijual/Disewa)
- **Detail Properti** dengan galeri gambar dan informasi lengkap
- **Google Maps Integration** untuk lokasi properti
- **Search & Filter** berdasarkan lokasi, harga, dan kriteria lain
- **Responsive Grid Layout** untuk berbagai device

### 💰 **Sistem Paket & Pricing**
- **4 Tier Paket** (Silver, Gold, Platinum, Diamond)
- **Fitur Berbeda** untuk setiap paket promosi
- **Durasi Fleksibel** (1-12 bulan)
- **Paket Populer** dengan highlight khusus
- **Pricing Calculator** otomatis

### 📝 **Form Jual Tanah**
- **Multi-step Form** dengan validasi lengkap
- **Upload Multiple Images** (4 gambar wajib)
- **Drag & Drop** file upload
- **KTP Scan Upload** untuk verifikasi
- **Google Maps Link** integration
- **Terms & Conditions** agreement

### 💳 **Sistem Pembayaran**
- **Midtrans Payment Gateway** integration
- **Multiple Payment Methods** (Bank Transfer, E-wallet, dll)
- **Real-time Payment Status** tracking
- **Payment Confirmation** pages
- **Webhook Integration** untuk auto-update status

### 👤 **Autentikasi & Profil**
- **Google OAuth** login integration
- **Laravel Breeze** authentication
- **User Profile** management
- **Profile Picture** upload
- **Session Management** dengan security

### 🛡️ **Panel Admin**
- **Dashboard** dengan statistik lengkap
- **Property Management** (approve/reject)
- **Payment Monitoring** system
- **User Management** capabilities
- **Review System** untuk listing

### ℹ️ **Halaman Informasi**
- **Tentang Kami** dengan informasi lengkap
- **FAQ** dengan accordion interface
- **Contact Information** dan support
- **Terms of Service** dan privacy policy

### 📱 **Responsiveness & UI/UX**
- **Mobile-First Design** approach
- **Smooth Animations** dengan Framer Motion
- **Custom Skeleton Loaders** untuk loading states
- **Toast Notifications** untuk user feedback
- **Consistent Design System** dengan Tailwind CSS

## 🛠️ Teknologi

### **Backend**
- **Framework**: [Laravel 11](https://laravel.com/) dengan PHP 8.2+
- **Authentication**: Laravel Breeze + Socialite (Google OAuth)
- **Database**: MySQL dengan Eloquent ORM
- **Payment**: Midtrans Payment Gateway integration
- **API**: RESTful API dengan proper error handling
- **Testing**: Pest framework untuk unit & feature testing

### **Frontend**
- **Framework**: [React 18](https://reactjs.org/) dengan Inertia.js
- **Language**: JavaScript ES6+ 
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) untuk utility-first styling
- **UI Components**: Custom reusable components
- **Build Tool**: [Vite 6](https://vitejs.dev/) untuk development & build

### **State Management & Data**
- **Inertia.js**: Server-side rendering dengan React
- **Context API**: Global state management
- **Custom Hooks**: Reusable logic (useProperty, useAuth, dll)
- **Axios**: HTTP client untuk API calls
- **Form Handling**: Inertia form helpers dengan validation

### **UI/UX & Interaksi**
- **Framer Motion**: Smooth animations dan transitions
- **Swiper**: Touch-friendly carousels dan sliders
- **React Icons & Heroicons**: Consistent iconography
- **Custom Animations**: Loading states dan micro-interactions

### **File Management & Media**
- **Laravel Storage**: File upload dengan secure handling
- **Image Optimization**: Automatic image processing
- **Multi-file Upload**: Drag & drop dengan preview
- **Cloud Storage Ready**: Siap untuk deployment ke cloud

### **Development Tools**
- **Composer**: PHP dependency management
- **NPM**: Frontend package management
- **Laravel Vite Plugin**: Asset bundling integration
- **PostCSS**: CSS processing dan optimization

## 📋 Prerequisites

- **PHP** 8.2 atau versi terbaru
- **Composer** untuk dependency management
- **Node.js** 18.17.0+ dan npm/yarn
- **MySQL** 8.0+ atau MariaDB
- **Git** untuk version control

## 🔧 Installation

### 1. Clone Repository
```bash
git clone https://github.com/your-username/findland.git
cd findland
```

### 2. Install Backend Dependencies
```bash
composer install
```

### 3. Install Frontend Dependencies
```bash
npm install
```

### 4. Environment Configuration
```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan konfigurasi:
```env
APP_NAME=FindLand
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=findland
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URL=http://localhost:8000/auth/google/callback

# Midtrans Configuration
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_IS_PRODUCTION=false
```

### 5. Generate Application Key
```bash
php artisan key:generate
```

### 6. Database Setup
```bash
# Jalankan migrasi
php artisan migrate

# Jalankan seeder (optional)
php artisan db:seed
```

### 7. Storage Link
```bash
php artisan storage:link
```

### 8. Start Development Server
```bash
# Terminal 1: Backend server
php artisan serve

# Terminal 2: Frontend build
npm run dev

# Atau gunakan composer script untuk menjalankan semua sekaligus
composer run dev
```

### 9. Akses Aplikasi
- **Frontend**: [http://localhost:8000](http://localhost:8000)
- **Admin Panel**: [http://localhost:8000/finadminofc/login](http://localhost:8000/finadminofc/login)

## 🏗️ Build & Deployment

### Production Build
```bash
# Build frontend assets
npm run build

# Optimize Laravel untuk production
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Environment Setup untuk Production
```bash
# Set environment ke production
APP_ENV=production
APP_DEBUG=false
MIDTRANS_IS_PRODUCTION=true

# Jalankan migrasi di production
php artisan migrate --force
```

## 📁 Struktur Project

```
findland/
├── app/
│   ├── Http/
│   │   ├── Controllers/         # API & Web Controllers
│   │   ├── Middleware/          # Custom middleware
│   │   └── Requests/            # Form request validation
│   ├── Models/                  # Eloquent models
│   │   ├── User.php
│   │   ├── LandListing.php
│   │   ├── PropertyListing.php
│   │   ├── Payment.php
│   │   └── Package.php
│   └── Providers/               # Service providers
├── database/
│   ├── migrations/              # Database schema
│   ├── seeders/                 # Sample data
│   └── factories/               # Model factories
├── resources/
│   ├── js/
│   │   ├── Components/          # Reusable React components
│   │   ├── Pages/               # Inertia.js pages
│   │   ├── Layouts/             # Layout components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── contexts/            # React contexts
│   │   └── Utils/               # Utility functions
│   ├── css/                     # Stylesheets
│   └── views/                   # Blade templates
├── routes/
│   ├── web.php                  # Web routes
│   └── auth.php                 # Authentication routes
├── public/
│   └── assets/                  # Static assets
├── storage/
│   └── app/public/              # Uploaded files
├── tests/                       # Test suites
├── composer.json                # PHP dependencies
├── package.json                 # Node.js dependencies
├── tailwind.config.js           # Tailwind configuration
└── vite.config.js               # Vite configuration
```

## 🔐 Fitur Keamanan

- **CSRF Protection** untuk semua form
- **XSS Protection** dengan input sanitization
- **File Upload Validation** dengan type & size checking
- **Database Query Protection** dengan Eloquent ORM
- **Authentication Guards** untuk admin area
- **Session Security** dengan proper configuration

## 🧪 Testing

```bash
# Jalankan semua test
php artisan test

# Jalankan test spesifik
php artisan test --filter=PropertyTest

# Test dengan coverage
php artisan test --coverage
```

## 📊 Database Schema

### Tabel Utama:
- **users**: Data pengguna dan autentikasi
- **land_listings**: Data pengajuan jual tanah
- **property_listings**: Data properti yang sudah disetujui
- **packages**: Paket promosi yang tersedia
- **payments**: Transaksi pembayaran
- **reviews**: Review dan testimoni

## 🚀 API Documentation

API endpoints yang tersedia:
- `POST /api/payments/get-snap-token` - Generate Midtrans token
- `POST /api/payments/update-status` - Update payment status
- `POST /payments/webhook` - Midtrans webhook handler

## 🤝 Contributing

1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📞 Support

Jika mengalami masalah atau membutuhkan bantuan:
- **Email**: support@findland.com
- **Documentation**: [docs.findland.com](https://docs.findland.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/findland/issues)

## 📄 License

Project ini menggunakan lisensi [MIT License](LICENSE).

---

**FindLand** - Solusi Terpercaya untuk Jual Beli Tanah 🏡

