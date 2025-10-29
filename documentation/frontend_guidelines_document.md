# Frontend Guideline Document

This document explains how the frontend of the **AI Presentation Builder** is set up. It covers the overall structure, the key principles guiding our design, how styling and theming work, how components are organized, and the tools we use to manage state, routing, performance, and testing. By following these guidelines, you’ll understand how all parts fit together and how you can extend or maintain the frontend easily.

---

## 1. Frontend Architecture

**Frameworks and Libraries**
- **Next.js (App Router)**: Handles page routing, server-side rendering, and API routes in a single framework. We use the new `/app` directory structure for file-based routes.
- **React & TypeScript**: Provides building blocks for interactive UIs with type safety to catch errors early.
- **Tailwind CSS**: A utility-first CSS framework for quick, consistent styling.
- **Shadcn/ui**: A collection of pre-built, accessible React components styled with Tailwind.
- **next-themes**: Manages light/dark mode and makes it easy to switch themes at runtime.

**How It Supports Scalability, Maintainability, and Performance**
- **Modular File Structure**: Pages live under `/app`, shared UI bits under `/components/ui`, and API logic under `/app/api`. This clear separation makes it easy to find, update, and extend code.
- **Type-Safe Layers**: TypeScript + Drizzle ORM at the backend ensures consistent data shapes from database to UI and helps prevent common bugs.
- **Built-in Optimizations**: Next.js automatically splits code, optimizes images, and pre-renders pages where possible for fast loading.

---

## 2. Design Principles

**1. Usability**
- Keep interfaces intuitive. Labels, buttons, and forms use clear wording.
- Provide feedback (e.g., loading spinners, success messages) so users know what’s happening.

**2. Accessibility**
- All interactive elements follow WAI-ARIA best practices provided by Shadcn/ui.
- Ensure keyboard navigation works everywhere and color contrast meets WCAG AA standards.

**3. Responsiveness**
- Layouts adapt to screens from mobile phones to large desktops using Tailwind’s responsive utilities.
- Components such as carousels and modals adjust size and behavior based on viewport width.

How We Apply Them:
- Forms built with Shadcn/ui include accessible labels and error states.
- Dark mode ensures readability in low-light conditions.
- Button sizes and hit areas are generous for touch devices.

---

## 3. Styling and Theming

**Styling Approach**
- We use **Tailwind CSS** exclusively—writing classes like `bg-primary text-gray-800 p-4 rounded` directly in JSX. This keeps styles co-located with components.
- No traditional CSS or BEM; Tailwind utilities handle spacing, colors, typography, and more.

**Pre-Processor / Framework**
- Tailwind CSS configured via `tailwind.config.js`.
- We rely on Tailwind’s built-in purge process to remove unused styles in production.

**Theming**
- Handled by **next-themes** and CSS variables defined in `:root` and `[data-theme="dark"]` selectors.
- Switch themes using a toggle button that updates a React context.

**Visual Style & Components**
- Overall style is **flat and modern**, with subtle shadows and rounded corners.
- We avoid heavy glassmorphism; focus is on clarity and readability.

**Color Palette**
- **Primary**: #4F46E5 (indigo-600)
- **Primary Light**: #EEF2FF (indigo-50)
- **Secondary**: #10B981 (emerald-500)
- **Accent**: #F59E0B (amber-500)
- **Background (Light)**: #FFFFFF
- **Background (Dark)**: #1F2937
- **Text (Light)**: #111827
- **Text (Dark)**: #F9FAFB

**Font**
- **Inter** as our main font for its clean, modern look. Fallbacks: `system-ui, -apple-system`.

---

## 4. Component Structure

**Organization**
- `/components/ui`: Reusable UI pieces (Button, Card, Modal, Carousel).
- `/components/presentation`: Presentation-specific components (Slide, PromptForm, PresentationViewer).
- Each component has its own folder when it includes multiple files (e.g., CSS, tests).

**Reusability**
- Components accept props for customization (e.g., `<Button variant="secondary">`).
- Shared logic and layout components (like PageShell, Header, Footer) reduce duplication.

**Component-Based Benefits**
- **Maintainability**: Fix or update one component, and every usage benefits.
- **Testability**: Isolated components are easier to write unit tests for.
- **Collaboration**: Teams can work on different components without overlap.

---

## 5. State Management

**Approach**
- **Local State**: `useState` and `useEffect` for simple UI states (e.g., form inputs, modal open/close).
- **Context API**: For cross-cutting concerns like theme, authentication status, and user info.

**Advanced State**
- If presentation editing grows complex (tracking slide edits, history), we recommend adding a lightweight state library like **Zustand** or **Jotai**.

**Data Fetching & Caching**
- Next.js’s built-in data fetching in server components or `use` hooks.
- For client-side fetching, you can use the new `useSWR` library for caching and revalidation.

---

## 6. Routing and Navigation

**Routing**
- Powered by Next.js **App Router** with file-based routing under `/app`.
- Example:
  - `/app/presentations/new/page.tsx` → “Create New Presentation” page
  - `/app/presentations/[id]/page.tsx` → Presentation detail page

**Navigation**
- Use `<Link href="/...">` from `next/link` for client-side transitions.
- A global navigation bar in `PageShell` shows links to Dashboard, Create Presentation, and Profile.
- Breadcrumbs on detail pages help users know where they are.

---

## 7. Performance Optimization

**Key Strategies**
- **Code Splitting & Lazy Loading**: Next.js automatically splits pages. For large components (e.g., rich text editor), use `dynamic(() => import(...))`.
- **Image Optimization**: Use `next/image` with proper `width`, `height`, and `priority` flags.
- **CSS Purging**: Tailwind CSS removes unused utilities in production builds.
- **Caching & CDN**: Host static assets on a CDN (via Vercel) to serve them from edge locations.

**Why It Matters**
- Faster page loads reduce bounce rates.
- Users on slow networks or mobile devices get a smooth experience.

---

## 8. Testing and Quality Assurance

**Unit Tests**
- **Jest** + **React Testing Library** for components. Test props, states, and interaction flows.

**Integration Tests**
- Mock the AI service (Gemini client) to test `/api/presentations/generate` logic without real API calls.
- Use **supertest** in Node to hit API routes and verify database entries via Drizzle ORM.

**End-to-End (E2E) Tests**
- **Playwright** or **Cypress** to simulate user flows: sign up, log in, generate a presentation, view slides.

**Linting & Formatting**
- ESLint with recommended Next.js rules.
- Prettier for consistent code style.

**Continuous Integration**
- On every pull request, run lint, tests, and build steps in GitHub Actions or Vercel.

---

## 9. Conclusion and Overall Frontend Summary

Our frontend stack—Next.js, Tailwind CSS, Shadcn/ui, React, and TypeScript—offers a modern, scalable foundation for the AI Presentation Builder. We follow clear design principles (usability, accessibility, responsiveness) and a component-based structure to make development and maintenance straightforward.

Key takeaways:
- **Modular Architecture** keeps concerns separated and code easy to navigate.
- **Utility-First Styling** with Tailwind and **Theming** via `next-themes` ensure a consistent, customizable look.
- **Built-in Performance Tools** in Next.js plus smart code-splitting and image optimization deliver fast user experiences.
- **Robust Testing** strategy (unit, integration, e2e) and CI pipelines guarantee reliability as the project grows.

With these guidelines, anyone on the team can confidently build new features, maintain quality, and adapt the frontend to new requirements.