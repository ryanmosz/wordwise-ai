# WordWise AI 🚀

WordWise AI is an intelligent marketing copy assistant that provides real-time AI-powered suggestions to improve your writing. It analyzes text as you type and offers contextual improvements for grammar, vocabulary, clarity, and tone.

![WordWise AI Demo](https://img.shields.io/badge/status-beta-yellow) ![License](https://img.shields.io/badge/license-MIT-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) ![React](https://img.shields.io/badge/React-19.1-blue)

## 🎥 Demo

[View Live Demo](https://wordwise-ai-git-feature-80-frontend-backend-ryanmosz.vercel.app) (Vercel Preview)

## ✨ Features

### Core Functionality
- **Real-time Analysis**: Automatic text analysis with 2-second debounce
- **Visual Feedback**: Color-coded underlines for different suggestion types
- **Interactive Suggestions**: Hover to see details, click to accept/reject
- **Document Management**: Create, edit, and organize multiple documents
- **Auto-save**: Automatic saving with visual indicators

### Suggestion Types
- 🟦 **Grammar**: Fix grammatical errors and improve sentence structure
- 🟪 **Vocabulary**: Enhance word choice and professional tone
- 🟨 **Clarity**: Simplify complex sentences and improve readability
- 🟩 **Tone**: Adjust writing style to match your brand voice

## 🏗 Architecture

```
wordwise/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── types/        # TypeScript types
│   └── public/          # Static assets
├── supabase/         # Backend services
│   └── functions/    # Edge functions for AI analysis
├── docs/            # Documentation
└── tests/           # Test suites
```

### Tech Stack
- **Frontend**: React 19, TypeScript, TipTap Editor, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **AI**: OpenAI GPT-4 (via Supabase Edge Functions)
- **Deployment**: Vercel, Docker

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Supabase account
- OpenAI API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ryanmosz/wordwise-ai.git
   cd wordwise-ai
   ```

2. **Set up environment variables**
   ```bash
   # In frontend/.env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Start with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Open http://localhost:3000
   - Login with test credentials: `test@wordwise.ai`

### Manual Setup (without Docker)

```bash
cd frontend
npm install
npm run dev
```

## 📋 Current Status

### ✅ Completed Features
- Real-time text analysis with AI suggestions
- Visual indication of different suggestion types
- Hover tooltips with suggestion details
- Accept/reject functionality
- Document persistence with auto-save
- User authentication
- Responsive design

### 🚧 Known Limitations
- AI may miss some complex grammar errors
- Character position calculations sometimes require client-side correction
- Suggestion marks occasionally persist after accepting/rejecting
- Some edge cases in multi-line text handling

### 🔜 Roadmap
- [ ] Batch suggestion processing
- [ ] Custom writing style profiles
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Plugin system for custom rules
- [ ] Mobile app

## 🧪 Testing

We maintain comprehensive test coverage:

### Test Pages
Access test pages at `/test/*` routes:
- `/test/ai-service` - AI integration testing
- `/test/debounce` - Debouncing behavior
- `/test/loading-states` - Loading state management
- `/test/suggestion-colors` - Color coding system
- `/test/suggestion-mark` - TipTap mark implementation

### Running Tests
```bash
cd frontend
npm test          # Run unit tests
npm run e2e       # Run E2E tests
```

## 📚 Documentation

- [Frontend Documentation](./frontend/README.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Local Development](./LOCAL_DEV_ENVIRONMENT.md)
- [Demo Script](./DEMO_SCRIPT.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [TipTap](https://tiptap.dev/) - The headless editor framework
- Powered by [Supabase](https://supabase.com/) - The open source Firebase alternative
- AI capabilities via [OpenAI](https://openai.com/)
- Deployed on [Vercel](https://vercel.com/)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/ryanmosz/wordwise-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ryanmosz/wordwise-ai/discussions)
- **Email**: support@wordwise.ai

---

<p align="center">Made with ❤️ by Ryan Moszynski</p> 