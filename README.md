# DailyLife

Personal daily management and productivity app built with the MERN stack.

## Status: Deployment Ready 🚀

DailyLife has progressed through the major application phases:

- **Phase 1** — Application skeleton
- **Phase 2** — Authentication
- **Phase 3** — Tasks
- **Phase 4** — Expenses
- **Phase 5** — Daily Summary
- **Phase 6** — Habits
- **Phase 7** — Activity system (timeline + heatmap)
- **Phase 8** — Analytics and Profile
- **Phase 9** — UI/UX polish, dark mode, toasts, loading/error states, accessibility, responsiveness, and route-based code splitting

The application is now feature-complete and ready for deployment and production verification.

---

## Features

### Authentication

- User registration and login
- Password hashing with bcrypt
- Two-token authentication:
  - Short-lived JWT access token
  - Long-lived refresh token
- Authentication credentials stored in **HTTP-only cookies**
- Automatic access-token refresh
- Refresh-token rotation
- Refresh-token revocation on logout
- Protected routes
- Public-only routes for Login/Register
- User ownership isolation across application data

### Tasks

- Create, edit, and delete tasks
- Task priorities
- Due dates
- Time ranges
- Today / Upcoming / Completed filters
- Search
- Sorting by due date / priority
- Optimistic completion updates
- Progress percentage
- Setting progress to **100% automatically completes the task**
- User-specific task ownership

### Habits

- Create and manage habits
- Daily completion tracking
- Habit streaks
- Completion history
- Activity integration
- Avoids duplicate activity records for repeated mark/unmark operations

### Expenses

- Create, edit, and delete expenses
- Expense categories
- Payment methods
- Date-based filtering
- Search and sorting
- Spending overview
- Category distribution
- Daily spending trends
- Week / Month / Year views
- Aggregation-based statistics

### Daily Summary

- Daily reflection
- Mood tracking
- Star rating
- Accomplishments/reflections
- One summary per user per day
- Create with `POST`
- Edit with `PUT`
- Previous-day navigation
- Future-day navigation disabled
- Live task-completion and spending statistics

### Activity

- Recent activity timeline
- Activity heatmap
- Tracks meaningful events such as:
  - Task completion
  - Habit completion
  - Expense creation
  - Daily reflection
- Activity is stored in a dedicated `Activity` collection
- Activity logging is best-effort and does not block the primary action
- Un-completing a task/habit does not create another activity
- Editing an existing item does not create an unrelated activity
- Activity is isolated per user

### Analytics

- Cross-feature trends
- Task analytics
- Habit/activity trends
- Spending analytics
- Recharts visualizations
- Time-based analysis

### Profile

- View profile
- Edit name
- Edit bio
- Upload avatar
- Change password
- Member-since information
- Personal activity heatmap
- Personal activity timeline

### Cloudinary Avatar Uploads

- Browser uploads profile images as `multipart/form-data`
- Multer uses memory storage
- Backend uploads the image buffer to Cloudinary
- Images are stored under `dailylife/avatars`
- Cloudinary `secure_url` is stored in `User.avatar`
- Cloudinary public ID is retained for future replacement
- Supported formats: JPG, PNG, WEBP, GIF
- Maximum size: 5 MB
- Cloudinary API secret is backend-only

### UI / UX

- Responsive layout
- Dark/light mode
- Toast notifications
- Loading skeletons
- Empty states
- Error states with retry
- Shared modal component
- Escape-to-close modals
- Backdrop-to-close modals
- Focus management
- Responsive mobile navigation
- Route-based code splitting
- Accessibility improvements
- `prefers-reduced-motion` support

---

# Tech Stack

## Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Axios
- Recharts
- Lucide React

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- express-validator
- Multer
- Cloudinary

## Database / Storage

- MongoDB Atlas
- Cloudinary

## Development Tools

- Git
- GitHub
- VS Code
- Postman
- npm

---

# Project Structure

```text
DailyLife/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── ...
│   │
│   ├── .env.example
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

# Prerequisites

Install:

- Node.js 18+
- npm
- MongoDB Atlas account or local MongoDB
- Cloudinary account for profile avatars

For deployment, you can use MongoDB Atlas and Cloudinary as managed services.

---

# Local Setup

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/DailyLife.git
cd DailyLife
```

---

## 2. Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Create `.env` from the example:

### PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Update `backend/.env`.

### Backend `.env`

```env
PORT=5000

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>

JWT_SECRET=your_strong_random_jwt_secret

ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

ACCESS_COOKIE_NAME=dailylife_access_token
REFRESH_COOKIE_NAME=dailylife_refresh_token

CLIENT_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> **Important:** `JWT_SECRET` is a real secret used by the application to sign/verify JWTs. It is not a value that can be left as an arbitrary placeholder in a working environment.

Start the backend:

```bash
npm run dev
```

Expected output:

```text
MongoDB connected: <host>
DailyLife API running in development mode on port 5000
```

### Health check

Open:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "DailyLife API is running"
}
```

---

## 3. Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
```

Create the frontend environment file.

### PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Set:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the URL printed by Vite, normally:

```text
http://localhost:5173
```

---

# Environment Variables

## Backend

```env
PORT=5000
MONGO_URI=
JWT_SECRET=

ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

ACCESS_COOKIE_NAME=dailylife_access_token
REFRESH_COOKIE_NAME=dailylife_refresh_token

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

### Never commit secrets

The following files should remain local:

```text
backend/.env
frontend/.env
```

Make sure `.gitignore` contains:

```gitignore
node_modules/
.env
.env.local
.env.*.local
dist/
```

Never commit:

- MongoDB connection strings
- MongoDB passwords
- JWT secrets
- Cloudinary API secrets
- Other private credentials

---

# Authentication Architecture

DailyLife uses a **two-token authentication model**.

```text
                         LOGIN
                           │
                           ▼
                 ┌──────────────────┐
                 │  Express Backend │
                 └────────┬─────────┘
                          │
                ┌─────────┴─────────┐
                ▼                   ▼
         Access Token         Refresh Token
          Short-lived           Long-lived
              JWT                  Token
                │                   │
                └─────────┬─────────┘
                          ▼
                  HTTP-only Cookies
```

## Access Token

The access token is:

- A short-lived JWT
- Used for authenticated API requests
- Configured through `ACCESS_TOKEN_EXPIRES_IN`
- Default lifetime: `15m`

## Refresh Token

The refresh token is:

- Long-lived
- Used to obtain a new access token
- Stored in an HTTP-only cookie
- Rotated when `/api/auth/refresh` is called
- Revoked when the user logs out
- Stored securely in hashed form in MongoDB

Default lifetime:

```env
REFRESH_TOKEN_EXPIRES_IN=7d
```

## Session Refresh Flow

```text
Normal API request
       │
       ▼
Access token valid?
       │
   ┌───┴───┐
  YES      NO
   │        │
   ▼        ▼
Request   /api/auth/refresh
success       │
              ▼
       Refresh cookie verified
              │
              ▼
       New access token issued
              │
              ▼
       Original request retried
```

The frontend does **not** store authentication tokens in `localStorage`.

Instead, authentication credentials are handled through HTTP-only cookies.

This prevents normal JavaScript code from directly reading the long-lived authentication credential.

---

# Authentication API

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

Example registration request:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"secret123"}'
```

For cookie-based authentication, use a client/browser configuration that preserves cookies.

The browser application handles credentials automatically through the configured Axios client.

---

# MongoDB Atlas

DailyLife can use MongoDB Atlas as its cloud database.

A typical connection string:

```text
mongodb+srv://<username>:<password>@<cluster>/<database>
```

Recommended setup:

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Configure the required network access.
4. Copy the MongoDB connection string.
5. Put it in `backend/.env`.
6. Never commit the connection string to GitHub.

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dailyLife
```

If your database password contains special characters such as:

```text
@ # / : ? %
```

URL-encode them in the connection string.

---

# Cloudinary Setup

Create a Cloudinary account and obtain:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

These values belong in the **backend** `.env`.

Example:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Important

The Cloudinary API secret is **not** an arbitrary secret.

It must be the actual API secret provided by Cloudinary.

Never expose:

```env
CLOUDINARY_API_SECRET
```

in frontend code.

---

# Avatar Upload Architecture

The profile avatar upload flow is:

```text
User selects image
        │
        ▼
React Profile form
        │
        ▼
FormData
        │
        ▼
PUT /api/profile
        │
        ▼
Multer memory storage
        │
        ▼
Image buffer
        │
        ▼
Cloudinary
        │
        ▼
secure_url + public_id
        │
        ▼
MongoDB User document
```

The profile endpoint is:

```text
PUT /api/profile
```

The request can contain:

```text
name
bio
avatar
```

where `avatar` is the uploaded image file.

Cloudinary assets are stored under:

```text
dailylife/avatars
```

Supported formats:

```text
JPG
PNG
WEBP
GIF
```

Maximum file size:

```text
5 MB
```

---

# Task Progress and Completion

Tasks support both completion state and progress.

```text
Progress: 0% → 25% → 50% → 75% → 100%
                                      │
                                      ▼
                              Task completed
```

Setting progress to `100%` automatically marks the task as completed.

The completion flow uses optimistic UI updates:

```text
User checks task
      │
      ▼
UI updates immediately
      │
      ▼
API request
      │
 ┌────┴────┐
 ▼         ▼
Success   Failure
 │         │
 ▼         ▼
Keep      Refetch / rollback
state     server state
```

---

# Activity Architecture

DailyLife uses a dedicated `Activity` collection instead of rebuilding activity from Tasks, Habits, Expenses, and DailySummary every time.

```text
Task completed ──────┐
Habit completed ─────┤
Expense created ─────┼──► Activity collection
Summary written ─────┘
                              │
                       ┌──────┴──────┐
                       ▼             ▼
                 Timeline        Heatmap
```

Activity logging is **best-effort**.

If activity logging fails, the primary operation should still succeed.

Only meaningful transitions are recorded.

For example:

```text
Task pending → completed     ✅ Activity
Task completed → pending     ❌ No activity
Edit task title              ❌ No activity
Edit expense amount          ❌ No activity
```

This keeps the activity timeline useful instead of noisy.

---

# Daily Summary Architecture

Each user can have one summary for a calendar day.

```text
POST /api/summaries
        │
        ▼
Summary exists?
   │           │
  NO          YES
   │            │
   ▼            ▼
 CREATE       409 Conflict
```

Editing an existing summary uses:

```text
PUT /api/summaries/:date
```

A unique compound index on:

```text
{ userId, date }
```

provides database-level protection against duplicate summaries.

Dates are normalized to UTC midnight on the backend, while the frontend converts the browser's local date into the appropriate date key.

---

# Expense Analytics

Expense statistics are calculated using MongoDB aggregation rather than storing duplicated totals.

```text
Expenses
   │
   ▼
MongoDB aggregate()
   │
   ├── Category totals
   ├── Daily totals
   └── Period totals
```

This means edits and deletions automatically produce correct statistics without maintaining separate running-total fields.

The statistics endpoint is:

```text
GET /api/expenses/stats
```

Supported period/view filtering is based on the implemented expense routes.

---

# Design System

DailyLife uses:

- **Fraunces** — display/greeting headings
- **Inter** — UI and body text
- **IBM Plex Mono** — numbers, task counts, currency, and statistics

Core visual palette:

```text
Paper background: #F7F7F4
Forest green:     #1F6F5C
Amber:            #C98A2C
Coral:            #C1493E
```

The design system is defined primarily in:

```text
frontend/tailwind.config.js
frontend/src/index.css
```

---

# UI / UX Architecture

## Dark Mode

Dark mode is implemented using CSS variables rather than adding `dark:` classes to every element.

The application toggles:

```html
<html class="dark">
```

and theme-aware CSS variables update the main surfaces and text.

The selected theme persists across reloads.

---

## Shared Modal

Forms such as:

- Task
- Habit
- Expense
- Profile
- Password

use a shared modal component.

The modal supports:

- Escape to close
- Backdrop click to close
- Focus moving into the dialog
- Focus returning to the trigger
- Background scroll locking

---

## Loading States

Skeletons are shown on the initial load.

During search/filter/sort refetches, the existing data remains visible and is dimmed instead of flashing back to a full-page skeleton.

---

## Toasts

Toasts communicate the result of actions such as:

- Create
- Update
- Delete
- Toggle
- Password change
- API failure

Inline form validation remains separate from toast notifications.

---

## Code Splitting

Pages after Login/Register are loaded using `React.lazy`.

This reduces the initial JavaScript payload and keeps heavier dependencies such as Recharts from being loaded until required pages are opened.

---

## Accessibility

The UI includes:

- Real form labels
- `aria-pressed` for toggles
- `role="alert"` for form-level errors
- Keyboard-friendly modals
- Skip navigation link
- Reduced-motion support

---

# API Routes

The main API areas are:

```text
/api/health

/api/auth/register
/api/auth/login
/api/auth/refresh
/api/auth/logout
/api/auth/me

/api/tasks

/api/habits

/api/expenses
/api/expenses/stats

/api/summaries
/api/summaries/:date

/api/activity
/api/activity/heatmap

/api/profile
```

Protected endpoints require an authenticated session.

---

# Deployment

DailyLife can be deployed using a split frontend/backend architecture.

```text
                         INTERNET
                            │
                            ▼
                    ┌───────────────┐
                    │    Browser    │
                    └───────┬───────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │ Vercel            │
                  │ React + Vite      │
                  └────────┬──────────┘
                           │
                           │ API requests
                           ▼
                  ┌───────────────────┐
                  │ Render            │
                  │ Node + Express    │
                  └───────┬─────┬─────┘
                          │     │
              ┌───────────┘     └────────────┐
              ▼                              ▼
      ┌───────────────┐              ┌──────────────┐
      │ MongoDB Atlas │              │  Cloudinary  │
      │ Database      │              │ Avatar files │
      └───────────────┘              └──────────────┘
```

## Backend Deployment

For Render:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

The backend must use the hosting platform's `PORT`.

Example:

```js
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`DailyLife API running on port ${PORT}`);
});
```

Do not hard-code port `5000` for production deployment.

### Production backend environment

```env
MONGO_URI=<production-mongodb-uri>

JWT_SECRET=<strong-production-secret>

ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

ACCESS_COOKIE_NAME=dailylife_access_token
REFRESH_COOKIE_NAME=dailylife_refresh_token

CLIENT_URL=https://your-frontend.vercel.app

CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>
```

`PORT` can normally be provided by Render automatically.

---

# Frontend Deployment

For Vercel:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Frontend environment variable:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

After the frontend is deployed, update the backend:

```env
CLIENT_URL=https://your-frontend.vercel.app
```

The exact URL must match the deployed frontend origin.

This is especially important because DailyLife uses cookie-based authentication and credentialed API requests.

---

# Production Cookie / CORS Considerations

Because authentication uses HTTP-only cookies, production deployment must correctly configure:

- Frontend origin
- Backend CORS
- Credentialed requests
- Cookie `httpOnly`
- Cookie `secure`
- Cookie `sameSite`

The frontend and backend must be configured consistently for the deployed domains.

Do not solve cookie issues by exposing the refresh token to frontend JavaScript.

---

# Deployment Checklist

## Before deployment

- [ ] Test registration
- [ ] Test login
- [ ] Test logout
- [ ] Test refresh/session restoration
- [ ] Test expired access-token refresh
- [ ] Test task CRUD
- [ ] Test task progress/completion
- [ ] Test habits
- [ ] Test expenses
- [ ] Test daily summaries
- [ ] Test activity timeline/heatmap
- [ ] Test analytics
- [ ] Test profile updates
- [ ] Test Cloudinary avatar upload
- [ ] Test password change
- [ ] Test dark mode
- [ ] Test mobile layout
- [ ] Test loading/error states

## After deployment

- [ ] Backend health endpoint works
- [ ] Frontend loads
- [ ] Frontend can call backend API
- [ ] CORS works
- [ ] Login works
- [ ] Authentication cookies are created
- [ ] Refreshing the page keeps the session
- [ ] Access-token refresh works
- [ ] Logout clears/revokes the session
- [ ] MongoDB Atlas connection works
- [ ] Cloudinary uploads work
- [ ] Profile avatar remains visible after refresh
- [ ] All user data remains isolated
- [ ] No production secrets are exposed in the frontend

---

# Common Development Issues

## `EADDRINUSE: address already in use :::5000`

If you see:

```text
Error: listen EADDRINUSE: address already in use :::5000
```

another process is already using port `5000`.

On Windows PowerShell:

```powershell
netstat -ano | findstr :5000
```

Find the PID and terminate it:

```powershell
taskkill /PID <PID> /F
```

Then start the backend again:

```bash
npm run dev
```

---

## MongoDB connection failure

Check:

- `MONGO_URI`
- MongoDB username
- MongoDB password
- Atlas Network Access
- Database user permissions
- URL encoding of special characters in the password

---

## Cloudinary `Invalid Signature`

Verify all three values:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

They must come from the same Cloudinary account.

The API secret must be the actual Cloudinary API secret, not a custom value.

If you change Cloudinary credentials, restart the backend.

---

## Frontend cannot connect to backend

Check:

```env
VITE_API_URL=http://localhost:5000/api
```

for local development.

For production:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

Also verify the backend:

```env
CLIENT_URL=https://your-frontend.vercel.app
```

---

## Cookies are not working in production

Check:

1. The frontend uses credentialed requests.
2. Backend CORS allows the exact frontend origin.
3. Backend allows credentials.
4. Cookie `secure` configuration is correct for HTTPS.
5. `sameSite` configuration matches the frontend/backend deployment.
6. The browser is not blocking the cookie because of an incorrect domain/origin configuration.

---

# Testing Checklist

## Authentication

- [ ] Register with valid credentials
- [ ] Duplicate email returns a clear error
- [ ] Invalid password returns `Invalid email or password`
- [ ] Login creates the authentication session
- [ ] Refreshing the page keeps the user logged in
- [ ] Access-token expiration triggers refresh
- [ ] Logout revokes the session
- [ ] Protected routes reject unauthenticated users
- [ ] A second account cannot access the first account's data

## Tasks

- [ ] Create task
- [ ] Edit task
- [ ] Delete task
- [ ] Complete task
- [ ] Update progress
- [ ] Set progress to 100% and verify completion
- [ ] Verify Today / Upcoming / Completed filters
- [ ] Verify search
- [ ] Verify sorting
- [ ] Verify ownership isolation

## Habits

- [ ] Create habit
- [ ] Complete habit
- [ ] Undo completion
- [ ] Verify streak
- [ ] Verify activity behavior
- [ ] Verify ownership isolation

## Expenses

- [ ] Create expense
- [ ] Edit expense
- [ ] Delete expense
- [ ] Verify category totals
- [ ] Verify daily trend
- [ ] Verify Week / Month / Year views
- [ ] Verify ownership isolation

## Daily Summary

- [ ] Create summary
- [ ] Edit summary
- [ ] Verify duplicate-date protection
- [ ] Verify mood
- [ ] Verify rating
- [ ] Verify previous-day navigation
- [ ] Verify future-day navigation is disabled

## Activity

- [ ] Complete task → activity appears
- [ ] Complete habit → activity appears
- [ ] Create expense → activity appears
- [ ] Save reflection → activity appears
- [ ] Undo completion → no duplicate activity
- [ ] Edit existing data → no unrelated activity
- [ ] Heatmap counts are correct
- [ ] User activity remains isolated

## Profile

- [ ] Load profile
- [ ] Edit name
- [ ] Edit bio
- [ ] Upload avatar
- [ ] Verify Cloudinary URL is saved
- [ ] Verify avatar after refresh
- [ ] Change password

---

# Architecture Decisions

## Backend architecture

DailyLife uses an MVC + service-layer structure:

```text
config/
models/
controllers/
routes/
middleware/
services/
```

Responsibilities:

- **Routes** — endpoints and request validation
- **Controllers** — HTTP-level handling
- **Services** — reusable business logic
- **Models** — MongoDB/Mongoose schemas
- **Middleware** — authentication, validation, uploads, errors
- **Config** — external service/database configuration

Controllers remain thin where business logic can be moved into services.

---

## Password security

Password hashing is performed in the Mongoose `pre("save")` hook on the `User` model.

The password field is excluded from normal queries and explicitly selected when needed for login.

---

## JWT payload

The JWT payload remains minimal:

```js
{
  id
}
```

The backend re-loads the current user from MongoDB rather than trusting mutable profile information embedded inside an old token.

---

## Ownership security

Protected controllers scope database queries using the authenticated user:

```js
{
  _id,
  userId: req.user.id
}
```

The backend does not trust a client-provided `userId` to determine ownership.

This prevents one authenticated user from reading or modifying another user's records.

---

## Validation

Request validation is handled through `express-validator` and shared validation middleware.

Validation failures are returned as consistent API errors.

---

## Centralized error handling

The backend uses centralized error handling so errors such as:

- Invalid ObjectIds
- Validation failures
- Duplicate keys
- JWT errors
- Other controller/service errors

are normalized into consistent JSON responses.

---

# Performance

DailyLife includes:

- Route-based React code splitting
- Lazy-loaded pages
- Recharts isolated into heavier page chunks
- Optimistic UI updates
- Loading skeletons
- Reduced unnecessary refetching
- Server-side heatmap gap filling
- Indexed MongoDB queries
- Aggregation for expense statistics

---

# Accessibility

The application includes:

- Semantic form labels
- Keyboard-accessible dialogs
- Focus management
- `aria-pressed`
- `role="alert"`
- Skip navigation
- Reduced-motion support
- Responsive layouts

---

# Git Workflow

Check changes:

```bash
git status
```

Stage:

```bash
git add .
```

Commit:

```bash
git commit -m "update DailyLife"
```

Push:

```bash
git push
```

Before pushing, always verify that `.env` files are not included:

```bash
git status
```

---

# Security Reminder

If a secret is accidentally committed to GitHub, rotating the secret is not optional.

Immediately rotate:

- MongoDB credentials
- JWT secret
- Cloudinary API secret
- Any other exposed credentials

Do not simply delete the value from the latest commit and assume the secret is safe; it may still exist in Git history.

---

# Current Implementation Status

```text
Authentication        ✅ Two-token cookie-based authentication
Tasks                 ✅ CRUD + progress + completion
Habits                ✅ Completion + streaks
Expenses              ✅ CRUD + analytics
Daily Summary         ✅ One summary per user/day
Activity              ✅ Timeline + heatmap
Analytics             ✅ Cross-feature trends
Profile               ✅ Profile + password
Cloudinary Avatars    ✅ Upload + replacement support
Settings              ✅ Implemented
Dark Mode             ✅ Persistent
Responsive UI         ✅ Desktop + mobile
Loading/Error States  ✅
Accessibility         ✅
Code Splitting        ✅
Deployment             🚀 Ready for production verification
```

---

# Project Goal

DailyLife is built to make everyday planning and self-reflection simple:

```text
Plan
  ↓
Do
  ↓
Track
  ↓
Reflect
  ↓
Understand
  ↓
Improve
```

**Build better days, one task at a time. 🚀**
