# Technical Documentation

## Architecture Overview

This application follows a modern React architecture with server-side rendering (SSR) capabilities. The architecture is designed to be scalable, maintainable, and performant.

### Core Principles

1. **Separation of Concerns**: Clear separation between UI components, business logic, and data services
2. **Type Safety**: Full TypeScript implementation for better developer experience
3. **Performance**: SSR for fast initial loads, optimized builds with Vite
4. **Testability**: Comprehensive testing strategy with unit and integration tests
5. **Maintainability**: Clean code structure with reusable components and services

## File Structure Deep Dive

```
src/
├── app/                    # Application routing
│   ├── router.tsx         # Client-side router configuration
│   └── router.server.tsx  # Server-side route definitions
├── components/            # Reusable UI components
│   └── Layout/           # Main application layout
├── pages/                # Page-level components
│   ├── Home.tsx          # Homepage with film carousels
│   ├── Filmdetail.tsx    # Individual film detail page
│   └── Wishlist.tsx      # User wishlist management
├── services/             # External API integrations
│   └── tmdb.ts          # TheMovieDatabase API service
├── stores/               # State management
│   └── wishlistStore.ts # Zustand store for wishlist
├── styles/               # SCSS styling system
│   ├── base/            # Foundation styles
│   ├── components/      # Component-specific styles
│   └── pages/           # Page-specific styles
├── test/                 # Testing utilities and setup
├── entry-client.tsx      # Client-side application entry
├── entry-server.tsx     # Server-side rendering entry
└── server/               # Express server implementation
    └── server.ts         # SSR server setup
```

## Component Architecture

### Page Components
Each page component follows a consistent pattern:

```typescript
// Data loading function (runs on server and client)
export async function loader(): Promise<LoaderData> {
  // Fetch data from services
}

// SSR-compatible component
export function PageComponent({ data }: { data?: LoaderData }) {
  // Component implementation
}

// Default export for client-side routing
export default function Page() {
  return <PageComponent />;
}
```

### Service Layer
The service layer abstracts external API calls:

```typescript
class TMDBService {
  private config: TMDBConfig;
  
  // Private methods for API communication
  private async fetchFromAPI<T>(endpoint: string): Promise<T>
  
  // Public methods for data access
  async getTrendingMovies(): Promise<TMDBMovie[]>
  async getMovieDetails(id: number): Promise<TMDBMovie>
  
  // Utility methods
  getImageUrl(path: string | null, size: string): string
}
```

## State Management

### Zustand Store Pattern
The wishlist store follows Zustand best practices:

```typescript
interface WishlistState {
  movies: WishlistMovie[];
  addMovie: (movie: Omit<WishlistMovie, 'addedAt'>) => void;
  removeMovie: (id: number) => void;
  clearWishlist: () => void;
  isInWishlist: (id: number) => boolean;
  getWishlistCount: () => number;
}
```

### Persistence Strategy
- **localStorage**: Client-side persistence
- **Hydration**: Server-side compatibility
- **Error Handling**: Graceful fallbacks for storage issues

## Styling Architecture

### SCSS Organization
```
styles/
├── base/
│   ├── _variables.scss    # Design tokens
│   ├── _mixins.scss      # Reusable styles
│   ├── _reset.scss       # CSS reset
│   └── _helpers.scss     # Utility classes
├── components/           # Component styles
├── pages/               # Page-specific styles
└── main.scss            # Main entry point
```

### Design System
- **Variables**: Colors, fonts, spacing, breakpoints
- **Mixins**: Common patterns (buttons, flexbox, media queries)
- **Components**: Modular component styling
- **Themes**: Category-specific styling

## Server-Side Rendering

### SSR Implementation
The SSR implementation uses Express.js with Vite middleware:

```typescript
// Development mode
const vite = await createServer({
  root: projectRoot,
  server: { middlewareMode: true },
  appType: "custom",
});

// Production mode
app.use("/assets", express.static(distClient));
const { render } = await import(path.join(distServer, "entry-server.js"));
```

### Data Loading Strategy
1. **Server-side**: Pre-fetch data in loaders
2. **Client-side**: Hydrate with same data
3. **Fallbacks**: Graceful degradation for API failures

## Testing Strategy

### Test Categories
1. **Unit Tests**: Services and utilities
2. **Component Tests**: UI behavior and interactions
3. **Integration Tests**: User workflows
4. **E2E Tests**: Complete user journeys

### Testing Tools
- **Vitest**: Fast unit testing
- **React Testing Library**: Component testing
- **JSDOM**: DOM simulation
- **Mock Service Worker**: API mocking

### Test Structure
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });
  
  it('should render correctly', () => {
    // Test implementation
  });
  
  it('should handle user interactions', () => {
    // Interaction testing
  });
});
```

## Performance Optimizations

### Build Optimizations
- **Code Splitting**: Automatic with Vite
- **Tree Shaking**: Unused code elimination
- **Minification**: Production builds
- **Asset Optimization**: Image and CSS optimization

### Runtime Optimizations
- **SSR**: Fast initial page loads
- **Lazy Loading**: Non-critical components
- **Memoization**: React.memo for expensive components
- **Image Optimization**: Multiple sizes via TMDB CDN

## Error Handling

### API Error Handling
```typescript
try {
  const data = await fetchFromAPI<T>(endpoint);
  return data;
} catch (error) {
  // Log error for debugging
  return getFallbackData();
}
```

### Component Error Boundaries
- **Graceful Degradation**: Fallback UI for errors
- **User Feedback**: Clear error messages
- **Recovery**: Retry mechanisms where appropriate

## Security Considerations

### Environment Variables
- **API Keys**: Never committed to source code
- **Environment Files**: `.env` for local development
- **Production**: Secure environment variable management

### Input Validation
- **Type Safety**: TypeScript for compile-time checks
- **Runtime Validation**: API response validation
- **Sanitization**: User input sanitization

## Deployment Considerations

### Build Process
1. **Client Build**: Static assets generation
2. **Server Build**: SSR server compilation
3. **Asset Optimization**: Compression and minification

### Environment Configuration
- **Development**: Hot reloading and debugging
- **Production**: Optimized builds and error handling
- **Staging**: Production-like testing environment

## Monitoring and Debugging

### Development Tools
- **React DevTools**: Component inspection
- **Redux DevTools**: State management debugging
- **Network Tab**: API call monitoring
- **Console**: Error logging and debugging

### Production Monitoring
- **Error Tracking**: Client-side error reporting
- **Performance Monitoring**: Core Web Vitals
- **Analytics**: User behavior tracking

## Future Enhancements

### Technical Improvements
- **Service Workers**: Offline support
- **PWA**: Progressive Web App features
- **Micro-frontends**: Scalable architecture
- **GraphQL**: More efficient data fetching

### Feature Additions
- **Search**: Advanced film search
- **Authentication**: User accounts
- **Social Features**: Reviews and ratings
- **Recommendations**: AI-powered suggestions

## Code Quality Standards

### TypeScript Guidelines
- **Strict Mode**: Maximum type safety
- **Interface Definitions**: Clear data contracts
- **Generic Types**: Reusable type definitions
- **Type Guards**: Runtime type checking

### Code Style
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Conventional Commits**: Clear commit messages
- **Code Reviews**: Peer review process

## Troubleshooting

### Common Issues
1. **SSR Hydration Mismatches**: Check server/client data consistency
2. **API Rate Limits**: Implement proper error handling
3. **Build Failures**: Check TypeScript errors and dependencies
4. **Test Failures**: Verify mock data and test environment

### Debugging Tips
- **Console Logging**: Strategic logging for debugging
- **Network Inspection**: API call analysis
- **Component Inspection**: React DevTools usage
- **State Inspection**: Zustand store debugging
