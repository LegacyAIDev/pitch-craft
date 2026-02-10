# PitchCraft

**Turn discovery calls into winning proposals automatically.**  
PitchCraft is an end-to-end agentic AI system that converts discovery call recordings into complete, professional proposals with **machine-learning–predicted pricing** in under 10 minutes.

Built for Google’s Hackathon.

---

## Overview

Quote-based service businesses lose deals due to slow proposal turnaround and inconsistent pricing. PitchCraft eliminates this bottleneck by transforming unstructured sales conversations into priced, ready-to-send proposals using **LLM agents + Machine Learning as a Tool (MLAT)**.

Instead of asking LLMs to guess numbers, PitchCraft invokes a real ML pricing model as a callable tool inside the agent workflow.

---

## Key Idea: Machine Learning as a Tool (MLAT)

Most AI proposal tools rely entirely on LLMs for reasoning and pricing. PitchCraft separates concerns:

- **LLMs** handle language understanding, reasoning, and drafting
- **ML** handles numeric prediction and pricing consistency

A pre-trained **XGBoost model** is exposed as a callable tool via FastAPI and invoked contextually by the agent during proposal generation.

---

## System Architecture

PitchCraft operates as a single agentic workflow with two Gemini-powered agents:

### 1. Research Agent

- Ingests Fireflies.ai discovery call transcripts
- Performs prospect intelligence gathering via parallel tool calls
- Uses Firecrawl for company data and Perplexity for background research
- Outputs structured JSON with scope, requirements, and complexity factors

### 2. Draft Agent

- Extracts pricing features from structured research output
- Invokes the XGBoost pricing model as a **tool call**
- Reasons about the prediction in context
- Generates a complete proposal using structured output parsing
- Renders the proposal into a Google Docs template

---

## Pricing Model

- Model: **XGBoost Regressor**
- Training data:
  - 40 real agency deals
  - 30 human-verified synthetic records
- Validation:
  - Group-aware cross-validation
- Performance:
  - R²: **0.807**
  - MAE: **$3,688**
- Designed to work under **extreme data scarcity**

A sensitivity analysis confirms the model learns economically meaningful relationships between scope, integrations, and complexity.

---

## Tech Stack

**Backend**

- FastAPI
- Python
- XGBoost
- scikit-learn
- Pandas

**Agents & Automation**

- Gemini
- n8n (workflow orchestration)
- Tool calling and structured output parsing

**Frontend**

- React
- Vercel

**Integrations**

- Fireflies.ai
- Firecrawl
- Perplexity
- Google Docs

---

## Results (Pilot Deployment)

Deployed in production at **Legacy AI LLC**:

- 18× faster proposal creation
- 12–18× faster speed-to-lead
- 95%+ reduction in hands-on proposal time
- Proposals generated in under 10 minutes

---

## What’s Next

- Expand pricing model with more real-world data
- Add support for custom training data for a business
- Build closed-loop learning from won/lost deals
- Industry-specific pricing models (construction, consulting, services)

---

## Why This Matters

PitchCraft demonstrates that ML does not need to be replaced by LLMs.  
Instead, **ML becomes more powerful when embedded as a tool inside agentic systems**.

ML isn’t just about training models.  
It’s about **where you place them in the system**.

---

## 🔗 Links

- Live Demo: https://pitch-craft-hackathon.vercel.app/
- Devpost: https://devpost.com/software/pitchcraft

---

## 📝 License

MIT License (see `LICENSE` file).

---

If you want, I can also:

- Add an **Architecture Diagram section**
- Write a **Technical Deep Dive** README
- Create a **Judge-friendly TL;DR** at the top
