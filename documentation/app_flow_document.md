# AI Presentation Builder App Flow Document

## Onboarding and Sign-In/Sign-Up
A new user discovers the AI Presentation Builder through its main landing page at the root URL. The landing page briefly describes the features of the platform and displays two clear buttons labeled “Sign Up” and “Log In.” When the user clicks “Sign Up,” they are taken to a page where they enter their email address and choose a secure password. After submitting the form, the user receives a confirmation email with a link to verify their account. Once they click the verification link, their account is activated and they are automatically logged in.

If a returning user selects “Log In,” they are prompted to enter the email and password they registered with. After successful authentication, they are redirected to the main dashboard. A “Forgot Password?” link beneath the login form allows users who cannot remember their password to reset it. Clicking this link prompts the user to enter their email address, which triggers an email with a secure, time-limited reset link. Following that link directs the user to a page where they set a new password. After resetting their password, they can log in normally.

Every authenticated session shows a “Log Out” button in the navigation bar. When the user clicks “Log Out,” they are signed out of the application and returned to the landing page.

## Main Dashboard or Home Page
After logging in, the user lands on the main dashboard located at `/dashboard`. The top of the page features a header with the application logo on the left and the user’s profile avatar on the right. Clicking the avatar reveals a dropdown menu with entries for “Profile Settings,” “Help & Documentation,” and “Log Out.”

Along the left side of the screen, a vertical sidebar lists two main navigation items: “My Presentations” and “Create New Presentation.” By default, the “My Presentations” section is selected, and it displays a grid of cards showing each saved deck with its title, creation date, and a thumbnail preview. Each card can be clicked to open the presentation viewer.

A prominent button labeled “New Presentation” sits above the grid, offering an alternative way to begin building a new deck. The main dashboard view also includes a search bar at the top of the cards area, allowing users to quickly find presentations by title or date.

## Detailed Feature Flows and Page Transitions
When the user clicks “New Presentation,” they navigate to `/presentations/new`. This page presents a form where the user types a prompt describing the topic or theme they want for their deck. Below the text area, optional fields allow them to choose a color theme and slide count. When they press “Generate Presentation,” the button triggers a POST request to `/api/presentations/generate` on the server.

The API route receives the prompt and options, validates the input, and calls the Gemini AI service encapsulated in `/lib/gemini.ts`. The server-side logic interacts with the Gemini API, receives a set of slide data, and then uses Drizzle ORM to store a new record in the `presentations` table and individual records in the `slides` table. Once the database operations succeed, the API returns the new presentation’s ID.

Back on the client, the page transitions automatically to `/presentations/[id]` using the returned ID. The user arrives at the presentation viewer, where the slides appear in a carousel. Navigation arrows let them move between slides. Above the carousel, a toolbar offers icons for editing text, changing slide order, adding new slides, or deleting slides. When the user edits a slide, inline editing fields appear. Hitting the “Save” button beside the toolbar updates the corresponding slide record through an API call to `/api/presentations/[id]/update`.

If the user wants to revisit their list of decks, they click the “My Presentations” link in the sidebar. This takes them back to `/dashboard`, where they see their updated list including any newly generated or edited presentations.

## Settings and Account Management
Accessing the profile avatar and selecting “Profile Settings” directs the user to `/settings`. Here they can update personal information such as display name, email address, and password. Changing the email triggers a confirmation step similar to sign-up verification. A separate section on this page allows enabling or disabling email notifications for events like generation completion or collaborative edits. The user saves changes by clicking “Update Profile,” which issues a PATCH request to `/api/user/update`.

If the platform offers premium features in the future, a “Billing” tab will appear in `/settings`. Clicking it will show the current subscription plan, payment method details, and a button to upgrade or cancel the plan. All billing updates are handled through calls to secure endpoints under `/api/billing`.

After making any setting changes, the user clicks “Back to Dashboard” in the side menu or selects “My Presentations” to resume their work. Throughout the settings pages, the sidebar remains visible so the user can navigate to other areas without returning to the dashboard first.

## Error States and Alternate Paths
If the user provides invalid credentials at login, the form shows an inline error message above the password field stating that the email or password is incorrect. On the sign-up page, if the email is already in use or the password fails complexity checks, a descriptive error appears next to the relevant field.

During presentation generation, if the AI API call fails or returns malformed data, the `/presentations/new` page catches the error and displays an alert at the top of the form explaining that generation failed and inviting the user to try again. If network connectivity is lost at any point, the user sees a full-screen overlay indicating “Connection Lost” with an option to retry the last action.

Within the presentation viewer, attempts to save invalid slide content trigger validation errors. For example, leaving a title blank shows a small tooltip next to the text box stating “Title is required.” If the user tries to access a presentation that does not exist or belongs to another account, the server returns a 404 or 403 status, and the client displays a message reading “You do not have permission to view this presentation” with a button to return to the dashboard.

## Conclusion and Overall App Journey
From the initial landing page through signing up, verifying the account, and logging in, the sequence of screens leads the user seamlessly into their dashboard. The dashboard offers an overview of all saved presentations along with clear entry points for creating new ones. The generation process is encapsulated in a simple form that transitions to a richly interactive viewer once the AI has produced the content. Settings pages allow the user to manage their personal information and any future subscription details without losing context of the main app. Thoughtful error handling guides the user back into a normal flow whenever issues arise. Overall, the journey moves logically from signing in to building, editing, and managing AI-powered presentations as part of a cohesive, end-to-end experience.