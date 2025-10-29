# Project Requirements Document: AI Presentation Builder

---

## 1. Project Overview

The AI Presentation Builder is a full-stack web application starter template built on Next.js. It provides a turnkey foundation for developers who want to build a Gamma.app-style platform powered by Google’s Gemini AI. At its core, this project solves the repetitive setup work—user accounts, database integration, theming, and UI scaffolding—so you can immediately focus on the AI slide generation feature.

The main purpose is to let authenticated users enter a topic or prompt and instantly receive a structured, editable presentation. Key objectives include fast project kickoff, a secure multi-user environment, and a modular UI that scales. Success is measured by how quickly a developer can clone the repo, set up environment variables, and generate their first AI-driven slide deck without writing boilerplate.

---

## 2. In-Scope vs. Out-of-Scope

### In-Scope (Version 1.0)

- User authentication (registration, login, logout) using Better Auth
- PostgreSQL database integration via Drizzle ORM
- Core data models: users, presentations, slides
- Prompt input form and validation
- API route `/api/presentations/generate` that:
  - Receives user prompt
  - Calls Gemini AI SDK
  - Parses JSON response into slide records
  - Persists data to the database
- Presentation listing and detail viewer pages
- Basic editing capabilities (title, theme switcher, reorder slides)
- Responsive UI components with Shadcn/ui & Tailwind CSS
- Light/dark theming using `next-themes`
- Docker configuration for local development
- Deployment configuration for Vercel

### Out-of-Scope (Later Phases)

- Background job queue for AI generation (e.g., Inngest)
- Real-time slide streaming (SSE or WebSockets)
- Advanced client-side state management libraries beyond React Context
- Mobile app or React Native support
- Custom presentation editor with drag-and-drop graphics
- Rate limiting and billing for API usage (basic placeholder only)
- Accessibility compliance audits beyond basic ARIA attributes

---

## 3. User Flow

A new user lands on the homepage and clicks “Sign Up.” They register with email and password, then are redirected to the dashboard. On the dashboard, they see a list of existing presentations (empty on first visit) and a “New Presentation” button. Clicking it takes them to a prompt input form with a single text field and a theme selector.   

When they submit a prompt, the app shows a loading progress indicator. The backend `/api/presentations/generate` route calls Gemini AI, saves returned slides to the database, and returns the new `presentationId`. The client then automatically redirects the user to `/presentations/[id]`, where they can scroll through generated slides, edit slide titles or content, switch themes, and save changes. A sidebar allows navigation back to the dashboard or logging out.

---

## 4. Core Features

- **Authentication Module**: Registration, login, logout, sessions (Better Auth)
- **Database Schema**:
  - `users` table (existing)
  - `presentations` table (id, user_id, title, theme, created_at)
  - `slides` table (id, presentation_id, order, type, content)
- **Prompt Input Form**: Validated with Zod (server-side)
- **AI Generation API**: `/api/presentations/generate`
  - Calls `/lib/gemini.ts` service
  - Handles errors and edge cases
- **Presentation Dashboard**: List, delete, duplicate presentations
- **Presentation Viewer/Editor**: Carousel or vertical scroll of Slide components
- **Theming**: Light/dark mode + custom CSS variable themes
- **UI Components**: Cards, Buttons, Inputs, Alerts, Progress, Carousel (Shadcn/ui)
- **Deployment & DevOps**: Dockerfile, `docker-compose.yml`, Vercel config

---

## 5. Tech Stack & Tools

- **Frontend & API Framework**: Next.js (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui component library
- **Authentication**: Better Auth (NextAuth-style solution)
- **Database & ORM**: PostgreSQL, Drizzle ORM
- **AI Integration**: Gemini AI SDK (`@google/generative-ai`) in `/lib/gemini.ts`
- **Validation**: Zod for input schema validation
- **Containerization**: Docker, Docker Compose
- **Hosting**: Vercel for production
- **IDE Plugins (optional)**: Cursor for AI code assistance, Windsurf for Git branching

---

## 6. Non-Functional Requirements

- **Performance**: API response under 2 seconds for small prompts; UI load times < 200 ms
- **Security**: 
  - Store API keys in environment variables only
  - Use HTTPS for all client–server traffic
  - Server-side validation to prevent injection attacks
- **Scalability**: Architecture should support horizontal scaling on Vercel
- **Usability**: Responsive design (mobile, tablet, desktop), basic ARIA attributes
- **Maintainability**: Type-safe codebase; clear file structure; modular components
- **Reliability**: 99% uptime SLA assumed from Next.js + Vercel stack

---

## 7. Constraints & Assumptions

- **Gemini AI Availability**: Assumes access to Gemini AI SDK and API keys
- **Database Access**: PostgreSQL instance must be provisioned and reachable
- **Hosting Limitations**: Vercel cold starts may add latency; Docker for local parity only
- **Developer Expertise**: Familiarity with TypeScript, React, and Next.js
- **Cost Sensitivity**: AI calls may incur Google Cloud charges; budgeting required

---

## 8. Known Issues & Potential Pitfalls

- **AI Rate Limits**: Gemini API may throttle requests—handle `429` responses gracefully.
- **Generation Latency**: Long-running AI calls can time out—consider background jobs in future.
- **Error Handling**: Must cover API downtime, malformed responses, and content moderation failures. Use try/catch and user-friendly alerts.
- **Data Schema Evolution**: Storing slides as `jsonb` could complicate migrations; plan versioning strategy.
- **Theming Inconsistencies**: Custom CSS variables must be well-documented to avoid drift between components.

---

This PRD outlines all necessary details to build and extend the AI Presentation Builder. With this as the single source of truth, AI agents and developers can proceed to generate subsequent technical documents—Tech Stack specs, Frontend Guidelines, Backend Architecture diagrams—without ambiguity.
