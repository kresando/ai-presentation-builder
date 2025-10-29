# AI Presentation Builder: Security Guidelines

This document outlines the security principles and recommended controls for the **AI Presentation Builder**—a Next.js full-stack starter template with Better Auth, Drizzle ORM, Shadcn/ui, and Gemini AI integration. Adhering to these guidelines will help ensure a secure, resilient, and maintainable application.

---

## 1. Security by Design

- Embed security into every phase: design, implementation, testing, and deployment.  
- Perform threat modeling early to identify risks around authentication, AI integration, data storage, and UI components.  
- Review the security posture whenever adding new features (e.g., background jobs, real-time streaming).

## 2. Authentication & Access Control

- **Better Auth Configuration**  
  • Enforce strong password policies: minimum length (12+ chars), complexity rules, and ban common passwords.  
  • Use Argon2 or bcrypt with a unique salt per user.  
  • Store session identifiers in `HttpOnly`, `Secure`, `SameSite=Strict` cookies.  
  • Implement idle (e.g., 30 min) and absolute (e.g., 12 hr) session timeouts.  
- **Role-Based Access Control (RBAC)**  
  • Define roles (e.g., `user`, `admin`) in your Drizzle schema and enforce server-side checks in every API route.  
  • Reject unauthorized operations with `403 Forbidden`.  
- **Multi-Factor Authentication (MFA)** (Optional but recommended for admins)  
  • Integrate TOTP (e.g., Google Authenticator) or SMS/Email OTP.  
- **Session Security**  
  • Protect against fixation by issuing a new session on login.  
  • Provide a secure logout endpoint that fully invalidates the session.

## 3. Input Handling & Processing

- **Prompt & Form Validation**  
  • Use a schema validation library (e.g., Zod) on the server to validate all fields in `/api/presentations/generate`.  
  • Enforce reasonable length limits (e.g., 5–500 characters) and block disallowed characters.  
- **Prevent Injection**  
  • Use Drizzle ORM’s parameterized queries for all database operations.  
  • Sanitize any user-supplied HTML or Markdown before rendering (avoid template injection).  
- **File Uploads** (if enabled)  
  • Restrict file types, sizes, and scan for malware.  
  • Store uploads outside `/public` with randomized filenames.

## 4. Data Protection & Privacy

- **Encryption in Transit & At Rest**  
  • Enforce HTTPS (TLS 1.2+) for all endpoints.  
  • Enable database encryption or use a managed DB service with at-rest encryption.  
- **Secrets Management**  
  • Store API keys (Gemini, database, third-party) in environment variables and/or a secrets vault (e.g., Vercel Secrets, HashiCorp Vault).  
  • Never commit `.env.local` or secret files to version control.  
- **Least Privilege for Database**  
  • Create a read/write role scoped only to necessary tables (`users`, `presentations`, `slides`).  
- **PII & Logging**  
  • Avoid logging sensitive data (passwords, full JWTs, API responses).  
  • Mask or redact user identifiers in logs when possible.

## 5. API & Service Security

- **HTTPS & CORS**  
  • Redirect HTTP to HTTPS in production.  
  • Configure CORS to allow only your front-end origin.  
- **Rate Limiting & Throttling**  
  • Apply rate limits on `/api/presentations/generate` to prevent abuse and control AI costs.  
  • Consider incremental back-off for repeated attempts.  
- **Authentication & Authorization**  
  • Secure all API routes—no open or public endpoints for sensitive operations.  
  • Validate JWT `exp`, `iss`, and signature if using JWTs internally.  
- **API Versioning**  
  • Prefix routes with `/api/v1/` to manage breaking changes safely.

## 6. Web Application Security Hygiene

- **CSRF Protection**  
  • Use anti-CSRF tokens for all state-changing requests (POST/PUT/DELETE).  
  • NextAuth and Better Auth frameworks often provide built-in CSRF protection—verify it’s enabled.  
- **Security Headers** (via Next.js `headers()` config)  
  • Content-Security-Policy: restrict scripts/styles to trusted sources.  
  • X-Frame-Options: `DENY` or `SAMEORIGIN` to prevent clickjacking.  
  • X-Content-Type-Options: `nosniff`.  
  • Referrer-Policy: `no-referrer-when-downgrade` or stricter.  
  • Strict-Transport-Security: `max-age=63072000; includeSubDomains; preload`.  
- **Secure Client-Side Storage**  
  • Avoid storing tokens or sensitive data in `localStorage` or `sessionStorage`.  
- **Subresource Integrity (SRI)**  
  • Add SRI hashes for any third-party scripts/CSS from CDNs.

## 7. Infrastructure & Configuration Management

- **Hardening & Updates**  
  • Use minimal, up-to-date Docker base images.  
  • Regularly patch OS, Node.js, dependencies, and container runtimes.  
- **Disable Debug in Production**  
  • Ensure `NODE_ENV=production` and disable any verbose logging or debug endpoints.  
- **Network & Firewall**  
  • Expose only essential ports (e.g., 443).  
  • Use cloud provider security groups or firewalls to restrict traffic.

## 8. Dependency Management

- **Lockfiles & SCA**  
  • Commit `package-lock.json` or `yarn.lock` for deterministic builds.  
  • Integrate an automated SCA tool (e.g., GitHub Dependabot, Snyk) to scan for CVEs.  
- **Minimal Footprint**  
  • Remove unused packages (e.g., test/development-only libraries) from production bundles.

## 9. AI-Specific Security Considerations

- **Prompt Injection Mitigation**  
  • Sanitize prompt inputs and enforce a strict validation schema.  
  • Monitor for suspicious patterns (e.g., attempts to manipulate system instructions).  
- **Secure AI Key Usage**  
  • Call the Gemini AI SDK only from server-side code.  
  • Rotate API keys regularly and monitor usage metrics for anomalies.  
- **Background Job Security** (if implemented)  
  • Secure message queues (e.g., authenticated, encrypted channels).  
  • Validate payloads before dequeuing and processing.

---

Adherence to these guidelines will help ensure that the **AI Presentation Builder** is built with security at its core—protecting user data, guarding against modern threats, and providing a robust foundation for future growth and AI innovation.
