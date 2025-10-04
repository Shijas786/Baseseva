
# BaseSeva - Web3 Blood Donation App

A complete Web3-powered blood donation platform that connects donors with patients in need, featuring blockchain certificates, real-time notifications, and location-based matching.

## 🌟 Features

### 🩸 Core Functionality
- **Emergency Blood Requests** - Real-time blood request system with urgency levels
- **Smart Matching** - Blood type compatibility and location-based donor matching
- **Donation Tracking** - Complete donation history with blockchain certificates
- **Blood Bank Locator** - Find nearby blood banks with inventory status
- **Real-time Notifications** - Push notifications for urgent requests

### 🔗 Web3 Integration
- **Wallet Authentication** - Secure Web3 wallet-based user authentication
- **NFT Certificates** - Blockchain-verified donation certificates
- **Impact Points** - Gamified donation tracking and rewards
- **Transparent Records** - Immutable donation history on blockchain

### 📱 Mobile-First Design
- **Progressive Web App** - Install as native app on any device
- **Offline Support** - Works without internet connection
- **Push Notifications** - Real-time alerts for blood requests
- **Location Services** - GPS-based blood bank and request matching

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase CLI
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BaseSeva
   ```

2. **Install dependencies**
   ```bash
   npm run setup
   ```

3. **Configure environment**
   ```bash
   # Update .env file with your credentials
   cp env.example .env
   # Edit .env with your Supabase and Privy credentials
   ```

4. **Deploy backend**
   ```bash
   npm run deploy
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Modern UI** - Built with Radix UI and Tailwind CSS
- **State Management** - React Context with real-time sync
- **PWA Support** - Service worker for offline functionality
- **Responsive Design** - Mobile-first approach

### Backend (Supabase + Hono)
- **Database** - PostgreSQL with PostGIS for location data
- **API** - Hono-based serverless functions
- **Storage** - Supabase Storage for file uploads
- **Real-time** - WebSocket connections for live updates

### Blockchain (Base Network)
- **NFT Certificates** - ERC-721 tokens for donations
- **Smart Contracts** - Automated reward distribution
- **Wallet Integration** - Privy for seamless Web3 auth

## 📊 Database Schema

### Core Tables
- **users** - User profiles with Web3 integration
- **blood_requests** - Emergency blood requests
- **donations** - Donation records with NFT certificates
- **blood_banks** - Blood bank locations and inventory
- **notifications** - Real-time notification system

### Key Features
- ✅ PostGIS for location-based queries
- ✅ Row Level Security (RLS)
- ✅ Blood type compatibility algorithms
- ✅ Automatic data validation

## 🔌 API Endpoints

### Authentication
- `POST /auth/login` - User registration/login
- `GET /auth/profile/:walletAddress` - Get user profile

### Blood Requests
- `GET /blood-requests` - Get active requests (with filters)
- `POST /blood-requests` - Create new request
- `POST /blood-requests/:id/respond` - Respond to request

### Donations
- `GET /donations/:walletAddress` - Get user donations
- `POST /donations` - Create donation record

### Blood Banks
- `GET /blood-banks` - Get nearby blood banks

### Notifications
- `GET /notifications/:walletAddress` - Get notifications
- `PUT /notifications/:id/read` - Mark as read

### File Upload
- `POST /upload/certificate` - Upload certificates
- `GET /upload/info/:fileName` - Get file info

### Blockchain
- `POST /blockchain/mint-certificate` - Mint NFT
- `GET /blockchain/certificates/:wallet` - Get user NFTs
- `POST /blockchain/verify/:tokenId` - Verify certificate

## 🧪 Testing

### API Testing
```bash
npm run test-api
```

### Manual Testing
1. **Health Check**: `GET /health`
2. **User Registration**: Create account with wallet
3. **Blood Request**: Create emergency request
4. **Donation**: Record donation with certificate
5. **NFT Minting**: Generate blockchain certificate

## 🚀 Deployment

### Backend Deployment
```bash
npm run deploy
```

### Frontend Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting platform
```

### Environment Variables
```env
VITE_API_URL=https://your-project.supabase.co/functions/v1
VITE_UPLOAD_URL=https://your-project.supabase.co/functions/v1/upload
VITE_PRIVY_APP_ID=your-privy-app-id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📱 Mobile App Features

### PWA Capabilities
- ✅ Install as native app
- ✅ Offline functionality
- ✅ Push notifications
- ✅ Background sync
- ✅ App shortcuts

### Native-like Experience
- ✅ Smooth animations
- ✅ Touch gestures
- ✅ Camera integration
- ✅ Location services
- ✅ File upload

## 🔒 Security Features

- ✅ Row Level Security (RLS)
- ✅ Input validation
- ✅ File type restrictions
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Error handling

## 📈 Performance

- ✅ Database indexes
- ✅ Efficient queries
- ✅ Parallel data loading
- ✅ Caching strategies
- ✅ Optimized file uploads

## 🛠️ Development

### Project Structure
```
BaseSeva/
├── src/
│   ├── components/          # React components
│   ├── services/           # API service layer
│   ├── utils/              # Utility functions
│   └── supabase/           # Backend functions
├── supabase/
│   └── migrations/         # Database migrations
├── deploy.sh              # Deployment script
├── test-api.sh            # API testing script
└── BACKEND_SETUP.md       # Detailed setup guide
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run deploy` - Deploy backend
- `npm run test-api` - Test API endpoints
- `npm run setup` - Initial setup

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📚 **Documentation**: [BACKEND_SETUP.md](BACKEND_SETUP.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)

## 🙏 Acknowledgments

- Original design: [Figma Design](https://www.figma.com/design/cyoOOVjh2SRAbNKkoXGn9U/Web3-Blood-Donation-App-UI)
- Built with: React, TypeScript, Supabase, Hono, Tailwind CSS
- Web3: Privy, Base Network, NFT certificates

---

**BaseSeva** - Connecting lives through Web3 technology 🩸✨
  