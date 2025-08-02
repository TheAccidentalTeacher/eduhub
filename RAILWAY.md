# Railway Deployment Guide for EduCraft Worksheet Generator

## Quick Railway Deployment

### 1. Connect Repository to Railway
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `eduhub` repository

### 2. Environment Variables
Add this environment variable in Railway dashboard:
- **OPENAI_API_KEY**: Your OpenAI API key (starts with `sk-`)

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
