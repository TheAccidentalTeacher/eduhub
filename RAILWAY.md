# Railway Deployment Guide for EduCraft Worksheet Generator

## Quick Railway Deployment

### 1. Connect Repository to Railway
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `eduhub` repository

### 2. Environment Variables
Add these environment variables in Railway dashboard:

**Core Required:**
- **OPENAI_API_KEY**: Your OpenAI API key (starts with `sk-`)

**AI Image Generation (Recommended):**
- **STABILITY_AI_API_KEY**: Stability AI key for high-quality educational diagrams

**Optional Enhancements:**
- **PEXELS_API_KEY**: For stock photos
- **PIXABAY_API_KEY**: For additional stock images  
- **UNSPLASH_ACCESS_KEY**: For professional stock photos
- **YOUTUBE_API_KEY**: For educational videos
- **NEWS_API_KEY**: For current events integration
- **GIPHY_API_KEY**: For educational GIFs

> **💡 Pro Tip**: The system uses intelligent image selection - DALL-E/Stability AI for custom content, stock photos for real-world items. Without these keys, it falls back to curated educational images.

### 3. Deploy
Railway will automatically:
- Detect it's a Node.js/Next.js project
- Run `npm install` and `npm run build`
- Start the app with `npm start`
- Assign a public URL

## Railway Configuration Details

- **Build Command**: `npm run build` (automatic)
- **Start Command**: `npm start` (configured in package.json with $PORT)
- **Node Version**: Detected automatically
- **Output**: Standalone build for better Railway compatibility

## Advantages of Railway over Vercel

✅ **Simpler deployment** - Less configuration needed  
✅ **Better environment variable handling**  
✅ **More predictable builds**  
✅ **Less vendor lock-in**  
✅ **Clearer pricing**  
✅ **Better for full-stack apps**  

Your app will be available at: `https://your-app-name.railway.app`

## Local Development
```bash
npm run dev
# App runs on http://localhost:3000
```

## Production Build Test
```bash
npm run build
npm start
```
