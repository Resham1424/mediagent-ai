# 🏥 MediAgent AI

> ⚕️ **Advisory Only:** MediAgent AI provides informational guidance only. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.

---

## 📌 Overview

MediAgent AI is a **multi-agent AI healthcare operations system** that automates the full patient journey — from symptom intake to specialist booking to follow-up care. Built on top of the Anthropic Claude API, it chains five specialized AI agents to deliver accurate triage, emergency detection, doctor matching, smart scheduling, and post-consultation tracking — all with a complete audit trail and strict medical safety guardrails.

```
Patient enters symptoms
        ↓
 Symptom Analysis Agent
        ↓
 Emergency Detection Agent  ──→  [CRITICAL? → ER Override]
        ↓
 Specialist Recommendation Agent
        ↓
 Scheduling Assistant Agent
        ↓
 Follow-Up Care Agent
        ↓
 Full Audit Log Exported
```

---

## 🎯 Problem It Solves

| Problem | Impact |
|---|---|
| Patients visit wrong specialists | Wasted time, delayed treatment |
| Emergency cases not prioritized | Life-threatening delays |
| No intelligent triage at intake | Overloaded general practitioners |
| Zero automated follow-up | Poor recovery adherence |
| No audit trail for decisions | Compliance and liability gaps |

---

## ✨ Key Features

### 🤖 Multi-Agent Workflow
Five chained Claude API calls, each with a specialized system prompt and structured JSON output. Every agent's output feeds directly into the next.

| Agent | Role |
|---|---|
| **Symptom Analysis Agent** | Extracts symptom patterns, classifies risk level (CRITICAL / HIGH / MEDIUM / LOW) |
| **Emergency Detection Agent** | Detects life-threatening conditions, overrides normal flow if needed |
| **Specialist Recommendation Agent** | Routes patient to the correct specialist type with reasoning |
| **Scheduling Assistant Agent** | Generates pre-visit instructions, appointment type, and doctor match |
| **Follow-Up Care Agent** | Assesses recovery, issues advisory guidance, flags escalation |

### ⚠️ Emergency Override System
If the Emergency Detection Agent flags a critical condition (e.g., chest pain + shortness of breath), the entire scheduling flow is **blocked** and replaced with a high-visibility emergency banner directing the patient to call **108** or proceed to the nearest ER.

### 📊 Real-Time Audit Log
Every agent decision is logged with a timestamped, structured entry including:
- Session ID (auto-generated UUID)
- Agent name and action type
- Input summary and output summary
- Risk flags
- Full exportable JSON

### 🛡️ Compliance Guardrails
- Never prescribes medication or recommends specific drugs
- All outputs labeled **advisory only**
- First-load consent modal (user must acknowledge)
- Persistent "Not a substitute for professional medical advice" header badge
- Risk level always prominently displayed

---

## 🖥️ Tech Stack

```
Frontend       →  Vanilla HTML / CSS / JavaScript (single index.html)
AI Engine      →  Anthropic Claude API (claude-sonnet-4-20250514)
Server         →  Node.js + Express (API proxy to protect key)
Fonts          →  DM Serif Display + DM Sans + JetBrains Mono (Google Fonts)
Deployment     →  Replit (primary) / Vercel / Render
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/mediagent-ai.git
cd mediagent-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set your API key

Create a `.env` file in the root:

```env
ANTHROPIC_API_KEY=your_api_key_here
PORT=3000
```

### 4. Run the app

```bash
npm start
```

Open `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
mediagent-ai/
├── index.html          # Full frontend (HTML + CSS + JS)
├── server.js           # Express API proxy server
├── package.json        # Node dependencies
├── .env                # API key (never commit this)
├── .gitignore
└── README.md
```

---

## 🔁 Agent Architecture (Detail)

### Agent 1 — Symptom Analysis
```json
Input:  { name, age, gender, symptoms, duration }
Output: {
  "symptoms_identified": [...],
  "body_systems_affected": [...],
  "risk_level": "CRITICAL|HIGH|MEDIUM|LOW",
  "emergency_flag": true|false,
  "possible_condition_categories": [...],
  "advisory_note": "..."
}
```

### Agent 2 — Emergency Detection
```json
Input:  Agent 1 output
Output: {
  "is_emergency": true|false,
  "emergency_level": "LIFE_THREATENING|URGENT|STANDARD",
  "immediate_actions": [...],
  "can_proceed_to_scheduling": true|false
}
```

### Agent 3 — Specialist Recommendation
```json
Input:  Agent 1 + 2 output
Output: {
  "primary_specialist": "Cardiologist",
  "consultation_urgency": "Within 24hrs|Within 1 week|Routine",
  "prepare_for_visit": [...]
}
```

### Agent 4 — Scheduling Assistant
```json
Input:  Agent 3 output + selected doctor
Output: {
  "appointment_type_recommendation": "In-Person|Telehealth",
  "pre_visit_instructions": [...],
  "questions_to_ask_doctor": [...]
}
```

### Agent 5 — Follow-Up Care
```json
Input:  Original symptoms + patient check-in text
Output: {
  "recovery_assessment": "Improving|Stable|Needs Attention",
  "warning_signs_to_watch": [...],
  "escalation_needed": true|false
}
```

---

## 🧪 Test Cases

### Test Case 1 — Standard Flow (Non-Emergency)
```
Name:     Rahul Sharma
Age:      34 | Male
Symptoms: Persistent headache for 3 days, mild fever 99.5°F,
          stiffness in neck. No vomiting.

Expected: Risk = HIGH | Specialist = Neurologist
          Scheduling flow proceeds normally
```

### Test Case 2 — Emergency Override
```
Name:     Priya Devi
Age:      52 | Female
Symptoms: Sudden severe chest pain radiating to left arm,
          heavy sweating, dizziness, shortness of breath for 20 mins.

Expected: Risk = CRITICAL | emergency_flag = true
          Scheduling BLOCKED → ER redirect shown
```

---

## 📊 Impact Model

| Metric | Before | After |
|---|---|---|
| Avg. booking time | 15 minutes | ~2 minutes |
| Wrong specialist visits | Baseline | ~50% reduction |
| Emergency response lag | Baseline | ~60% faster identification |
| Follow-up adherence | Low | Improved via AI reminders |

---

## 🛡️ Safety & Compliance

MediAgent AI enforces the following non-negotiable rules in every response:

1. **No prescriptions** — the system will never recommend specific medications or dosages
2. **Advisory-only labeling** — every AI output is explicitly labeled as informational
3. **Emergency escalation** — critical cases are always redirected to emergency services first
4. **Consent gate** — users must acknowledge the advisory-only disclaimer before using the system
5. **Audit trail** — every decision is logged and exportable for compliance review
6. **Risk visibility** — risk level badge is always rendered prominently in the UI

---


## 🗺️ Roadmap

- [ ] EHR (Electronic Health Record) integration
- [ ] Real doctor database API (Practo / DocPrime)
- [ ] SMS/WhatsApp appointment reminders
- [ ] Voice symptom input (Web Speech API)
- [ ] Multi-language support (Hindi, Telugu, Tamil)
- [ ] Doctor dashboard portal
- [ ] PDF export of patient journey report
- [ ] Insurance pre-authorization workflow

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Commit your changes
git commit -m "feat: add your feature description"

# Push and open a PR
git push origin feature/your-feature-name
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👤 Author

Built with ❤️ and the Anthropic Claude API.

> ⚕️ **Reminder:** This project is a demonstration of AI-assisted healthcare workflows. It is not a certified medical device and must not be used as a substitute for professional clinical judgment.
