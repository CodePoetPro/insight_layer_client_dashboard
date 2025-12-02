# InsightLayer Client Dashboard

A comprehensive Next.js frontend application for InsightLayer, an AI-powered research and insights platform.

## Features

### User-Facing App
- **Authentication**: Sign up, login, logout, password reset
- **Onboarding**: Multi-step wizard for profile setup and preferences
- **Dashboard**: Overview of credits and recent briefs
- **Research Requests**: Create new research requests with detailed configuration
- **Brief Views**: Interactive brief viewer with section navigation
- **Public Sharing**: Shareable brief links for external access

### Analyst Portal
- **Analyst Login**: Separate authentication for analysts
- **Review Queue**: Manage human insight review jobs
- **Review Interface**: Side-by-side AI draft and human insight editor

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** (with dark mode support)
- **shadcn/ui** (component library)
- **React Query** (data fetching)
- **next-themes** (theme management)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── (public)/          # Public routes (landing, auth)
│   ├── (user)/            # Authenticated user routes
│   └── (analyst)/         # Analyst portal routes
├── components/            # React components
│   ├── layout/           # Layout shells
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── api/              # Mock API layer
│   ├── hooks/            # React Query hooks & auth
│   └── utils/            # Utility functions
└── public/               # Static assets
```

## Mock API

The application uses a mock API layer (`lib/api/mock.ts`) that simulates backend functionality:

- **Auth**: Login, signup, password reset
- **User**: Profile management, onboarding
- **Requests**: Create and manage research requests
- **Briefs**: View, regenerate sections, toggle sharing
- **Review**: Human insight review workflow
- **Notifications**: User notifications

### Demo Credentials

**User:**
- Email: `demo@example.com`
- Password: `password`

**Analyst:**
- Email: `analyst@insightlayer.com`
- Password: `password`

## Features in Detail

### Authentication Flow

1. **Sign Up**: Create new account → Redirects to onboarding
2. **Login**: Authenticate → Redirects based on onboarding status
3. **Onboarding**: Complete profile → Access to dashboard
4. **Password Reset**: Request reset link → Reset password

### Research Request Creation

1. Fill in question details (title, core question, context)
2. Configure output preferences (type, audience, depth, time horizon)
3. Add optional subquestions
4. Choose insight mode (AI-only or AI + Human)
5. Submit to create brief

### Brief Viewing

- Section navigation sidebar
- AI-generated content display
- Human insight layer (when available)
- Regenerate sections with custom instructions
- Share/unshare functionality
- Export options (PDF, DOCX)

### Analyst Portal

- View pending review jobs
- Start review process
- Side-by-side AI draft and human insight editor
- Submit human insight layer
- Track job status

## Dark Mode

The application supports light and dark themes with a toggle in the navigation bar. Theme preference is persisted using `next-themes`.

## Development

### Adding New Components

Use shadcn/ui CLI to add components:
```bash
npx shadcn-ui@latest add [component-name]
```

### Type Safety

The project uses strict TypeScript. All API types are defined in `lib/api/types.ts`.

### Mock Data

Mock data is stored in-memory in `lib/api/mock.ts`. Data persists during the session but resets on page refresh.

## Building for Production

```bash
npm run build
npm start
```

## License

MIT

