<div align="center">

# 🎯 Opportunity Radar (radarX)

**A Hybrid-Cloud AI Intelligence & Routing Platform.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![n8n](https://img.shields.io/badge/n8n-Workflow_Automation-FF6D5A?style=for-the-badge&logo=n8n&logoColor=white)](https://n8n.io/)
[![Ollama](https://img.shields.io/badge/Ollama-Local_LLMs-white?style=for-the-badge&logo=ollama&logoColor=black)](https://ollama.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

<br />

### 🌐 Live Demo: [radarX.mooo.com](http://radarX.mooo.com)

</div>

<br />

## 🌟 Overview (The Problem & Solution)

**Opportunity Radar (radarX)** is a distributed intelligence platform that automates the ingestion, scoring, and routing of high-value opportunities from across the web. 

**The Problem:** Using cloud-based LLMs (like OpenAI) for high-volume data classification is prohibitively expensive and introduces rate-limiting bottlenecks.

**The Solution:** I engineered a hybrid-cloud architecture. Data is ingested on a VPS via `n8n`, but the heavy AI inference is securely offloaded to a local machine running `Ollama` via a reverse SSH tunnel. 

**Business Impact:** This architecture reduces AI API costs by an estimated 80-100% while maintaining complete data privacy and sub-second response times for the Next.js operator dashboard.

---

## 🏗️ Architecture & Engineering Decisions

```mermaid
graph TD
    subgraph CloudVPS ["Cloud VPS"]
        Nginx[Nginx Reverse Proxy]
        NextJS[Next.js 15 UI]
        N8N[n8n Scraper/Ingestion]
        DB[(PostgreSQL)]
        
        Nginx --> NextJS
        Nginx --> N8N
        NextJS <--> DB
        N8N -->|Insert Tasks| DB
    end

    subgraph LocalEnv ["Local Environment (Fedora PC)"]
        Worker[Node.js AI Worker]
        Ollama[Ollama Local LLM]
        
        Worker <-->|Reverse SSH Tunnel| DB
        Worker <--> Ollama
    end

    %% Flow
    Internet((Internet Sources)) -->|Scrape| N8N
    Worker -->|Fetch Task| DB
    Worker -->|Prompt| Ollama
    Ollama -->|Result| Worker
    Worker -->|Update DB| DB
```

### 1. Hybrid-Cloud AI Pipeline (Cost Optimization)
Instead of processing thousands of scraped items through paid APIs, a custom Node.js worker runs on a local Fedora machine. It connects to the VPS PostgreSQL database via a secure SSH tunnel, leases pending classification tasks, processes them locally using `Ollama`, and writes the validated results back to the cloud.

### 2. Event-Driven Ingestion (Automation)
Self-hosted `n8n` instances act as the nervous system, continuously scraping data from target platforms, formatting the payloads, and inserting them into the AI queue table.

### 3. High-Performance Dashboard (Full Stack)
The operator interface is built with Next.js 15 (App Router) and Tailwind CSS, featuring dark-mode optimization, stateless JWT authentication (`jose`, `bcryptjs`), and real-time status monitoring of the AI workers and data sources.

---

## ✨ Key Features

- **🧠 Distributed AI Workers:** Local LLM execution with queue management and leasing to prevent race conditions.
- **⚡ Automated Ingestion Hooks:** Deep `n8n` integration for continuous, headless data aggregation.
- **🛡️ Stateless Security:** Custom JWT auth with strict Role-Based Access Control (RBAC). Users require manual admin approval.
- **📊 Operator Command Center:** A sleek UI to review scored opportunities, track workflow health, and monitor system latency.

---

## 🛠️ Technology Stack & Deployment

- **Infrastructure:** VPS (Ubuntu), Docker, Nginx Reverse Proxy, SSH Tunnels.
- **Backend & Database:** Node.js, Next.js Server Actions, PostgreSQL (managed via Prisma ORM).
- **Frontend:** Next.js 15, React 19, Tailwind CSS.
- **AI & Automation:** `Ollama` (Local LLMs), `n8n` (Workflow Automation).

*The platform is containerized using Docker, with Nginx handling SSL termination and reverse proxy routing on the production VPS.*

---

<div align="center">
  <i>Engineered for high-signal intelligence and cost-effective automation.</i>
</div>
