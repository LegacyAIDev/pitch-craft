<<<<<<< HEAD
## PitchCraft – Discovery-to-Proposal Automation

PitchCraft is a Next.js 16 (App Router) app that turns discovery calls into complete, ready-to-send proposals using:
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)
..
## Getting Started
>>>>>>> 4c881f8d1659a67badd76b298388d86dbdffe05b

- **AI Discovery Agent** (Gemini via Vercel AI SDK)
- **Fireflies recording upload** (via n8n → HuggingFace webhook)
- **Supabase Auth** (email/password + company metadata)

The main flows:

- **Marketing site**: high-converting landing page at `/`
- **Auth**: `/signup` and `/login` (Supabase)
- **Dashboard**: `/dashboard` with:
  - AI Discovery Agent chat (Gemini)
  - Fireflies recording upload
  - Recent proposals & empty state

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/postcss`)
- **Fonts**: Barlow Condensed, Bebas Neue, Cal Sans
- **Auth**: Supabase (`@supabase/supabase-js`)
- **AI**: Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/google` – Gemini)

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create `.env.local` in the project root (based on `.env.example`):

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
```

- Supabase URL + anon key: from your Supabase project (`Settings → API`).
- Gemini API key: from Google AI Studio (`https://aistudio.google.com/apikey`).

### 3. Run dev server

```bash
npm run dev
```

Then open `http://localhost:3000`.

---

## Auth & User Data

- **Signup** (`/signup`):
  - Email, password
  - Company name, location, niche (stored in Supabase user metadata)
  - Beta notice: ML model fine-tuned on LegacyAI quote data
- **Login** (`/login`):
  - Email, password
  - On success → redirect to `/dashboard`

Dashboard routes are protected on the client using Supabase session checks.

---

## Dashboard Overview

### Header

- `PitchCraft` logo
- Breadcrumb `Dashboard`
- User menu (company name, email, Settings, Logout)

### Discovery Agent (Gemini)

- Large primary card: **Start Discovery Agent**
- Modal chat:
  - Uses Vercel AI SDK `useChat` with API:
    - `POST /api/discovery/chat`
  - Model: `google("gemini-1.5-flash")`
  - Rich **system prompt** (“PitchCraft Discovery Agent”) for:
    - Business goals, scope, tech, timeline, budget, success metrics
  - Conversation UI:
    - Assistant messages: navy bubbles
    - User messages: beige bubbles
    - Typing state: “AI is thinking…”
  - **Generate Proposal**:
    - Builds a transcript of the conversation
    - Calls `POST /api/discovery/send-transcript`
    - When the backend returns a PDF:
      - Shows inline PDF preview in the modal
      - Provides **Download PDF** button

### Upload Fireflies Recording

- Secondary card: **Upload Fireflies Recording**
- Modal:
  - Validates Fireflies URL
  - Calls:
    - `POST /api/discovery/fireflies` with `{ url: "<fireflies-link>" }`
  - Backend forwards to the same HuggingFace/n8n webhook as discovery
  - On success with PDF:
    - Shows **“Proposal generated successfully!”**
    - Inline PDF preview
    - **Download PDF** and Close button

---

## API Endpoints

All endpoints are implemented as App Router routes under `app/api`.

- **Discovery chat**

  - `POST /api/discovery/chat`
  - Body: `{ messages: UIMessage[] }` from `@ai-sdk/react` `useChat`
  - Uses `streamText` with Gemini and the Discovery Agent system prompt

- **Send transcript (Discovery → Proposal)**

  - `POST /api/discovery/send-transcript`
  - Body from client: `{ transcript: string }`
  - Server:
    - Forwards to HuggingFace/n8n webhook
    - Detects PDF by header or magic bytes
    - Returns the PDF with `Content-Type: application/pdf`

- **Fireflies upload → Proposal**

  - `POST /api/discovery/fireflies`
  - Body: `{ url: string }` (Fireflies meeting link)
  - Server:
    - Forwards to the same webhook with `{ url }`
    - Detects and returns PDF as above

Front-end treats any successful binary response with enough size as a PDF and shows an inline preview + download link.

---

## Development Notes

- UI is built mobile-first with:
  - Sticky header on dashboard
  - Responsive sections and modals
- Dashboard and settings use a shared `DashboardHeader`.
- Supabase client is created lazily in `lib/supabase/client.ts` and throws a clear error if env vars are missing.
- AI SDK is used in **client** components via `@ai-sdk/react` and in **server** routes via `ai` and `@ai-sdk/google`.

---

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – run built app
- `npm run lint` – run ESLint

