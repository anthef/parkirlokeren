# BSS Parking - ALPR Parking Management System

![BSS Parking Logo](public/new-logo-bss-parking-mobile.png)

BSS Parking adalah sistem manajemen parkir pintar yang menggunakan teknologi **ALPR (Automatic License Plate Recognition)** untuk monitoring dan pengelolaan area parkir secara real-time. Sistem ini dibangun dengan teknologi modern untuk memberikan solusi parkir yang efisien, akurat, dan terintegrasi.

## 🚀 Fitur Utama

### 🎯 Teknologi ALPR
- **Deteksi Otomatis**: Kamera ALPR mendeteksi plat nomor kendaraan secara otomatis dengan akurasi tinggi
- **Validasi Real-time**: Sistem AI memvalidasi dan memverifikasi data plat nomor dengan confidence score
- **Multi-Camera Support**: Mendukung multiple kamera untuk berbagai titik masuk dan keluar

### 📊 Dashboard & Monitoring
- **Live Monitoring**: Monitoring real-time status kamera, deteksi terbaru, dan feed video langsung
- **Analytics Dashboard**: Statistik komprehensif dengan grafik dan chart interaktif
- **System Health**: Monitor performa sistem, latency, dan uptime kamera
- **Alert System**: Notifikasi otomatis untuk pelanggaran dan aktivitas mencurigakan

### 📋 Manajemen Data
- **Log & History**: Pencatatan otomatis semua aktivitas parkir dengan timestamp dan durasi
- **Export Data**: Export data ke Excel dan CSV untuk analisis lebih lanjut
- **Advanced Filtering**: Filter berdasarkan tanggal, status, kamera, dan tipe kendaraan
- **Vehicle Type Detection**: Deteksi otomatis jenis kendaraan (Mobil, Motor, Truk, Bus)

### 🔐 Keamanan & Autentikasi
- **User Authentication**: Sistem login/register dengan Supabase
- **Role-based Access**: Kontrol akses berdasarkan peran pengguna
- **Secure Routes**: Middleware protection untuk halaman sensitif

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15** - React framework dengan App Router
- **TypeScript** - Type-safe development
- **React 18** - UI library dengan modern features

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **React Icons** - Additional icons

### Backend & Database
- **Supabase** - Backend-as-a-Service (Auth, Database, Storage)
- **Next.js API Routes** - Server-side API endpoints

### Data Visualization
- **Recharts** - Chart library untuk analytics dashboard
- **Date-fns** - Date manipulation library

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

### Utility Libraries
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **XLSX** - Excel file generation
- **Clsx** - Conditional CSS classes
- **Class Variance Authority** - Component variants

## 📁 Struktur Proyek

```
├── app/                      # Next.js App Router
│   ├── (auth-pages)/        # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── api/                 # API routes
│   │   └── camera-feed/     # Camera feed proxy
│   ├── dashboard/           # Dashboard pages
│   │   ├── monitoring/      # Live monitoring
│   │   └── settings/        # Settings page
│   └── detail-monitoring/   # Detailed analytics
├── components/              # Reusable components
│   ├── ui/                  # UI component library
│   ├── auth/                # Auth-related components
│   ├── navbar.tsx           # Navigation bar
│   ├── footer.tsx           # Footer component
│   └── theme-provider.tsx   # Theme management
├── hooks/                   # Custom React hooks
│   ├── useAuth.tsx          # Authentication hook
│   ├── use-toast.ts         # Toast notifications
│   └── use-mobile.tsx       # Mobile detection
├── lib/                     # Utility libraries
│   ├── utils.ts             # Helper functions
│   └── validations/         # Zod schemas
├── public/                  # Static assets
├── styles/                  # Global styles
└── utils/                   # Utility functions
    └── supabase/            # Supabase configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, atau bun
- Supabase account (untuk backend)

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd parkirlokeren
```

2. **Install dependencies**
```bash
npm install
# atau
yarn install
# atau
pnpm install
# atau
bun install
```

3. **Setup environment variables**
Buat file `.env.local` dan tambahkan:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://ggexknjpqqqmjcidxedg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnZXhrbmpwcXFxbWpjaWR4ZWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjgwMjIsImV4cCI6MjA2Mzk0NDAyMn0.n4nK97g6pIt96n8riMDu-Ud-EMt9KxHJR-tjDEXNIP8
NEXT_PUBLIC_DJANGO_API_URL=https://parkirlokeren-be.ariqmau.org
```

4. **Run development server**
```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
# atau
bun dev
```

5. **Open browser**
Buka [http://localhost:3000](http://localhost:3000) atau akses deployment [https://parkirlokeren.vercel.app/](https://parkirlokeren.vercel.app/) untuk melihat aplikasi.

## 📱 Fitur Aplikasi

### Landing Page
- Hero section dengan animasi Framer Motion
- Feature showcase dengan teknologi ALPR
- Testimonial dari pengguna
- Pricing plans (Basic, Professional, Enterprise)
- FAQ section

### Authentication
- Login/Register dengan Supabase Auth
- Forgot password functionality
- Protected routes dengan middleware

### Dashboard Utama
- Overview statistik parkir real-time
- Recent vehicle detections
- Quick actions dan shortcuts
- System status indicators

### Live Monitoring
- Real-time camera feeds
- Live detection log dengan confidence score
- System metrics (latency, accuracy, uptime)
- Camera status monitoring

### Detail Monitoring & Analytics
- Comprehensive data table dengan filtering
- Interactive charts (hourly traffic, vehicle types)
- Camera performance analytics
- Export functionality (Excel/CSV)
- Advanced search dan pagination

### Settings
- User profile management
- System configuration
- Notification preferences

## 🎨 UI/UX Features

### Design System
- **Dark/Light Theme**: Toggle tema dengan next-themes
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels dan keyboard navigation
- **Component Library**: Konsisten design dengan Radix UI

### Animations
- **Page Transitions**: Smooth transitions dengan Framer Motion
- **Loading States**: Skeleton loaders dan spinners
- **Interactive Elements**: Hover states dan micro-interactions

### Data Visualization
- **Real-time Charts**: Live updating dengan Recharts
- **Interactive Tables**: Sorting, filtering, pagination
- **Status Indicators**: Color-coded status badges
- **Progress Bars**: Visual feedback untuk metrics

## 🔧 Konfigurasi

### Tailwind CSS
Konfigurasi custom di `tailwind.config.ts` dengan:
- Custom color palette
- Animation utilities
- Component variants
- Dark mode support

### Next.js
- App Router dengan TypeScript
- API routes untuk backend integration
- Middleware untuk authentication
- Image optimization

### Supabase
- Authentication dengan email/password
- Real-time subscriptions (future)
- Row Level Security (RLS)
- File storage untuk images

## 🚀 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Connect repository di [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy otomatis

### Manual Deployment
```bash
npm run build
npm start
```

### Environment Variables
Pastikan set environment variables berikut:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_DJANGO_API_URL`

## 📊 Performance

### Metrics
- **Core Web Vitals**: Optimized untuk performa
- **Bundle Size**: Tree-shaking dan code splitting
- **Loading Speed**: Image optimization dan lazy loading
- **SEO**: Meta tags dan structured data

### Optimization
- Next.js Image component untuk optimasi gambar
- Dynamic imports untuk code splitting
- Service worker untuk caching (future)
- Database query optimization

## 🧪 Testing

### Testing Stack (Future)
- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright atau Cypress
- **Component Tests**: Storybook
- **API Tests**: Supertest

## 🔐 Security

### Authentication
- Supabase Auth dengan secure tokens
- Password hashing dengan bcrypt
- Session management

### Data Protection
- HTTPS enforcement
- Input validation dengan Zod
- SQL injection protection
- XSS protection

## 📚 API Documentation

### Camera Feed API
```typescript
GET /api/camera-feed
// Proxy untuk live camera streams
```


## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

Untuk support dan pertanyaan:
- Email: support@bssparking.com
- Documentation: [docs.bssparking.com](https://docs.bssparking.com)
- Issues: [GitHub Issues](https://github.com/anthef/parkirlokeren/issues)

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Basic ALPR integration
- [x] Dashboard monitoring
- [x] User authentication
- [x] Data export functionality

### Phase 2 (Next)
- [ ] Mobile app dengan React Native
- [ ] Real-time notifications
- [ ] Payment integration
- [ ] Advanced analytics

### Phase 3 (Future)
- [ ] AI-powered violation detection
- [ ] Integration dengan sistem parkir meter
- [ ] Multi-tenant support
- [ ] Advanced reporting dashboard

---

**BSS Parking** - Transforming parking management with intelligent ALPR technology 🚗📊
