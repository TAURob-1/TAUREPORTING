# Deployment Guide

This guide covers deploying the CarShield CTV Dashboard to various hosting platforms.

## Build for Production

First, create an optimized production build:

```bash
npm run build
```

This creates a `dist/` directory with optimized, minified files ready for deployment.

## Deployment Options

### 1. Vercel (Recommended)

**Easiest deployment - automatic builds from Git**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or connect your Git repository at [vercel.com](https://vercel.com):
1. Import your repository
2. Vercel auto-detects Vite
3. Deploy with one click

**Custom Domain**: Add in Vercel dashboard → Settings → Domains

### 2. Netlify

**Drag-and-drop or Git-based deployment**

**Option A: Drag & Drop**
1. Build locally: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag `dist/` folder to deploy

**Option B: Git**
1. Connect repository at netlify.com
2. Build command: `npm run build`
3. Publish directory: `dist`

**Custom Domain**: Settings → Domain management

### 3. GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
"deploy": "vite build && gh-pages -d dist"

# Deploy
npm run deploy
```

Access at: `https://yourusername.github.io/carshield-demo`

### 4. AWS S3 + CloudFront

**For enterprise hosting with CDN**

```bash
# Build
npm run build

# Sync to S3 (requires AWS CLI)
aws s3 sync dist/ s3://your-bucket-name --delete

# Set bucket for static website hosting
aws s3 website s3://your-bucket-name --index-document index.html

# (Optional) Add CloudFront distribution for HTTPS + global CDN
```

### 5. Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
docker build -t carshield-dashboard .
docker run -p 8080:80 carshield-dashboard
```

### 6. Traditional Web Server

**Apache, Nginx, IIS**

1. Build: `npm run build`
2. Upload `dist/` contents to web server
3. Configure server for SPA routing:

**Nginx** (`nginx.conf`):
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache** (`.htaccess`):
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Environment Variables

For API endpoints, create `.env.production`:

```env
VITE_API_URL=https://api.carshield.com
VITE_API_KEY=your_api_key
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Performance Checklist

Before deploying:

✅ Run `npm run build` and check bundle size  
✅ Test production build locally: `npm run preview`  
✅ Enable HTTPS (most hosts provide free SSL)  
✅ Enable CDN for static assets  
✅ Configure caching headers  
✅ Add CSP headers for security  
✅ Test on mobile devices  
✅ Run Lighthouse audit  

## Custom Domain Setup

Most platforms support custom domains:

1. **Add domain** in hosting platform
2. **Update DNS**:
   - A record: Point to platform IP
   - Or CNAME: Point to platform domain
3. **Enable SSL** (usually automatic)

Example DNS (Vercel):
```
Type: CNAME
Name: dashboard (or @)
Value: cname.vercel-dns.com
```

## Monitoring

Consider adding:
- **Analytics**: Google Analytics, Plausible
- **Error Tracking**: Sentry, LogRocket
- **Uptime Monitoring**: Uptime Robot, Pingdom

## Troubleshooting

**Blank page after deployment**:
- Check browser console for errors
- Verify base URL in `vite.config.js`
- Check server is serving `index.html` for all routes

**Assets not loading**:
- Verify `base` path in vite config
- Check CORS headers if API calls fail
- Ensure all files uploaded from `dist/`

**Build fails**:
- Clear `node_modules` and reinstall
- Check Node version (16+ required)
- Verify all dependencies in package.json

## Support

For deployment issues:
1. Check build logs
2. Test production build locally first
3. Verify environment variables
4. Check hosting platform documentation

---

**Happy Deploying! 🚀**
