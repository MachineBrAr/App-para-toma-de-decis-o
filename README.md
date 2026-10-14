# ⚖️ The Tiebreaker — Decision-Making App

🌐 **English** | [Português (Brasil)](README.pt-BR.md)

A web app that helps you weigh the **pros and cons** of any important decision. Describe your dilemma, list the options you are considering, and the app — powered by the **Google Gemini** API — generates a structured analysis and a clear verdict to help you break the tie.

> ⚠️ **Project status:** prototype / proof of concept. Testing is still ongoing and things may change.

---

## ✨ Features

For each decision, the app generates:

1. **Executive summary** of the dilemma in 2–3 sentences.
2. **Weighted pros and cons** for each option, with an impact weight (1–5), a thematic category, an explanation, and mitigation advice for the cons.
3. **Multi-criteria comparison matrix** with scores from 1 to 10 and a short rationale per criterion (e.g. long-term upside, stress/wellbeing, reversibility, personal values alignment, execution speed).
4. **SWOT analysis** — strengths, weaknesses, opportunities and threats — for each option.
5. **The Tiebreaker Verdict**:
   - Recommended option and confidence level.
   - The decisive factor ("The Clincher").
   - An intuitive gut-check question.
   - Cognitive blind spots and biases.
   - An immediate 3-step action plan with timelines.

Also:

- **Option suggestions:** if you don't know which alternatives to consider, the app proposes 2–3 concrete paths based on your dilemma title.
- **Follow-up questions:** once you have a verdict, you can ask the Tiebreaker additional questions.
- **Vague options:** if an option expresses hesitation or inertia (e.g. "I don't know", "wait and see"), the AI is instructed to challenge it and expose the hidden cost of not deciding.
- **Bilingual:** analysis in Portuguese (`pt`, default) and English (`en`).
- **Fallback mode:** if the AI service is busy, rate-limited or fails, the server returns a generic strategic analysis generated locally (flagged with `isFallback: true`), so the app keeps working.

---

## 🧰 Tech Stack

| Area | Tools |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS 4, Motion (animations), Lucide React (icons), canvas-confetti |
| Backend | Node.js + Express, run with `tsx` |
| AI | Google Gemini via the `@google/genai` SDK |
| Language | TypeScript |
| Package manager | Bun (`bun.lock`); npm also works |

---

## 📁 Repository Structure

```
.
├── src/             # Frontend code (React)
├── server.ts        # Express server: API + Gemini integration + Vite
├── index.html       # App HTML entry point
├── vite.config.ts   # Vite configuration
├── tsconfig.json    # TypeScript configuration
├── package.json     # Dependencies and scripts
├── bun.lock         # Bun lockfile
├── metadata.json    # App metadata
├── .env.example     # Environment variables template
└── .gitignore
```

---

## 🚀 Getting Started

### Requirements

- [Bun](https://bun.sh) or [Node.js](https://nodejs.org) (v18 or higher recommended)
- A Gemini API key ([Google AI Studio](https://aistudio.google.com/apikey))

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/MachineBrAr/App-para-toma-de-decis-o.git
   cd App-para-toma-de-decis-o
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and fill in your values:

   ```env
   GEMINI_API_KEY="your_gemini_api_key"
   APP_URL="http://localhost:3000"
   ```

4. **Start the development server**

   ```bash
   bun run dev
   # or
   npm run dev
   ```

   The app will be available at **http://localhost:3000** (change the port with the `PORT` variable).

> Without `GEMINI_API_KEY` the server still starts, but the analysis endpoints will return an error or fallback content.

---

## 🔐 Environment Variables

| Variable | Description | Required |
| --- | --- | --- |
| `GEMINI_API_KEY` | Gemini API key used for AI analysis | Yes |
| `APP_URL` | URL where the app is hosted (self-links, callbacks) | No (local) |
| `PORT` | Server port (default `3000`) | No |
| `DISABLE_HMR` | If `true`, disables Vite hot reload in development | No |

⚠️ **Never commit your `.env` file.** The key is used only on the server and is not exposed to the browser.

---

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `dev` | Starts the server with Vite in development mode |
| `build` | Creates the production build in `dist/` |
| `start` | Starts the server in production mode (serves `dist/`) |
| `preview` | Previews the build with Vite |
| `lint` | Type-checks with TypeScript (`tsc --noEmit`) |
| `clean` | Removes `dist` and `server.js` |

For production:

```bash
bun run build
bun run start
```

---

## 🔌 API

All endpoints are JSON `POST` requests, except the health check.

### `GET /api/health`
Checks that the server is running and whether an API key is configured.

```json
{ "status": "ok", "hasApiKey": true }
```

### `POST /api/analyze-decision`
Generates the full analysis of a decision.

```json
{
  "title": "Should I change jobs or stay where I am?",
  "context": "Optional extra context",
  "options": ["Change jobs", "Stay"],
  "priorities": ["Stability", "Growth"],
  "language": "en"
}
```

- `title` is required.
- If fewer than 2 valid options are sent, two default options are used ("proceed" / "maintain status quo").
- Response: `summary`, `optionsAnalysis`, `comparisonMatrix` and `verdict`.

### `POST /api/suggest-options`
Suggests 2–3 concrete options based on the dilemma title.

```json
{ "title": "Should I move to another city?", "context": "", "language": "en" }
```

Response: `{ "options": ["...", "..."] }`

### `POST /api/ask-tiebreaker`
Answers a follow-up question about the decision and its verdict.

```json
{
  "decisionTitle": "...",
  "currentVerdict": "...",
  "question": "What if my salary drops by 10%?",
  "language": "en"
}
```

Response: `{ "answer": "..." }`

---

## ⚠️ Disclaimer

AI-generated recommendations are an **aid to reflection**, not a substitute for your own judgment or for professional advice (financial, legal, medical, etc.). The final decision is always yours.

---

## 📄 License

This project is in the **public domain**. Anyone may copy, modify, distribute and use it, for personal or commercial purposes, without asking permission or giving attribution.

It is provided "as is", without warranty of any kind.

## 👤 Author

Developed by [MachineBrAr](https://github.com/MachineBrAr).
