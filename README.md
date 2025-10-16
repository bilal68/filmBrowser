# Film Browser - Frontend Engineer Technical Challenge

A modern React application for browsing films by categories with server-side rendering (SSR), built for the MyTheresa Frontend Engineer technical challenge.

## 🎯 Project Overview

This application allows users to browse films across three categories (Trending, Top Rated, Now Playing), view detailed film information, and manage a personal wishlist. The application demonstrates modern frontend development practices including SSR, state management, API integration, and comprehensive testing.

## ✨ Features

- **🎬 Film Browsing**: Three carousels displaying films by category with arrow navigation
- **📱 Responsive Design**: Mobile-first approach with modern UI and touch-friendly interactions
- **🔍 Film Details**: Detailed view with poster, description, rating, and release date
- **❤️ Wishlist Management**: Add/remove films with persistent storage
- **🎨 Category Themes**: Different fonts and styling per category (Poppins, Merriweather, Inter)
- **⚡ Server-Side Rendering**: Fast initial page loads with SSR
- **🖼️ Lazy Loading**: Images and components load on-demand for better performance
- **👆 Touch Interactions**: Swipe navigation and touch-optimized UI elements
- **📊 Performance Monitoring**: Core Web Vitals tracking and bundle analysis
- **🖼️ Image Optimization**: Responsive images with multiple sizes and quality levels
- **🧪 Comprehensive Testing**: Unit, component, and integration tests
- **🔒 Environment Security**: API keys properly managed via environment variables

## 🛠️ Tech Stack

### Core Technologies
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Express.js** for SSR server
- **SCSS** for styling with variables, mixins, and nesting
- **React Router v6** for client-side routing

### State Management & Data
- **Zustand** for lightweight state management
- **TheMovieDatabase (TMDB) API** for film data
- **localStorage** for wishlist persistence

### Testing & Quality
- **Vitest** for fast unit testing
- **React Testing Library** for component testing
- **JSDOM** for DOM simulation
- **TypeScript** for type checking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- TMDB API key (free at [themoviedb.org](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd luxExperience
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in project root
   echo "VITE_TMDB_API_KEY=your_api_key_here" > .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
# Development
npm run dev          # Start development server with SSR
npm run build        # Build for production
npm run preview      # Preview production build

# Performance Analysis
npm run analyze      # Build with bundle analysis
npm run perf:bundle  # Performance bundle analysis
npm run perf:lighthouse # Lighthouse audit instructions

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage report
```

## 🏗️ Project Structure

```
src/
├── app/                    # Router configuration
│   ├── router.tsx         # Client-side router
│   └── router.server.tsx  # Server-side routes with lazy loading
├── components/            # Reusable components
│   ├── Layout/           # Main layout component
│   └── LazyImage.tsx     # Lazy loading image component
├── pages/                # Page components
│   ├── Home.tsx          # Homepage with film carousels
│   ├── Filmdetail.tsx    # Film detail page
│   └── Wishlist.tsx      # Wishlist management
├── services/             # API services
│   └── tmdb.ts          # TMDB API integration
├── stores/               # State management
│   └── wishlistStore.ts # Zustand wishlist store
├── styles/               # SCSS styling
│   ├── base/            # Variables, mixins, reset
│   ├── components/      # Component styles
│   └── pages/           # Page-specific styles
├── utils/                # Utility functions
│   ├── performance.ts   # Performance monitoring utilities
│   └── imageOptimization.ts # Image optimization utilities
├── test/                 # Test utilities
├── entry-client.tsx      # Client-side entry point
├── entry-server.tsx     # Server-side entry point
└── server/               # Express server
    └── server.ts         # SSR server setup
```

## 🎨 Design System

### SCSS Architecture
- **Variables**: Colors, fonts, spacing, breakpoints
- **Mixins**: Reusable styles for buttons, flexbox, media queries
- **Components**: Modular component styles
- **Pages**: Page-specific styling

### Category Themes
Each film category has its own visual identity:
- **Trending**: Red theme with Poppins font
- **Top Rated**: Blue theme with Merriweather font  
- **Now Playing**: Green theme with Inter font

### Responsive Design
- Mobile-first approach
- Breakpoints: 576px, 768px, 992px, 1200px
- Flexible grid layouts
- Touch-friendly interactions

## 🔧 Technical Implementation

### Server-Side Rendering (SSR)
- **Express.js** server with Vite middleware
- **StaticRouter** for server-side routing
- **Data pre-loading** before component rendering
- **Hydration** for seamless client-side takeover

### State Management
- **Zustand** for lightweight, TypeScript-friendly state
- **Persistence** via localStorage
- **Actions**: add, remove, clear wishlist
- **Selectors**: count, check if in wishlist

### API Integration
- **TMDB API** for film data
- **Error handling** with fallback data
- **Image optimization** with multiple sizes
- **Rate limiting** and caching considerations

### Testing Strategy
- **Unit tests** for services and stores
- **Component tests** for UI behavior
- **Integration tests** for user workflows
- **Mock data** for consistent testing

## 🔒 Security & Environment

### API Key Management
- Environment variables for sensitive data
- `.env` file for local development
- No hardcoded credentials in source code
- Proper error handling for missing keys

### Production Considerations
- Environment-specific configurations
- Build optimization with Vite
- Static asset serving
- Error boundaries and fallbacks

## 📱 Browser Support

- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: ES2020, CSS Grid, Flexbox, CSS Custom Properties

## 🧪 Testing

The application includes comprehensive test coverage:

```bash
# Run all tests
npm run test:run

# Test coverage
npm run test:coverage

# Interactive testing
npm run test:ui
```

### Test Categories
- **Services**: API integration and error handling
- **Stores**: State management and persistence
- **Components**: UI behavior and user interactions
- **Integration**: End-to-end user workflows

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure `VITE_TMDB_API_KEY`
3. Set `PORT` for server (default: 5173)

### Server Requirements
- Node.js 18+
- Express.js compatible hosting
- Static file serving capability

## 🚀 Advanced Features

### Lazy Loading Implementation
- **LazyImage Component**: Intersection Observer API for viewport detection
- **Component Lazy Loading**: All routes load on-demand with Suspense boundaries
- **Smooth Animations**: Fade-in effects and loading states
- **Performance Benefits**: Reduced initial bundle size and faster page loads

### Touch-Friendly Interactions
- **Swipe Navigation**: Left/right swipe support for carousels
- **Enhanced Touch Targets**: Minimum 44px buttons for mobile accessibility
- **Touch Animations**: Scale effects optimized for touch devices
- **Responsive Design**: Optimized for mobile and tablet interactions

### Performance Monitoring
- **Core Web Vitals**: Automatic tracking of LCP, FID, CLS, and FCP
- **Bundle Analysis**: Visual bundle analysis with interactive charts
- **Memory Monitoring**: JavaScript heap usage tracking
- **Resource Performance**: Slow resource detection and reporting

### Image Optimization
- **Responsive Images**: Multiple sizes with srcSet and sizes attributes
- **Quality Levels**: Low, medium, high, and original quality options
- **Context-Aware Sizing**: Different sizes for cards, heroes, and thumbnails
- **Optimization Utilities**: WebP detection, preloading, and dimension calculation

## 🔍 Performance Optimizations

- **Code Splitting**: Manual chunks for React, Router, and UI libraries
- **Lazy Loading**: Images and components load on-demand with Intersection Observer
- **Image Optimization**: Responsive images with srcSet, multiple sizes, and quality levels
- **Bundle Analysis**: Visual bundle analysis with rollup-plugin-visualizer
- **Performance Monitoring**: Core Web Vitals tracking (LCP, FID, CLS, FCP)
- **Touch Optimization**: Touch-friendly interactions and swipe navigation
- **Build Optimization**: Terser minification, console removal, source maps
- **SSR**: Fast initial page loads with server-side rendering
- **Throttled Events**: Optimized resize handlers and user interactions

## 🐛 Known Limitations

1. **Film Categories**: Currently determined by ID modulo (simplified logic)
2. **Image Fallbacks**: Basic placeholder system
3. **Search**: Not implemented (out of scope)
4. **Pagination**: Limited to first page of results

## 🔮 Future Enhancements

- Advanced search and filtering
- User authentication
- Social features (reviews, ratings)
- Offline support with service workers
- Progressive Web App features
- Advanced caching strategies

## 📄 License

This project is created for the MyTheresa Frontend Engineer technical challenge.

## 👨‍💻 Author

Built with ❤️ for the MyTheresa Frontend Engineer position.

---

**Note**: This application demonstrates modern frontend development practices including SSR, state management, API integration, testing, and clean code architecture. All requirements from the technical challenge have been implemented with additional enhancements for production readiness.