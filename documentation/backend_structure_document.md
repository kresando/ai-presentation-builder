# AI Presentation Builder Backend Structure Document

## 1. Backend Architecture

We’ve built the backend using Next.js API routes on a Node.js runtime, following a clear Backend-for-Frontend (BFF) pattern. Key points:

- The Next.js App Router handles both page rendering and serverless API endpoints in one codebase.  
- We keep business logic on the server side to protect API keys and simplify data flows.  
- Drizzle ORM sits between our API routes and the database, offering type-safe queries and migrations.  

This setup supports:

- **Scalability:** Serverless functions on Vercel automatically scale up or down based on demand.  
- **Maintainability:** Clear separation of API routes, services (like `lib/gemini.ts`), and database schema files keeps our code organized.  
- **Performance:** Using Next.js Server Components and caching headers we minimize data fetching work on the client side.

---

## 2. Database Management

We use PostgreSQL as our relational database, managed through Drizzle ORM:

- **Type:** SQL (PostgreSQL)  
- **ORM:** Drizzle offers a schema-first approach with TypeScript support.  
- **Connection Pooling:** Managed by the Postgres driver with pooling settings tailored for serverless environments.  
- **Migrations:** Drizzle handles schema changes via versioned migrations stored in the repo.  

Data is organized in tables for users, presentations, and slides. We store structured slide content in a JSONB column for flexibility. All database credentials live in environment variables and are never checked into source control.

---

## 3. Database Schema

### Overview (Human-Readable)

- **users**: Holds each user’s account details (email, hashed password, timestamps).  
- **presentations**: Tracks individual presentation metadata such as title, theme, creation date, and owner (user ID).  
- **slides**: Contains the actual slide data for each presentation in a JSON format, with ordering info and a foreign key to the presentation.

### SQL Schema (PostgreSQL)

```sql
-- users table (existing)
CREATE TABLE users (
  id             SERIAL PRIMARY KEY,
  email          TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- presentations table
CREATE TABLE presentations (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  theme          TEXT NOT NULL DEFAULT 'default',
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- slides table
CREATE TABLE slides (
  id               SERIAL PRIMARY KEY,
  presentation_id  INTEGER NOT NULL REFERENCES presentations(id) ON DELETE CASCADE,
  slide_index      INTEGER NOT NULL,
  content          JSONB NOT NULL,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (presentation_id, slide_index)
);
```

---

## 4. API Design and Endpoints

We follow a RESTful approach using Next.js API routes.

- **Authentication Routes** (`/api/auth/...`)
  - Handles sign-up, login, logout, session refresh via Better Auth.  

- **Presentation Routes** (`/api/presentations`)
  - `GET /api/presentations` – List all presentations for the current user.  
  - `POST /api/presentations` – Create a new presentation record (metadata only).  
  - `GET /api/presentations/[id]` – Fetch a single presentation with its slides.  
  - `DELETE /api/presentations/[id]` – Remove a presentation and its slides.  

- **Generation Route**
  - `POST /api/presentations/generate` – Accepts a prompt from the client, calls the Gemini AI SDK in `lib/gemini.ts`, parses the JSON slide output, writes records to both `presentations` and `slides`, and returns the new presentation ID.

Each route checks the user’s session, validates input with a library like Zod, and returns clear HTTP statuses with JSON responses.

---

## 5. Hosting Solutions

- **Backend & Frontend:** Vercel serverless platform.  
  - Automatic scaling: functions spin up on demand.  
  - Global CDN: static assets and pages are cached at edge locations.  
  - Zero-config deployments from the Git repo.  

- **Database:** Hosted on a managed PostgreSQL instance (for example, AWS RDS or Neon).
  - Automated backups and point-in-time restores.  
  - High availability via PostgreSQL replicas if needed.  

This combination keeps operational overhead low while ensuring reliability and cost-effective scaling.

---

## 6. Infrastructure Components

- **Load Balancing & Edge Network**
  - Vercel automatically routes traffic through its global edge network, distributing load and reducing latency.

- **Cache Control**
  - Next.js routes and assets use HTTP headers (`Cache-Control`, `stale-while-revalidate`) to speed up repeat visits.

- **Database Connection Pooling**
  - Managed within each serverless function to avoid exhausting connections in burst traffic.

- **Content Delivery Network (CDN)**
  - Vercel’s built-in CDN serves static assets (images, CSS, JS) close to users worldwide.

---

## 7. Security Measures

- **Authentication & Authorization**
  - Better Auth handles secure user sessions with HTTP-only cookies.  
  - Protected API routes reject unauthorized requests with a 401 status.  

- **Data Encryption**
  - TLS everywhere: all traffic to Vercel and PostgreSQL is encrypted in transit.  
  - At-rest encryption is managed by the database host.  

- **Environment Variables**
  - Secrets (DB URL, Gemini API key) live in Vercel’s encrypted settings, never in code.

- **Input Validation**
  - We use Zod schemas in API routes to guard against malformed or malicious data.  

- **Rate Limiting**
  - To protect against abuse, the generation endpoint can limit requests per user or IP (using a simple in-memory or Redis-backed counter).

---

## 8. Monitoring and Maintenance

- **Logging & Error Tracking**
  - Integrate Sentry (or Logflare) to capture unhandled errors and performance issues in our serverless functions.  

- **Performance Monitoring**
  - Vercel Analytics provides insight into edge function latency and cold start times.  

- **Health Checks & Alerts**
  - Uptime monitoring (e.g., Pingdom or Upptime) pings critical endpoints and notifies on failures.  

- **Database Backups & Migrations**
  - Automated daily backups for disaster recovery.  
  - Drizzle migration scripts run during deploys to keep the schema in sync.

- **Regular Updates**
  - Dependabot or Renovate keeps dependencies up to date.  
  - Scheduled reviews of third-party library advisories.

---

## 9. Conclusion and Overall Backend Summary

Our backend blends Next.js serverless API routes with a managed PostgreSQL database to deliver a secure, scalable, and maintainable foundation for the AI Presentation Builder.  

- We use a **BFF pattern** to centralize AI calls, database access, and authentication logic.  
- **Drizzle ORM** ensures type safety and simple migrations for our SQL schema.  
- Hosting on **Vercel** with a managed Postgres service provides reliability and low-touch operations.  
- Infrastructure components like global CDNs, cache headers, and automated backups boost performance and resilience.  
- Comprehensive security measures and monitoring tools keep user data safe and help us catch issues early.

This structure aligns perfectly with the project goal: let developers focus on AI-powered slide generation while the backend handles the heavy lift of authentication, data storage, and reliable delivery.