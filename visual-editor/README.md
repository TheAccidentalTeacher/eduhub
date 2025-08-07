# 🎨 Visual Worksheet Editor

Your **dream interface** for creating educational worksheets! This Azure-powered application provides drag-and-drop image editing, AI content safety, and professional worksheet templates.

## ✨ Features

- **🎯 Drag & Drop Interface** - Just like the design tools you showed me!
- **🛡️ Azure Content Safety** - Automatic child-appropriate content checking
- **🔍 Smart Image Search** - AI-powered educational image discovery
- **🌐 Multi-language Support** - Azure Translator integration
- **📱 Modern Design** - Clean, professional templates matching your examples
- **⚡ Real-time Preview** - See changes instantly as you design

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd visual-editor
npm install
```

### 2. Set Up Azure Services (Optional)
```bash
# Copy environment template
cp .env.example .env.local

# Add your Azure service keys to .env.local
# (The app works without Azure keys in development mode)
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see your visual editor!

## 🔧 Azure Integration

The editor connects to your Azure subscription services:

- **AI Content Safety** (5K images/month free)
- **AI Search** (50MB storage free) 
- **AI Translator** (2M characters/month free)
- **Static Web Apps** (100GB bandwidth free)

### Without Azure Keys
The app runs in **development mode** with sample data and mock AI responses.

### With Azure Keys
Enable full AI-powered features by adding your service keys to `.env.local`.

## 📁 Project Structure

```
visual-editor/
├── src/
│   ├── components/           # React components
│   │   ├── ImageLibrary.jsx  # Drag-and-drop image browser
│   │   ├── WorksheetCanvas.jsx # Main editing canvas
│   │   └── ControlPanel.jsx   # Settings and Azure config
│   ├── contexts/            # React context for state management
│   ├── services/            # Azure API integration
│   └── App.jsx              # Main application
├── package.json             # Dependencies and scripts
└── vite.config.js          # Build configuration
```

## 🎯 Integration with Your Current System

This visual editor is designed to work **alongside** your existing worksheet API:

- **Keep your current API** - No breaking changes!
- **Export compatibility** - Generates same data structure
- **Gradual migration** - Use both systems in parallel
- **Template sharing** - Import/export between systems

## 🚀 Deployment Options

### Azure Static Web Apps (Recommended)
```bash
# Deploy to Azure
npm run azure-deploy
```

### Local Development
```bash
# Start with hot reload
npm run dev

# Build for production
npm run build
```

## 🔄 Connecting to Your Existing API

The visual editor can integrate with your current worksheet generation API:

```javascript
// Export from visual editor
const worksheetData = visualEditor.export()

// Send to your existing API
const response = await fetch('/api/generate-enhanced-worksheet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(worksheetData)
})
```

## 🎨 Customization

### Color Themes
Edit `tailwind.config.js` to match your brand colors.

### Templates
Add new worksheet templates in `src/contexts/WorksheetContext.jsx`.

### Azure Services
Configure additional AI services in `src/services/azureService.js`.

## 📞 Support

This visual editor maintains full compatibility with your existing educational content workflow while adding powerful visual design capabilities!

---

**🎯 Your dream drag-and-drop worksheet editor is ready!** 

Start with `npm run dev` and begin creating amazing educational content! 🚀
