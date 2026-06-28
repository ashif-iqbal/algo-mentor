# 🧠 AlgoMentor

**An AI-powered mentor that lives inside your LeetCode tab.**

AlgoMentor is a Chrome Extension that injects a live AI mentoring sidebar directly into LeetCode problem pages. Instead of jumping to the discussion tab and copying a solution, you get a **context-aware AI tutor** — powered by Google's Gemini LLM — that reads the problem with you and nudges you toward the answer through reasoning, not spoon-feeding.

No frontend framework. No copy-pasting problem statements. No more "I'll just peek at one solution real quick."

---

## 🤖 Why This Project is LLM-Native

This isn't a wrapper that pastes your prompt into ChatGPT. The entire mentoring experience is built **around** the LLM:

- **Live page context, not manual prompting** — the extension scrapes the problem title, description, and examples straight off the DOM and feeds them to the model automatically, so the AI always knows exactly what you're looking at.
- **Multi-turn conversational memory** — the backend maintains conversation state so the AI remembers what hints it already gave you and builds on them, instead of repeating itself.
- **A 3-tier adaptive hint system, enforced by prompt design** — the LLM is instructed to _progressively_ reveal reasoning (nudge → strategy → near-solution) rather than dumping the answer on hint #1. The model is the gatekeeper of how much help you get.
- **Reasoning over retrieval** — the goal isn't "give me the code," it's "help me think like someone who could've solved this myself." The AI is prompted to explain _why_, not just _what_.

In short: the LLM isn't a feature bolted onto this project — it **is** the project.

---

## ✨ Features

- 🧩 **Injected sidebar UI** — a collapsible panel directly inside LeetCode problem pages, toggleable on demand
- 🔍 **Automatic problem scraping** — title, description, and examples are pulled live from the page, zero copy-paste
- 💬 **Conversational AI mentor** — ask follow-up questions, the AI remembers context
- 🪜 **3-tier hint escalation** — Hint 1 (nudge) → Hint 2 (strategy) → Hint 3 (near-solution), instead of an instant answer
- ⚡ **Zero frontend framework** — pure HTML/CSS/JS content script, no React/Vue overhead
- 🔌 **Simple Express backend** — one clean `/mentor` endpoint powers the entire experience

---

## 🛠️ Tech Stack

| Layer     | Tech                                                    |
| --------- | ------------------------------------------------------- |
| Extension | Chrome Extension (Manifest V3), vanilla JS, vanilla CSS |
| Backend   | Node.js, Express                                        |
| AI        | Google Gemini API (`@google/genai`)                     |
| Tooling   | dotenv, cors                                            |

---

## 📁 Project Structure

```
algo-mentor/
├── backend/
│   ├── server.js          # Express server + /mentor endpoint
│   ├── routes/             # Route handlers
│   └── package.json
└── extension/
    ├── manifest.json        # Manifest V3 config
    ├── content.js           # Sidebar injection + DOM scraping + fetch logic
    └── styles.css           # Sidebar styling
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/ashif-iqbal/algo-mentor.git
cd algo-mentor
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

Run the server:

```bash
node server.js
```

### 3. Load the extension

1. Open `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select the `extension/` folder
5. Open any LeetCode problem page — the AlgoMentor sidebar will appear automatically

---

## 🔌 API Reference

### `POST /mentor`

**Request body:**

```json
{
  "problem": "Full problem title + description + examples, scraped live from the page",
  "conversation": "Running conversation history for multi-turn context",
  "hintLevel": 1
}
```

**Response:**

```json
{
  "reply": "AI-generated mentoring response, scaled to the requested hint level"
}
```

`hintLevel` controls how much the AI reveals:

| Level | Behavior                                                                               |
| ----- | -------------------------------------------------------------------------------------- |
| 1     | Conceptual nudge — points toward the right approach without naming it outright         |
| 2     | Strategy-level guidance — names the technique/pattern to use                           |
| 3     | Near-solution walkthrough — detailed reasoning, stops short of handing over final code |

---

## 🧭 How It Works (End to End)

1. You open a LeetCode problem → `content.js` injects the sidebar
2. `content.js` scrapes the problem title, description, and examples from the DOM
3. You type a question or click a hint level → the extension sends `problem`, `conversation`, and `hintLevel` to the backend
4. The backend builds a tier-aware prompt and calls the **Gemini API**
5. Gemini reasons through the problem at the requested hint level and returns a response
6. The sidebar renders the AI's reply, and the conversation context carries forward into your next question

---

## 🎯 Philosophy

Most "AI coding helpers" just generate the answer. AlgoMentor is built on the opposite premise: **the value of LeetCode is the struggle, not the solution.** By making the LLM enforce a hint hierarchy instead of answering outright, this project turns an LLM from an answer-key into an actual tutor — closer to how a human mentor would coach you through a whiteboard interview.

---
