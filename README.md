# EduCraft Worksheet Generator

A modern AI-powered worksheet generator built with Next.js that creates customized educational content for various subjects and grade levels.

## Features

- 🎯 **Smart Topic Selection**: Choose from 20+ comprehensive educational topics
- 🎨 **Style Customization**: Colorful, minimal, or playful worksheet styles
- 📚 **Grade-Appropriate Content**: Pre-K through College level support
- 🤖 **AI-Powered Generation**: Uses GPT-4 for intelligent content creation
- 📄 **Multiple Question Types**: Multiple choice, fill-in-blank, short answer, true/false
- ✅ **Answer Keys**: Complete with explanations for educators
- 📱 **Responsive Design**: Works perfectly on desktop and mobile

## Quick Start

### Prerequisites
- Node.js 18+ 
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd educraft-worksheet-generator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Railway (Recommended)

1. Push your code to GitHub
2. Connect your repository to Railway
3. Add your `OPENAI_API_KEY` environment variable in Railway dashboard
4. Deploy! Railway will auto-detect and deploy your Next.js app

See [RAILWAY.md](RAILWAY.md) for detailed deployment instructions.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 API
- **Deployment**: Railway optimized

## Project Structure

```
├── app/
│   ├── api/generate-worksheet/    # API endpoint for worksheet generation
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main worksheet generator page
├── data/
│   └── topics.ts                # Educational topics and subtopics data
├── types/
│   └── worksheet.ts             # TypeScript type definitions
├── railway.toml                 # Railway deployment configuration
└── RAILWAY.md                   # Railway deployment guide
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key for worksheet generation | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
