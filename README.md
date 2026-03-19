<div align="center">

# 🎯 Opportunity Radar (radarX)

**An advanced, AI-powered opportunity intelligence & routing platform.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

</div>

<br />

## 🌟 Overview

**Opportunity Radar** is a powerful intelligence system designed to discover, score, validate, and route high-signal opportunities from online platforms in real-time. By connecting directly to automated ingestion workflows (such as `n8n`), it cuts through the noise of the internet, allowing operators to focus exclusively on highly validated, actionable leads.

The platform offers a high-performance operator dashboard, integrated local AI processing capabilities, and comprehensive source-health monitoring.

---

## ✨ Key Features

- **🧠 Intelligent Scoring & Validation:** Leverages automated pipelines and integrated AI workers to provide explainable scoring, ensuring you only spend time on high-value opportunities.
- **⚡ Advanced Automation Hooks:** Deeply integrates with event-driven architectures and workflow engines to continuously ingest data from multiple platforms.
- **🛡️ Secure Access Management:** Robust role-based access control. Users must request access and be formally approved before entering the dashboard environment.
- **📊 Operator Dashboard:** A sleek, dark-mode optimized interface to review opportunities, track workflow run statuses, and monitor the health of your data sources.
- **🤖 Local AI Pipelines:** Built-in controllers and workers for local LLM execution, providing advanced AI intelligence right out of the box.

---

## 🛠️ Technology Stack

<details>
<summary><b>Click to view the full stack details</b></summary>
<br/>

- **Frontend:** [Next.js](https://nextjs.org/) (App Router), React 19, [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** Node.js, Next.js API Routes / Server Actions
- **Database:** PostgreSQL managed via [Prisma ORM](https://www.prisma.io/)
- **Authentication:** Custom stateless JWT auth utilizing `jose` and `bcryptjs`
- **AI / Automation:** Local AI Worker scripts & `n8n` integration
</details>

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL Database
- (Optional) n8n instance for data ingestion workflows
- (Optional) Local LLM setup for AI scoring

### 1️⃣ Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/your-org/radarX.git
cd radarX
npm install
```

### 2️⃣ Environment Configuration

Copy the example environment file and apply your variables:

```bash
cp .env.example .env
```
*Ensure you configure your `DATABASE_URL`, `JWT_SECRET`, and any required AI integrations.*

### 3️⃣ Database Setup

Initialize your database schema and generate the Prisma client:

```bash
npm run db:push
npm run db:generate
```

### 4️⃣ Launch the Platform

Start the development server:

```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the landing page and request dashboard access.

---

## 🧠 Local AI Worker Setup

For advanced processing, Opportunity Radar includes scripts to run AI controllers locally.

```bash
# Terminal 1: Start the AI Controller
npm run controller:local-ai

# Terminal 2: Start the AI Worker
npm run worker:local-ai
```

---

## 📂 Architecture & Documentation

Deep dive into the architecture through our internal documentation:
- 📄 `PROJECT_PLAN.md` - Core routing and structure
- 📄 `PHASE_01_PRODUCT_BLUEPRINT.md` - Product strategy
- 📄 `PHASE_02_DATABASE_SCHEMA.md` - Data models
- 📄 `DEPLOYMENT_WORKFLOW.md` - CI/CD guidelines

---

<div align="center">
  <i>Built with precision for high-signal intelligence.</i>
</div>