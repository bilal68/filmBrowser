# Deployment Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- TMDB API key
- Hosting platform (Vercel, Netlify, Railway, etc.)

## Environment Setup

### 1. Get TMDB API Key
1. Visit [TheMovieDatabase](https://www.themoviedb.org/settings/api)
2. Create a free account
3. Request an API key
4. Copy your API key

### 2. Configure Environment Variables
Create a `.env` file in your project root:

```bash
VITE_TMDB_API_KEY=your_api_key_here
```

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Production Build

### 1. Build the Application
```bash
npm run build
```

This creates:
- `dist/client/` - Client-side assets
- `dist/server/` - Server-side rendering files

### 2. Preview Production Build
```bash
npm run preview
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   - Go to Vercel dashboard
   - Add `VITE_TMDB_API_KEY` in project settings

### Option 2: Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist/client`
3. **Server Functions**: Upload `dist/server` to functions folder
4. **Environment Variables**: Add in Netlify dashboard

### Option 3: Railway

1. **Connect Repository**
2. **Set Environment Variables**
3. **Deploy**: Automatic deployment on push

### Option 4: Traditional Hosting

1. **Upload Files**
   - Upload `dist/client` to web server
   - Upload `dist/server` to Node.js server

2. **Configure Server**
   - Set `NODE_ENV=production`
   - Set `PORT` environment variable
   - Configure reverse proxy (nginx/Apache)

## Environment Variables

### Required
- `VITE_TMDB_API_KEY` - Your TMDB API key

### Optional
- `PORT` - Server port (default: 5173)
- `NODE_ENV` - Environment (development/production)
- `VITE_TMDB_BASE_URL` - Custom TMDB API URL
- `VITE_TMDB_IMAGE_BASE_URL` - Custom image CDN URL

## Server Configuration

### Express Server
The application uses Express.js for SSR. Ensure your hosting platform supports:
- Node.js runtime
- Express.js applications
- Static file serving
- Environment variables

### Static Assets
- CSS and JS files are served from `/assets/`
- Images are served from TMDB CDN
- No additional static file configuration needed

## Performance Optimization

### Production Checklist
- [ ] Environment variables configured
- [ ] Build completed successfully
- [ ] Static assets served correctly
- [ ] SSR working properly
- [ ] API calls functioning
- [ ] Error handling working

### Monitoring
- Check browser console for errors
- Monitor network requests
- Verify SSR hydration
- Test all user flows

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors
   - Verify all dependencies installed
   - Ensure environment variables set

2. **Runtime Errors**
   - Check API key validity
   - Verify environment variables
   - Check browser console for errors

3. **SSR Issues**
   - Ensure server files uploaded correctly
   - Check server logs for errors
   - Verify Express server configuration

4. **Asset Loading**
   - Check static file serving
   - Verify asset paths
   - Check CDN configuration

### Debug Steps

1. **Check Environment**
   ```bash
   echo $VITE_TMDB_API_KEY
   ```

2. **Test Build Locally**
   ```bash
   npm run build
   npm run preview
   ```

3. **Check Server Logs**
   - Look for error messages
   - Check API call responses
   - Verify data loading

4. **Browser Debugging**
   - Open Developer Tools
   - Check Console for errors
   - Monitor Network tab
   - Verify SSR hydration

## Security Considerations

### API Key Security
- Never commit API keys to version control
- Use environment variables for all secrets
- Rotate API keys regularly
- Monitor API usage

### Production Security
- Enable HTTPS
- Set security headers
- Implement rate limiting
- Monitor for vulnerabilities

## Scaling Considerations

### Performance
- Implement caching strategies
- Use CDN for static assets
- Optimize images and assets
- Monitor Core Web Vitals

### Infrastructure
- Use load balancers for high traffic
- Implement horizontal scaling
- Monitor server resources
- Set up monitoring and alerting

## Support

For deployment issues:
1. Check this guide first
2. Review error logs
3. Test locally with production build
4. Check hosting platform documentation
5. Contact support if needed

## Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Express.js Deployment](https://expressjs.com/en/advanced/best-practice-performance.html)
- [TMDB API Documentation](https://developers.themoviedb.org/3/getting-started/introduction)
- [React SSR Best Practices](https://react.dev/reference/react-dom/server)
