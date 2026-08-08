# CRYPTICX — Full-Stack Digital Services, Marketplace, Hosting & Cybersecurity Platform

CRYPTICX is an enterprise-grade, highly scalable web platform unifying digital services, marketplace templates, domain & web hosting management, automated wallet ledger system, localized Bangladeshi mobile financial services (bKash, Nagad, Rocket, Bank Transfer), encryption tools, and cybersecurity solutions.

## Monorepo Architecture

- `frontend/`: Next.js 14+ App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, i18n.
- `backend/`: FastAPI, SQLAlchemy 2.0 Async, PostgreSQL, Alembic, JWT auth, Redis, Celery (Phase 2+).
- `database/`: Database schema definitions and seed data.
- `docs/`: Technical specifications and architectural decision records.
- `docker/`: Docker container configs and Nginx reverse proxy setups.

## Phase 1 Quick Start

### Prerequisites
- Node.js >= 18.17.0
- npm >= 9.0.0

### Installation & Local Run
```bash
# Clone repository
git clone [https://github.com/your-org/crypticx.git](https://github.com/your-org/crypticx.git)
cd crypticx/frontend

# Install dependencies
npm install

# Run frontend development server
npm run dev
