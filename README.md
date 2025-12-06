QuizMaster is a frontend-only, AI-powered quiz platform that allows educators, trainers, and content creators to generate interactive quizzes from any topic in seconds. No backend, no databases, no authentication required - everything works directly in your browser!

Perfect For:
Teachers: Create assessments quickly for classroom use

Corporate Trainers: Build knowledge checks for workshops

Content Creators: Add interactive quizzes to your content

Students: Create study aids and practice tests

🚀 Key Features
🤖 AI-Powered Generation
Instant Quiz Creation: Enter any topic, get a complete quiz in seconds

Google Gemini AI: Powered by Google's latest AI model

Smart Question Mix: Automatically generates MCQ, True/False, and Short Answer questions

Educational Quality: Fact-based questions with detailed explanations

Fallback System: Works even without internet/API access

📝 Complete Quiz Creation
Manual Editing: Full control over every question

Multiple Formats: Support for all question types

Custom Scoring: Set points per question (1-10)

Difficulty Levels: Tag questions as Easy/Medium/Hard

Time Limits: Global or per-question timers

Shuffling: Randomize questions and answers

🎮 Interactive Quiz Experience
Mobile-First Design: Optimized for all devices

Instant Feedback: See results immediately or at the end

Progress Tracking: Visual progress bars and counters

Timer with Warnings: Visual alerts when time is running low

Pause/Resume: Take breaks during long quizzes

📊 Advanced Analytics
Score Distribution: Visual charts showing performance

Question Analysis: Identify difficult questions

Time Tracking: See average time per question

Export Data: Download results as CSV or JSON

Leaderboard: Track top performers (optional)

🔗 Easy Sharing
One-Click Links: Share via URL with automatic copying

QR Codes: Mobile-friendly access

Embed Snippets: Add quizzes to websites/blogs

Social Sharing: Direct sharing to Twitter, Facebook, Email

No Login Required: Anyone can take shared quizzes

💾 Data Management
LocalStorage: All data persists in your browser

Import/Export: Backup and restore quizzes as JSON

Duplicate Quizzes: Create copies with one click

Storage Monitoring: See how much space you're using

Offline Capable: Take quizzes without internet

🛠️ Tech Stack
Frontend Framework
React 18 - Latest React with concurrent features

TypeScript - Full type safety for better development

Vite - Lightning fast build tool and dev server

State Management & Data
Zustand - Lightweight state management

LocalStorage API - Client-side data persistence

React Hook Form - Form handling with validation

Zod - Schema validation

UI & Styling
Tailwind CSS - Utility-first CSS framework

Framer Motion - Smooth animations

Lucide React - Beautiful icon set

Recharts - Data visualization library

React Hot Toast - Notification system

External APIs & Libraries
Google Gemini API - AI question generation

LZString - URL compression for sharing

QRCode.react - QR code generation

Date-fns - Modern date utilities

📁 Project Structure
text
quizmaster/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/        # Buttons, inputs, modals, etc.
│   │   ├── quiz/          # Quiz-specific components
│   │   ├── analytics/     # Charts and data visualization
│   │   ├── sharing/       # Share interface components
│   │   └── layout/        # Header, footer, layout
│   ├── pages/             # Application pages
│   │   ├── HomePage.tsx
│   │   ├── CreateQuizPage.tsx
│   │   ├── TakeQuizPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   └── ShareQuizPage.tsx
│   ├── store/             # Zustand state management
│   │   └── quizStore.ts   # Main application store
│   ├── types/             # TypeScript definitions
│   │   └── quiz.ts        # Core data types
│   ├── utils/             # Helper functions
│   │   ├── constants.ts   # App constants
│   │   ├── helpers.ts     # Utility functions
│   │   └── cn.ts          # Class name utilities
│   ├── App.tsx            # Main app component
│   └── main.tsx           # App entry point
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── README.md              # This file
🚀 Getting Started
Prerequisites
Node.js 18 or higher

npm, yarn, or pnpm

(Optional) Google Gemini API key for AI features

Installation
Clone the repository

bash
git clone https://github.com/yourusername/quizmaster.git
cd quizmaster
Install dependencies

bash
npm install
# or
yarn install
# or
pnpm install
Set up environment variables

bash
cp .env.example .env
Edit .env file and add your Gemini API key (optional):

env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_APP_URL=http://localhost:5173
Start the development server

bash
npm run dev
Open your browser
Navigate to http://localhost:5173

Building for Production
bash
# Create production build
npm run build

# Preview production build locally
npm run preview
📱 Pages & Routes
Main Pages
Home (/) - Landing page with demo and features

Create Quiz (/create) - Quiz creation interface with AI

Edit Quiz (/create/:id) - Edit existing quizzes

Take Quiz (/take/:id) - Interactive quiz taking

Dashboard (/dashboard) - Manage all your quizzes

Analytics (/analytics/:id) - View quiz performance data

Share (/share/:id) - Generate shareable links and codes

User Flows
Creating a Quiz
text
Home → Create Quiz → Enter Topic → AI Generates → Edit → Save → Share
Taking a Quiz
text
Receive Link → Start Quiz → Answer Questions → Instant Feedback → View Results
Analyzing Results
text
Dashboard → Select Quiz → Analytics → View Charts → Export Data
🔧 Configuration
Environment Variables
Variable	Description	Required	Default
VITE_GEMINI_API_KEY	Google Gemini API key for AI features	No	(Uses fallback)
VITE_APP_URL	Base URL for shareable links	No	http://localhost:5173
Browser Support
✅ Chrome 90+

✅ Firefox 88+

✅ Safari 14+

✅ Edge 90+

✅ Mobile browsers (iOS 14+, Android 10+)

Performance
First Contentful Paint: < 1.5s

Time to Interactive: < 3.0s

Bundle Size: < 200KB gzipped

Lighthouse Score: > 90

🎨 Customization
Styling
The app uses Tailwind CSS with a custom configuration. Modify tailwind.config.js to:

Change color schemes

Add custom fonts

Adjust spacing scales

Add custom animations

Theming
Light/Dark Mode: Automatic based on system preference

Custom Colors: Primary, success, warning, error colors defined

Responsive Breakpoints: Mobile-first approach

Extending Features
The modular architecture makes it easy to:

Add new question types

Integrate additional AI providers

Add backend synchronization

Implement user accounts

Add payment processing

🤝 Contributing
Contributions are welcome! Here's how you can help:

Fork the repository

Create a feature branch

bash
git checkout -b feature/amazing-feature
Commit your changes

bash
git commit -m 'Add some amazing feature'
Push to the branch

bash
git push origin feature/amazing-feature
Open a Pull Request

Development Guidelines
Follow TypeScript best practices

Write meaningful commit messages

Add tests for new features

Update documentation as needed

Follow the existing code style

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgements
Google Gemini API for AI capabilities

React Team for the amazing framework

Tailwind CSS for the utility-first approach

Vite Team for the fast build tool

All contributors who help improve QuizMaster

📞 Support
Issues: GitHub Issues

Email: your-email@example.com

Twitter: @quizmaster_app

🚀 Deployment
Vercel (Recommended)
bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
Netlify
bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
GitHub Pages
bash
npm run build
# Upload /dist folder to GitHub Pages
🎯 Why QuizMaster?
For Educators
Save Time: Reduce quiz creation from 60 minutes to 3 minutes

Better Engagement: Interactive format keeps students engaged

Insightful Analytics: Identify knowledge gaps instantly

For Developers
Clean Codebase: Well-structured, documented TypeScript

Modern Stack: Uses latest React and tooling

Easy to Extend: Modular architecture for customization

No Backend Hassle: Client-only architecture

For Everyone
Free to Use: No subscriptions, no hidden costs

Privacy Focused: Data stays on your device

Always Accessible: Works offline after first load

Share Anywhere: No login required for quiz takers

Made with ❤️ for educators, trainers, and learners worldwide

⭐ Star this repo if you find it useful! ⭐

