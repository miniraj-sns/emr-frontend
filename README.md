# MindBrite EMR Frontend

A modern, responsive React TypeScript application for the MindBrite Electronic Medical Records system.

## 🚀 Features

- **Modern React 18** with TypeScript
- **Tailwind CSS** for styling with custom design system
- **Redux Toolkit** for state management
- **React Router v6** for navigation
- **React Query** for server state management
- **Vite** for fast development and building
- **Responsive Design** - mobile-first approach
- **Accessibility** - WCAG 2.1 AA compliant
- **Enterprise Architecture** - scalable and maintainable

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + React Query
- **Routing**: React Router v6
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date/Time**: Day.js

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components
│   ├── layout/          # Layout components
│   ├── forms/           # Form components
│   ├── tables/          # Data table components
│   └── charts/          # Chart components
├── pages/               # Page components
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # Dashboard pages
│   ├── patients/        # Patient management
│   ├── appointments/    # Appointment management
│   ├── crm/            # CRM pages
│   └── settings/       # Settings pages
├── features/            # Redux slices and feature logic
│   ├── auth/
│   ├── patients/
│   ├── appointments/
│   └── crm/
├── services/            # API services
│   ├── api/            # API client and interceptors
│   ├── auth/           # Authentication service
│   └── storage/        # Local storage utilities
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── constants/           # Application constants
└── styles/              # Global styles and Tailwind config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd emr/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   VITE_API_URL=http://localhost:8000/api
   VITE_APP_NAME=MindBrite EMR
   VITE_APP_VERSION=1.0.0
   VITE_APP_ENVIRONMENT=development
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

### Docker Development

```bash
# Build and run with Docker
docker-compose up emr-frontend

# Or build manually
docker build -t mindbrite-emr-frontend .
docker run -p 3000:3000 mindbrite-emr-frontend
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6)
- **Secondary**: Gray (#64748b)
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Yellow (#f59e0b)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Font weights 600-700
- **Body**: Font weight 400-500

### Components
- **Buttons**: Primary, Secondary, Ghost, Danger variants
- **Inputs**: Text, Select, Date, File upload
- **Cards**: Default, Elevated, Interactive
- **Tables**: Sortable, Paginated, Filterable
- **Modals**: Confirmation, Form, Details

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api` |
| `VITE_APP_NAME` | Application name | `MindBrite EMR` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |
| `VITE_APP_ENVIRONMENT` | Environment | `development` |
| `VITE_FEATURE_VIDEO_SESSIONS` | Enable video sessions | `true` |
| `VITE_FEATURE_TELEHEALTH` | Enable telehealth | `true` |

### Tailwind Configuration

The project uses a custom Tailwind configuration with:
- Custom color palette
- Custom typography
- Custom animations
- Component utilities

## 📱 Responsive Design

The application is built with a mobile-first approach:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔐 Authentication

The application uses JWT tokens for authentication:
- Tokens are stored in localStorage
- Automatic token refresh
- Protected routes
- Role-based access control

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 📦 Building for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

The build output will be in the `dist/` directory.

## 🚀 Deployment

### Docker Production Build

```bash
# Build production image
docker build -t mindbrite-emr-frontend:prod .

# Run production container
docker run -p 80:80 mindbrite-emr-frontend:prod
```

### Static Hosting

The application can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository. 