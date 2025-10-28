# Tech Stack Document for AI Presentation Builder

This document explains the technology choices behind the **AI Presentation Builder** starter template in plain language. It covers the frontend, backend, infrastructure, third-party services, security, performance, and a summary of how everything works together.

## 1. Frontend Technologies

We chose a modern set of tools to build a fast, responsive, and easy-to-use interface.

- **Next.js (App Router)**
  - Provides the overall framework for pages, routing, and server-side logic.
  - Supports React Server Components for fast initial load times.
- **React & TypeScript**
  - React makes building interactive UIs straightforward.
  - TypeScript adds type checking to catch errors early and improve developer experience.
- **Tailwind CSS**
  - A utility-first CSS framework that speeds up styling by using small, reusable classes.
  - Ensures a consistent look without writing custom CSS from scratch.
- **Shadcn/ui**
  - A ready-made component library (cards, inputs, buttons, carousels) built on Tailwind CSS.
  - Lets us assemble polished UI elements quickly.
- **next-themes**
  - Adds built-in support for dark mode and easy theme switching.
  - Uses CSS variables so we can one-click toggle between light/dark or future custom themes.

**How these choices enhance UX:**
- Fast initial page loads and smooth transitions (thanks to Next.js and React Server Components).
- Consistent, polished styling with minimal effort (Tailwind + Shadcn/ui).
- Built-in dark mode and easy theming to match user preferences.
- TypeScript ensures fewer runtime errors, leading to a more stable interface.

## 2. Backend Technologies

Our backend stack powers user management, data storage, and AI integration in a secure, scalable way.

- **Next.js API Routes**
  - Serve as our backend endpoints (e.g., `/api/auth`, `/api/presentations/generate`).
  - Keep server logic close to the frontend for simpler development.
- **Better Auth**
  - Handles user registration, login, logout, and session protection.
  - Ensures only authenticated users can create and view presentations.
- **PostgreSQL**
  - A reliable, open-source relational database for storing users, presentations, and slides.
- **Drizzle ORM**
  - A type-safe database library that maps your TypeScript models to SQL tables.
  - Makes it easy to read/write data without raw SQL and catches mistakes at compile time.
- **Gemini AI SDK** (to be added)
  - Provides a simple way to call Google’s Gemini AI from server code.
  - Encapsulated in a dedicated service file (`/lib/gemini.ts`) to keep API keys safe.

**How it all works together:**
1. A user submits a prompt via the frontend form.  
2. The Next.js API route `/api/presentations/generate` receives it.  
3. The route calls the Gemini service to generate slide content.  
4. Received data is parsed and saved to PostgreSQL through Drizzle ORM.  
5. The route returns the new presentation ID for the frontend to display.

## 3. Infrastructure and Deployment

We chose tools that make local development, testing, and production deployment as smooth as possible.

- **Docker**
  - Provides a consistent local development environment.
  - Ensures everyone on the team runs the same versions of Node, Postgres, etc.
- **Vercel**
  - Hosts the frontend and backend in one place, with automatic deployments on each push.
  - Manages environment variables securely and scales servers as traffic grows.
- **Git & GitHub**
  - Version control for tracking changes and collaborating.
  - Pull requests and code reviews help maintain code quality.
- **CI/CD**
  - Vercel runs integration builds automatically.
  - (Optional) GitHub Actions can run tests and lint checks before merging.

**Benefits:**
- **Reliability:** Automated builds and deployments reduce human error.
- **Scalability:** Vercel can spin up more instances when traffic increases.
- **Developer efficiency:** Docker and Git workflows keep everyone in sync.

## 4. Third-Party Integrations

We integrate with external services that add core functionality without reinventing the wheel.

- **Better Auth**
  - Outsources secure user authentication (registration, sessions, password reset).
- **Gemini AI API**
  - Leverages Google’s advanced AI to generate presentation content from prompts.
- **Vercel Environment Variables**
  - Securely store sensitive keys (database URL, Gemini API key) so they never appear in code.

**How they enhance functionality:**
- Speed up development by using battle-tested auth and AI services.
- Keep sensitive operations (like AI calls and key management) safely on the server.

## 5. Security and Performance Considerations

We’ve put safeguards and optimizations in place to protect data and keep the app fast.

- **Authentication & Sessions**
  - Managed by Better Auth, ensuring only legitimate users can access protected routes.
- **Environment Variables**
  - All secrets (API keys, database credentials) live in secure env files or Vercel’s secret store.
- **Input Validation**
  - We plan to use a library like Zod on the server side to validate prompts and prevent malicious data.
- **Error Handling**
  - API routes include try/catch logic and return clear error messages using UI alerts or toasts.
- **Type Safety**
  - TypeScript and Drizzle ORM catch mismatches at compile time, reducing runtime errors.
- **Performance**
  - React Server Components load only the data needed for each page.
  - Tailwind’s utility classes lead to smaller CSS bundles.
  - Next.js image and script optimizations ensure fast load times.

## 6. Conclusion and Overall Tech Stack Summary

This tech stack is designed to get your AI-powered presentation platform up and running quickly, while ensuring long-term maintainability and scalability.

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Shadcn/ui, next-themes  
- **Backend:** Next.js API routes, Better Auth, PostgreSQL, Drizzle ORM, Gemini AI SDK  
- **Infrastructure:** Docker, Vercel, Git/GitHub, CI/CD  
- **Integrations:** Better Auth for user management, Gemini AI for content generation  
- **Security & Performance:** Environment variables, input validation, type safety, server-side rendering, optimized assets  

These choices align with our goal of providing a **production-ready**, **developer-friendly** starter template for building a Gamma.app-style AI Presentation Builder. By leveraging modern frameworks, secure services, and best practices, we enable rapid development without sacrificing reliability or user experience.