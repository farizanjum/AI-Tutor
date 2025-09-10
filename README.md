# 🤖 IntelliLearn AI - Advanced Learning Assistant

[![Deploy to Netlify](https://img.shields.io/badge/Deploy%20to-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/intellilearn-ai)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> 🚀 **IntelliLearn AI** is an advanced AI-powered learning assistant that provides personalized education and skill development through intelligent tutoring, practice problems, and comprehensive explanations.

## ✨ Features

- 🎯 **Personalized Learning Plans** - Adaptive learning paths based on your skill level
- 🧠 **Intelligent Explanations** - Multi-level explanations (concise, worked examples, deep dive)
- 📚 **Practice Problems** - Interactive coding challenges and math problems
- 🎮 **Quick Quizzes** - Instant knowledge checks with immediate feedback
- 🔄 **Real-time Conversations** - Natural language tutoring experience
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎨 **Beautiful UI** - Modern, intuitive interface with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Google Gemini API key (get it from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/intellilearn-ai.git
   cd intellilearn-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Add your Gemini API key to `.env.local`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment to Netlify

### One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/intellilearn-ai)

### Manual Deployment

1. **Fork this repository** to your GitHub account

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select this repository

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: `18`

4. **Add Environment Variables**
   In Netlify dashboard:
   - Go to Site Settings → Environment Variables
   - Add: `GEMINI_API_KEY` = your_api_key

5. **Deploy**
   - Click "Deploy site"
   - Your site will be live at `https://your-site-name.netlify.app`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | ✅ Yes |

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📁 Project Structure

```
intellilearn-ai/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── tutor/         # Main AI tutor API
│   │   └── generate-flashcards/ # Flashcard generation
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ai-tutor.tsx       # Main AI tutor component
│   ├── ui/               # UI components (shadcn/ui)
│   └── theme-provider.tsx # Theme provider
├── lib/                   # Utility functions
│   └── gemini.ts          # Gemini AI integration
├── public/               # Static assets
├── styles/               # Additional styles
└── netlify.toml          # Netlify deployment config
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI**: Google Gemini 1.5 Flash
- **Deployment**: Netlify
- **Icons**: Lucide React

## 🎯 Learning Features

### Personalized Learning
- Adaptive difficulty based on user performance
- Progress tracking and recommendations
- Skill gap analysis

### Interactive Content
- Real-time code execution for programming problems
- Step-by-step math solutions
- Interactive quizzes with instant feedback

### Comprehensive Explanations
- **Quick Summary**: Concise overview
- **Worked Examples**: Detailed step-by-step solutions
- **Deep Dive**: Advanced concepts and theory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Google Gemini](https://ai.google.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Deployed on [Netlify](https://netlify.com/)

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the [documentation](./docs)
- Contact the maintainers

---

**Happy Learning! 🎓**

Made with ❤️ for learners worldwide.