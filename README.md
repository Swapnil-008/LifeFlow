**\# DailyLife**

Personal daily management & productivity app --- MERN stack.

**\## Status: Deployment Ready 🚀**

Phase 1 built the skeleton, Phase 2 added authentication, Phase 3 added
Tasks, Phase 4 added Expenses, Phase 5 added Daily Summary, Phase 6
added Habits, Phase 7 added the Activity system (timeline + heatmap).
Phase 8 filled out Analytics (cross-feature trends) and a fuller Profile
(edit bio/avatar, change password) --- every sidebar item is now a real
page, nothing left marked "Soon" except Settings. Phase 9 is a polish
pass across the whole app: dark mode, toasts on every
create/update/delete/toggle action, consistent loading/empty/error
states, subtle animations, a responsive tightening pass, an
accessibility audit, and route-based code splitting for load
performance.

**\## Project structure**

\`\`\` DailyLife/ ├── backend/     Express + MongoDB API ├── frontend/  
 React (Vite) + Tailwind └── README.md \`\`\`

**\## Prerequisites**

\- Node.js 18+ - A MongoDB instance --- either:   - Local: \`mongod\`
running on \`mongodb://127.0.0.1:27017\`, or   - \[MongoDB
Atlas\](https://www.mongodb.com/atlas) free-tier cluster (recommended if
you don't want to install Mongo locally)

**\## Setup**

**\### 1. Backend**

\`\`\`bash cd backend cp .env.example .env \# edit .env if using Atlas:
set MONGO_URI to your connection string, and set a real JWT_SECRET npm
install npm run dev \`\`\`

You should see: \`\`\` MongoDB connected: \<host\> DailyLife API running
in development mode on port 5000 \`\`\`

Verify it directly: open \`http://localhost:5000/api/health\` --- you
should get \`{"success":true,"message":"DailyLife API is running"}\`.

**\### 2. Frontend**

In a second terminal:

\`\`\`bash cd frontend cp .env.example .env npm install npm run dev
\`\`\`

Open the printed local URL (typically \`http://localhost:5173\`).

**\## What to check for Phase 2**

1\. Open the frontend --- you'll be redirected to \`/login\` since
there's no session yet. 2. Click **\*\*Create one\*\***, register with a
name/email/password (6+ chars). You should land on    the dashboard
immediately, greeted by name, with your email shown. 3. Refresh the
page. You should **\*\*stay logged in\*\*** (the token in
\`localStorage\` is validated    against \`GET /api/auth/me\` on load)
instead of being bounced back to \`/login\`. 4. Click **\*\*Log
out\*\***, confirm you're sent back to \`/login\`. 5. Log back in with
the same credentials on the Login page. 6. Try registering a second
account with the same email --- you should get a clear    "account with
this email already exists" error instead of a crash or generic 500. 7.
Try logging in with a wrong password --- you should get "Invalid email
or password" (not    a hint about which field was wrong, to avoid
leaking whether an email is registered).

You can also test the API directly: \`\`\`bash curl -X POST
http://localhost:5000/api/auth/register \\   -H "Content-Type:
application/json" \\   -d '{"name":"Test
User","email":"test@example.com","password":"secret123"}' \`\`\` This
returns \`{ success, token, user }\`. Use that token to hit a protected
route: \`\`\`bash curl http://localhost:5000/api/auth/me -H
"Authorization: Bearer \<token\>" \`\`\`

**\## What to check for Phase 3**

1\. Log in, go to **\*\*Tasks\*\*** in the sidebar. 2. Add a task with a
due date of today, a priority, and a time range --- confirm it appears.
3. Check the box to mark it complete --- it should show a strikethrough
immediately (optimistic    update) and stay completed after a page
refresh. 4. Go back to **\*\*Dashboard\*\*** --- the task should appear
under "Today's Tasks" if its due date is    today, reflecting the same
completed/pending state. 5. On the Tasks page, try the **\*\*Today /
Upcoming / Completed\*\*** view filters, the search box    (type part of
a task title), and the sort dropdown (due date / priority). 6. Edit a
task's title, delete a task, confirm both persist after refresh. 7.
Confirm you cannot see another user's tasks: register a second account
in an incognito    window --- its Tasks page should start empty even
though the first account has tasks.

API directly: \`\`\`bash curl http://localhost:5000/api/tasks -H
"Authorization: Bearer \<token\>" curl -X POST
http://localhost:5000/api/tasks \\   -H "Authorization: Bearer
\<token\>" -H "Content-Type: application/json" \\   -d '{"title":"Write
README","priority":"high","dueDate":"2026-08-16"}' \`\`\`

**\## What to check for Phase 4**

1\. Log in, go to **\*\*Expenses\*\*** in the sidebar. 2. Click
**\*\*Add Expense\*\*** --- enter an amount, pick a category,
description, payment method,    and today's date. Confirm it appears in
the list and the total in the list header updates. 3. Check the
**\*\*Spending overview\*\*** card at the top --- the donut chart should
show your new    expense's category, and the daily trend bar chart
should show a bar for today. Switch    between **\*\*Week / Month /
Year\*\*** --- the charts should refetch and update. 4. Go back to
**\*\*Dashboard\*\*** --- the quick-stats row should show "Spent today"
matching what you    just added, and the **\*\*Today's Expenses\*\***
widget (next to Today's Tasks) should list it. 5. On the Expenses page,
try the **\*\*Today / This week / This month\*\*** view filters, the
category    dropdown, the search box (matches description), and the sort
dropdown. 6. Edit an expense's amount, delete an expense, confirm both
persist after refresh and the    charts update accordingly. 7. Confirm
ownership isolation still holds: a second account's Expenses page starts
empty.

API directly: \`\`\`bash curl -X POST http://localhost:5000/api/expenses
\\   -H "Authorization: Bearer \<token\>" -H "Content-Type:
application/json" \\   -d
'{"amount":250,"category":"Food","description":"Lunch","paymentMethod":"UPI"}'
curl "http://localhost:5000/api/expenses/stats?period=month" -H
"Authorization: Bearer \<token\>" \`\`\`

**\## What to check for Phase 5**

1\. Log in, go to **\*\*Summary\*\*** in the sidebar. You should land on
today, with a stats row    showing today's tasks-completed count and
money spent (pulled live --- add a task/expense    on another tab and
refresh to see it change). 2. Fill in the three reflection boxes, pick a
mood emoji, set a star rating, and \*\*Save    Summary\*\*. You should
see a "Saved." confirmation. 3. Refresh the page --- your reflection
should still be there (this is now an *\*update\**, not a    create ---
the Save button silently uses \`PUT\` once a summary exists for that
date). 4. Go back to **\*\*Dashboard\*\*** --- a card near the bottom
should now show your mood emoji, "Today's    reflection saved", and your
star rating; tapping it returns you to the Summary page. 5. On the
Summary page, use the **\*\*◀ / ▶\*\*** arrows to go back a day (forward
is disabled once    you're back at today --- you can't reflect on a day
that hasn't happened). A past day with no    summary should show an
empty form ready for **\*\*Create\*\*** (POST); a past day you've
already    filled in should load and let you edit it (PUT). 6. Try
creating two summaries for the same date via the API directly (below)
--- the second    POST should fail with a clear 409, not a duplicate
record.

API directly: \`\`\`bash curl
http://localhost:5000/api/summaries/2026-08-17 -H "Authorization: Bearer
\<token\>" curl -X POST http://localhost:5000/api/summaries \\   -H
"Authorization: Bearer \<token\>" -H "Content-Type: application/json" \\
  -d
'{"date":"2026-08-17","mood":"good","rating":4,"accomplishments":"Shipped
Phase 5"}' \`\`\`

**\## What to check for Phase 7**

1\. Log in and go to **\*\*Dashboard\*\***. Below the Daily Summary card
you should now see an    **\*\*Activity heatmap\*\*** (last 18 weeks)
and a **\*\*Recent Activity\*\*** feed. 2. Complete a task (Tasks page,
checkbox), mark a habit done (Habits page), add an expense    (Expenses
page), and save a daily summary (Summary page) --- one action at a time.
3. After each action, go back to **\*\*Dashboard\*\*** and refresh: the
Recent Activity feed should    show a new entry ("Completed task: ...",
"Completed habit: ...", "Logged an expense: ...",    "Wrote a daily
reflection"), most recent first, and today's cell in the heatmap should
get    darker as the day's count goes up. 4. Un-complete the task or
habit you just marked done (tap it again) --- confirm \*\*no new  
 activity entry is added\*\* for the undo (only completions are logged,
not un-completions). 5. Edit an existing task's title or category
without changing its status, or edit an    expense's amount --- confirm
this does **\*\*not\*\*** add a new activity entry either (only the  
 original completion/creation events are logged). 6. Go to
**\*\*Profile\*\*** in the sidebar (no longer marked "Soon") --- you
should see your name,    email, and member-since date, a fuller
(53-week) activity heatmap, and a longer activity    timeline (up to 30
entries). 7. Confirm ownership isolation still holds: a second account's
Dashboard/Profile activity    feed and heatmap start empty, showing none
of the first account's activity.

API directly: \`\`\`bash curl
"http://localhost:5000/api/activity?limit=10" -H "Authorization: Bearer
\<token\>" curl "http://localhost:5000/api/activity/heatmap?days=30" -H
"Authorization: Bearer \<token\>" \`\`\`

**\## Design system (established now, refined in Phase 9)**

\- **\*\*Palette\*\***: warm paper background (\`#F7F7F4\`), deep
forest-green brand accent (\`#1F6F5C\`)   for growth/habits, amber
(\`#C98A2C\`) for streaks, coral (\`#C1493E\`) for spend/alerts. -
**\*\*Type\*\***: Fraunces (display, used sparingly for
greetings/headers), Inter (UI body text),   IBM Plex Mono (numbers ---
task counts, currency, stats) for a "dashboard data" feel. - Defined in
\`frontend/tailwind.config.js\` and \`frontend/src/index.css\`.

**\## Architecture decisions made this phase**

\- **\*\*Backend\*\***: MVC + service layer (\`config/\`, \`models/\`,
\`controllers/\`, \`routes/\`,   \`middleware/\`, \`services/\`).
Controllers stay thin; business logic (streaks, analytics   aggregation)
will live in \`services/\` starting Phase 6--8. - **\*\*Centralized
error handling\*\***: every controller will use
\`express-async-handler\`, so thrown   errors (bad ObjectIds, validation
errors, duplicate keys, JWT errors) are normalized into   consistent
JSON responses by \`middleware/errorMiddleware.js\` instead of being
handled ad hoc. - **\*\*Frontend\*\***: Vite + React Router (browser
router already wraps the app in \`main.jsx\`), Axios   instance in
\`services/api.js\` that auto-attaches the JWT once auth exists,
Recharts for all   analytics charts, \`lucide-react\` for icons. -
**\*\*No premature tech\*\***: no Redis, BullMQ, Socket.IO, or Docker
yet, per the phased plan.

**\## Phase 2 architecture decisions**

\- **\*\*Password security\*\***: hashing happens in a Mongoose
\`pre('save')\` hook on the \`User\` model,   not in the controller ---
so it's impossible to accidentally save a plaintext password from   any
code path. The field is \`select: false\` by default; login explicitly
opts in with   \`.select('+password')\`. - **\*\*JWT payload stays
minimal\*\***: just \`{ id }\`. Every protected request re-derives the
current   user by looking up that id --- never trusting a
name/email/role embedded in an old token. - **\*\*Ownership model,
established now for Phase 3+\*\***: \`protect\` middleware attaches
\`req.user\`   from the verified token. When Tasks/Habits/Expenses
arrive, controllers will scope every   query with \`req.user.id\` and
never read a \`userId\` from the request body --- this is what   stops
one user from reading or modifying another user's data. -
**\*\*Validation\*\***: \`express-validator\` chains live in the route
file (\`authRoutes.js\`), with a   shared \`validate\` middleware that
turns failures into one clean 400 error, keeping   controllers focused
on business logic only. - **\*\*Frontend session handling\*\***:
\`AuthContext\` holds \`user\`/\`loading\`/\`error\` and persists only  
the JWT (in \`localStorage\`); on app load it re-validates that token
against \`/auth/me\` rather   than trusting a cached user object, so a
revoked/expired token doesn't leave someone in a   false "logged in"
state. \`ProtectedRoute\` blocks \`/\`, \`PublicOnlyRoute\` blocks
\`/login\` and   \`/register\` once already authenticated.

**\## Phase 7 architecture decisions**

\- **\*\*A dedicated \`Activity\` collection, not a computed view\*\***:
activity events are written   once, at the moment they happen, via
\`services/activityService.js#recordActivity()\` --- not   reconstructed
later by querying Tasks/Habits/Expenses/DailySummary and merging
results. This   keeps the timeline/heatmap queries cheap (single indexed
collection) and means the record   reflects the actual moment the user
acted, independent of later edits to the source document. -
**\*\*Activity logging is best-effort and never blocks the primary
action\*\***: \`recordActivity()\`   catches and logs its own errors
internally. Completing a task, checking off a habit, saving   an
expense, or writing a summary must always succeed even if activity
logging has a bug ---   the reverse (a logging failure rolling back a
task completion) would be a worse bug. - **\*\*Only real transitions are
logged, not every write\*\***: task/habit completion only records an  
activity on the pending/not-done → completed transition (checked in the
controller via a   \`wasCompleted\` flag captured before the mutation),
never on the undo, and never on unrelated   edits (renaming a task,
changing an expense's amount). This keeps the timeline meaningful  
instead of noisy. - **\*\*\`date\` vs \`createdAt\`\*\***: every
activity has both. \`createdAt\` (from \`timestamps: true\`) is   when
the record was written --- used to sort the timeline. \`date\` is the
UTC-midnight calendar   day the event *\*counts towards\** for the
heatmap, which usually matches \`createdAt\` but not   always: a habit
checked off for a specific day uses that day (matching
\`completedDates\`   semantics), and a daily summary uses the day being
reflected on --- so writing about yesterday   doesn't show up as "today"
on the grid. - **\*\*Heatmap gap-filling happens server-side\*\***:
\`getHeatmapData()\` returns one entry per day in   the requested range,
including zero-count days, so the frontend never has to reconstruct a  
gapless grid from sparse data --- it only handles weekday
alignment/padding for layout.

**\## UI / UX verification checklist**

1\. **\*\*Dark mode\*\***: click the sun/moon icon in the navbar. The
whole app should re-theme    instantly --- background, cards, borders,
text, badges. Refresh the page: it should stay in    the theme you
picked (no flash of the wrong theme on load). Clear \`localStorage\` and
reload    with your OS set to dark mode --- it should default to dark on
first visit. 2. **\*\*Toasts\*\***: complete a task, check off a habit,
add/edit/delete an expense, change your    password. Each should show a
small toast at the bottom of the screen confirming success ---    and a
coral error toast if you stop the backend and try an action that fails.
3. **\*\*Loading states\*\***: throttle your network (DevTools → Network
→ Slow 3G) and reload Tasks.    You should see skeleton row
placeholders, not a blank card or plain "Loading..." text. Type in  
 the Tasks search box --- the existing list should stay visible (dimmed)
while it refetches,    not flash back to a skeleton on every keystroke.
4. **\*\*Empty/error states\*\***: on a brand-new account,
Tasks/Habits/Expenses should show a friendly    icon + message, not a
blank card. Stop the backend and reload Tasks --- you should see a  
 "Try again" button that actually retries when the backend comes back.
5. **\*\*Modals\*\***: open any "Add" form (Task/Habit/Expense/Profile).
Press **\*\*Escape\*\*** --- it should    close. Click outside the modal
(on the dark backdrop) --- it should also close. Tab through    the form
fields --- focus should stay inside the modal. 6.
**\*\*Responsive\*\***: resize your browser down to \~375px wide (or
open on a phone). The sidebar    should disappear in favor of a bottom
tab bar; the Dashboard's 3-stat row should stay    readable without
overflowing; every page's filter row should stack instead of overflowing
   horizontally. 7. **\*\*Performance\*\***: open DevTools → Network on
a fresh page load. You should see small,    separate JS chunks per page
(\`Dashboard-\*.js\`, \`Tasks-\*.js\`, etc.) loading only as you  
 navigate to them, rather than one large bundle upfront.

**\## Phase 9 architecture decisions**

\- **\*\*Dark mode via CSS variables, not \`dark:\` on every
element\*\***: \`paper\`/\`ink\` color tokens   are defined as CSS
custom properties (\`index.css\`) and referenced through Tailwind's  
\`rgb(var(--x) / \<alpha-value\>)\` pattern. Toggling a \`.dark\` class
on \`\<html\>\` re-themes   every \`bg-paper\`, \`text-ink\`,
\`border-paper-border\`, etc. across the whole app at once ---   without
touching most component files. Only the light-tint accent badges
(priority/category   chips, stat card icons) needed explicit \`dark:\`
overrides, since a pale tint that works on a   white card looks wrong on
a dark one. - **\*\*Caught mid-implementation\*\***: switching \`ink\`
to a theme-aware variable would have silently   broken the toast
component and every modal backdrop, both of which used a hardcoded  
\`bg-ink\` assuming it was always dark. Toasts now use a fixed neutral
color; all five modal   forms were refactored onto one shared
\`\<Modal\>\` component with a backdrop that's explicitly   dark in both
themes --- fixing the bug everywhere at once instead of patching five
files   individually. - **\*\*Shared \`\<Modal\>\` component\*\*** now
backs every form (Task/Habit/Expense/Profile/Password):   Escape closes
it, clicking the backdrop closes it, focus moves into the dialog on open
and   back to the trigger element on close, and background scroll is
locked while it's open ---   none of which existed before this phase. -
**\*\*Skeletons only on first load, not every refetch\*\***: each list
page tracks a   \`hasLoadedOnce\` ref; filter/search/sort changes keep
the current list visible (dimmed via   opacity) while refetching instead
of flashing back to a skeleton, so typing in a search box   doesn't feel
like the page is reloading. - **\*\*Toasts are additive, not a
replacement for inline form errors\*\***: validation errors (bad  
input) still show inline in the form so they're next to the field that
caused them; toasts   report the outcome of an action (saved / deleted /
failed) after the form has already   closed, which is a different kind
of feedback. - **\*\*Route-based code splitting\*\***: every page past
Login/Register is \`React.lazy\`-loaded. This   dropped the main JS
bundle from \~754 KB to \~297 KB and moved Recharts (the single biggest
  dependency) into its own chunk that only downloads when someone visits
Expenses or   Analytics --- most sessions never pay for it. -
**\*\*Accessibility pass\*\***: every form input that relied on
placeholder-only labeling got a real   \`\<label\>\` (visually hidden
with \`sr-only\` where a visible label would be redundant), toggle  
buttons got \`aria-pressed\`, form-level errors got \`role="alert"\`,
and an \`AppLayout\`-level   skip link lets keyboard users jump past the
sidebar/navbar straight to page content. -
**\*\*\`prefers-reduced-motion\` respected globally\*\***: a single
media query in \`index.css\`   collapses all animation/transition
durations to near-zero for anyone with that OS setting,   rather than
handling it per-component.

**\## Phase 5 architecture decisions**

\- **\*\*Dates normalized to UTC midnight, not "today per the server's
local time"\*\***: the route   param \`/api/summaries/:date\` is parsed
as \`YYYY-MM-DDT00:00:00.000Z\` and that exact value is   what's stored
and queried --- so "one summary per user per day" means the same thing  
regardless of server timezone. The frontend's \`toDateKey()\` util
deliberately converts using   the *\*browser's\** local offset before
formatting, so "today" always matches the user's own   calendar day
rather than UTC's. - **\*\*POST creates, PUT edits --- enforced in both
directions\*\***: \`POST /api/summaries\` 409s if a   summary already
exists for that date (matching the spec's "prevent multiple summaries  
unless explicitly editing" rule); \`PUT /api/summaries/:date\` 404s if
one doesn't exist yet,   so the two verbs can't be used interchangeably
to accidentally create duplicates or silently   no-op an edit. A unique
compound index on \`{userId, date}\` backs this at the database level  
too, in case of a race between two requests. - **\*\*Stats row computed
live, never stored on the summary\*\***: \`computeDailyStats()\`
re-queries   Task/Expense for that specific day on every \`GET\`, the
same "no duplicated analytics"   principle as Phase 4's expense stats.
Habit completion will join this same helper once   Phase 6 exists ---
the summary document itself never grows a \`tasksCompleted\` field. -
**\*\*Frontend date navigator disables "forward" at today\*\***:
reflecting on a future day isn't a   meaningful action, so the UI blocks
it outright rather than showing an error after the fact. - **\*\*Mood
stored as an enum string (\`'good'\`), not an emoji\*\***: keeps the
database   locale/font-independent; \`utils/mood.js\` is the single
place emoji ↔ value mapping lives, so   swapping the emoji set later
never touches stored data.

**\## Phase 4 architecture decisions**

\- **\*\*Stats computed with an aggregation pipeline, not duplicated
fields\*\***: \`GET   /api/expenses/stats\` groups the user's expenses
by category and by day with Mongoose's   \`aggregate()\` rather than
storing running totals anywhere --- consistent with the spec's "no  
duplicate analytics data" rule, and it means a deleted/edited expense is
instantly correct   everywhere without a separate recalculation step. -
**\*\*Aggregation requires an explicit ObjectId cast\*\***: unlike
\`find()\`, \`aggregate()\`'s \`\$match\`   doesn't auto-cast a string
\`userId\` against the schema's ObjectId type --- done explicitly   with
\`new mongoose.Types.ObjectId(req.user.id)\` so the stats query doesn't
silently match   zero documents. - **\*\*\`view=today\|week\|month\`
reused from Tasks' pattern\*\***: same server-side date-range  
convenience filters as Phase 3, so "today's expenses" logic lives in one
place   (\`expenseController.js\`'s \`rangeFor\`) instead of being
recomputed on the frontend. - **\*\*Category → color mapping
centralized\*\*** in \`utils/expenseCategories.js\`: the category  
badge dots, the donut chart, and (later) the cross-feature Analytics
page all import the   same map, so a category is always the same color
everywhere rather than each chart picking   its own palette. -
**\*\*\`/stats\` route declared before \`/:id\`\*\*** in
\`expenseRoutes.js\` --- otherwise Express would   try to treat the
literal string \`stats\` as an \`:id\` route param. - **\*\*Dashboard
quick-stats row\*\*** (Tasks today / Spent today) added now that two
real data   sources exist --- it fetches its own lightweight counts
rather than duplicating what   \`TodayTasks\`/\`TodayExpenses\` already
fetch, since the full Day Score card needs Habits data   that doesn't
exist until Phase 6.

**\## Phase 3 architecture decisions**

\- **\*\*Ownership enforced at the query level, not just the
middleware\*\***: every task lookup is   \`Task.findOne({ \_id, userId:
req.user.id })\`, not \`Task.findById(\_id)\` followed by a manual  
check. A mismatch returns a generic 404 (not 403), so a client can't
distinguish "not yours"   from "doesn't exist" and enumerate other
users' task ids. - **\*\*Sort whitelisting\*\***: the \`sort\` query
param is mapped through a fixed lookup table rather   than passed
straight to Mongoose --- prevents sorting on arbitrary/unindexed fields
from a   crafted request. -
**\*\*\`view=today\|upcoming\|completed\`\*\*** are convenience filters
computed server-side (date-range   math) so the frontend doesn't
duplicate "what counts as today" logic in multiple places ---   the
Dashboard widget and the Tasks page both just pass \`view=today\`. -
**\*\*Optimistic UI updates\*\*** on the checkbox (both in \`Tasks.jsx\`
and the dashboard widget):   the UI flips instantly and only rolls back
by re-fetching if the API call actually fails,   so completing a task
doesn't feel laggy. - **\*\*Compound indexes\*\*** (\`userId+dueDate\`,
\`userId+status\`) added on the Task model up front   since those are
exactly the two query shapes Today's Tasks / filtered views use. -
**\*\*Sidebar shows the full planned nav\*\***
(Habits/Expenses/Summary/Analytics/Profile/Settings)   marked "Soon"
rather than only showing built pages --- sets accurate expectations
without   dead links, and avoids re-building nav from scratch each
phase.

**\## Authentication architecture**

DailyLife uses a two-token session model:

-   **Access token:** short-lived JWT (`ACCESS_TOKEN_EXPIRES_IN`,
    default `15m`) used for authenticated API requests.
-   **Refresh token:** long-lived token (`REFRESH_TOKEN_EXPIRES_IN`,
    default `7d`) used to maintain the user's session.
-   Authentication credentials are stored/managed through **HTTP-only
    cookies**, keeping them inaccessible to normal frontend JavaScript.
-   Refresh tokens are hashed in MongoDB, rotated when
    `/api/auth/refresh` is used, and revoked on logout.
-   When the access token expires, the frontend requests a refresh and
    retries the failed API request.
-   The frontend does **not** persist JWT credentials in `localStorage`.

Typical flow:

``` text
Login
  ↓
Backend issues access + refresh credentials
  ↓
HTTP-only cookies
  ↓
Normal authenticated API requests
  ↓
Access token expires
  ↓
Refresh endpoint
  ↓
New access token
  ↓
Original request retried
```

This keeps long-lived authentication credentials out of
JavaScript-accessible storage while keeping normal API requests fast.

**\## Deployment**

DailyLife is structured for a split frontend/backend deployment:

``` text
Browser
   │
   ▼
Vercel — React/Vite frontend
   │
   ▼
Render — Express/Node backend
   ├── MongoDB Atlas
   └── Cloudinary
```

### Backend --- Render

Use:

``` text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

The backend should listen on the platform-provided port:

``` js
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`DailyLife API running on port ${PORT}`);
});
```

Configure the production environment variables in Render:

``` env
MONGO_URI=
JWT_SECRET=
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
ACCESS_COOKIE_NAME=dailylife_access_token
REFRESH_COOKIE_NAME=dailylife_refresh_token
CLIENT_URL=https://your-frontend-domain.com

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend --- Vercel

Use:

``` text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Set:

``` env
VITE_API_URL=https://your-backend.onrender.com/api
```

After deployment, update the backend `CLIENT_URL` to the actual Vercel
frontend URL. This is important for CORS and cookie-based
authentication.

> Never commit production `.env` files or secrets to GitHub.

**\## Avatar uploads with Cloudinary**

Profile avatars are uploaded from the browser as
\`multipart/form-data\`. The backend uses Multer with memory storage,
uploads the image buffer to Cloudinary under \`dailylife/avatars\`, and
stores Cloudinary's \`secure_url\` in \`User.avatar\`. The Cloudinary
public ID is also kept internally so future replacement can overwrite
the same user asset.

Backend environment variables:

\`\`\`env CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret \`\`\`

Avatar rules: JPG, PNG, WEBP, or GIF; maximum 5 MB. Never expose the
Cloudinary API secret in frontend code.

The profile endpoint remains \`PUT /api/profile\`; send \`name\`,
\`bio\`, and an optional \`avatar\` file in a \`FormData\` request.

------------------------------------------------------------------------

## Current implementation status

``` text
Authentication        ✅ Two-token cookie-based session
Tasks                 ✅ Progress + completion flow
Habits                ✅ Daily completion + streaks
Expenses              ✅ CRUD + analytics
Daily Summary         ✅ One summary per user/day
Activity              ✅ Meaningful, non-duplicated events
Analytics             ✅ Cross-feature charts
Profile               ✅ Profile editing + password
Avatar Uploads        ✅ Multer + Cloudinary
Settings              ✅ Implemented
Dark Mode             ✅ Persistent theme
Responsive UI         ✅ Desktop + mobile
Loading/Error States  ✅
Deployment             🚀 Ready for production verification
```

### Authentication notes

-   Access tokens are short-lived.
-   Refresh tokens are long-lived.
-   Authentication credentials are handled with HTTP-only cookies.
-   Refresh sessions are rotated and revoked on logout.
-   No authentication token is stored in `localStorage`.

### Avatar notes

-   Profile images are sent as `multipart/form-data`.
-   Multer handles the incoming file in memory.
-   Cloudinary stores the image.
-   The resulting Cloudinary `secure_url` is saved to the user's MongoDB
    document.
-   Cloudinary secrets remain backend-only.
