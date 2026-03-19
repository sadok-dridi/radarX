# Opportunity Radar (radarX)

**Opportunity Radar** is a private opportunity intelligence system built around self-hosted automation workflows (e.g., `n8n`). It discovers, scores, validates, and routes high-signal opportunities from online sources (starting with Reddit and expanding to other platforms), presenting them in a clean, owner-controlled dashboard.

This project is designed as a personal/private tool for finding and managing high-signal opportunities with minimal noise, while keeping all data securely behind an approval-based access system.

## 🚀 Key Features

*   **Private Operator Dashboard:** A protected area to review real opportunities, monitor source activity, and track workflow runs.
*   **Public Landing Page:** A public-safe facade that explains the workflow without exposing any sensitive lead data.
*   **Approval-Based Access:** Built-in user role management (`owner`, `member`, `pending`). Users must request access and be approved by an owner.
*   **Opportunity Scoring & Validation:** Review opportunities with explainable scoring, helping you focus on the highest-value leads.
*   **Source & Workflow Monitoring:** Keep track of source health and n8n workflow run statuses directly from the dashboard.
*   **Local AI Integration:** Built-in scripts for running local AI controllers and workers to process and score data independently.

## 🛠 Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Database:** PostgreSQL with [Prisma ORM](https://www.prisma.io/)
*   **Authentication:** Custom JWT-based auth with `jose` & `bcryptjs`
*   **Automation:** Integrates with `n8n` workflows
*   **Language:** TypeScript

## 📂 Core Route Structure

*   `/` - Public landing page
*   `/login` - Sign in
*   `/request-access` - Account request page
*   `/app` - Dashboard home (Protected)
*   `/app/opportunities` - Opportunities list
*   `/app/opportunities/[id]` - Opportunity detail view
*   `/app/sources` - Sources and source health tracking
*   `/app/runs` - Workflow run monitoring
*   `/app/reviews` - Review queue
*   `/app/settings` - Settings & user administration
*   `/app/access` - Approve or reject pending users

## 🏁 Getting Started

### Prerequisites

*   Node.js (v18+ recommended)
*   PostgreSQL database
*   (Optional) Local AI setup if using the local AI worker scripts
*   (Optional) n8n instance for data ingestion

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd radarX
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy the example environment file and configure your database and auth secrets.
   ```bash
   cp .env.example .env
   ```
   *Make sure to update `DATABASE_URL`, `JWT_SECRET`, and any AI/n8n related keys in your `.env` file.*

4. **Initialize the Database:**
   Push the Prisma schema to your database and generate the Prisma client:
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

### Local AI Workers

If you are utilizing the local AI processing pipeline, you can start the controller and worker using the provided npm scripts:

```bash
# Start the AI controller
npm run controller:local-ai

# Start the AI worker
npm run worker:local-ai
```
*(See `LOCAL_AI_WORKER.md` and `LOCAL_LLM_SSH_TUNNEL_SETUP.md` for more detailed AI setup instructions).*

## 📖 Documentation

For more detailed information on the project's architecture and planning phases, refer to the included markdown files:

*   `PROJECT_PLAN.md` - High-level overview and route structure
*   `PHASE_01_PRODUCT_BLUEPRINT.md` - Product goals and definitions
*   `PHASE_02_DATABASE_SCHEMA.md` - Database design
*   `DEPLOYMENT_WORKFLOW.md` - Deployment strategies

## 📄 License

This project is private and intended for personal use.
