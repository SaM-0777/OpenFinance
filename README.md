# OpenFinance

OpenFinance is a financial dashboard for tracking institutional investment activity through SEC 13F filings. It helps surface where hedge funds and other institutions are focusing in the market by organizing their latest holdings, portfolio changes, and filing activity in one place.

The project is designed to make institutional market signals easier to explore:

- Track SEC 13F filings and institutional holdings.
- Analyze portfolio allocation and net returns across holdings.
- Understand sentiment around individual funds and the broader tracked market.
- Identify sectors and stocks that are trending in the latest filings.
- Explore where institutions are increasing their market focus.

## Demo

### Market Dashboard

The main dashboard summarizes tracked assets under management, recent 13F filings, top holdings, and the latest institutional activity.

![OpenFinance market dashboard](./demo/dashboard.png)

### Fund 13F Filing Dashboard

The fund dashboard provides a closer look at a specific institution, including portfolio value, filing dates, top holdings, position weights, shares, and security details.

![OpenFinance fund 13F filing dashboard](./demo/13F_filling.png)

### Queue Dashboard

SEC ingestion jobs are processed with BullMQ. The Bull Board dashboard makes it possible to inspect queue activity, completed jobs, failures, and delayed work.

![OpenFinance BullMQ queue dashboard](./demo/queues.png)

## Current Features

- Real-time SEC filing ingestion for institutional 13F data.
- Holdings and portfolio analysis for tracked hedge funds.
- Fund-level dashboards with searchable holdings information.
- Sentiment analysis for each tracked hedge fund and across the tracked market.
- Market trend insights for sectors and stocks appearing in the latest filings.
- Redis-backed BullMQ queues for SEC data processing.
- Bull Board queue administration dashboard.

## Tech Stack

### Frontend

- [Next.js 16](https://nextjs.org/) with the App Router
- [React 19](https://react.dev/)
- [TanStack React Query](https://tanstack.com/query/latest)
- [tRPC](https://trpc.io/) client integration
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)

### Backend

- [Bun](https://bun.sh/) runtime and workspace tooling
- [Hono](https://hono.dev/) API server
- [tRPC](https://trpc.io/) for end-to-end type-safe APIs
- [BullMQ](https://docs.bullmq.io/) for SEC ingestion jobs
- [Bull Board](https://github.com/felixmosh/bull-board) for queue administration

### Data

- [PostgreSQL](https://www.postgresql.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Redis](https://redis.io/)

## Future Work

### AutoInvestment

AutoInvestment will use an AI agent to analyze institutional holdings, market activity, and portfolio trends. It will recommend stocks and sectors based on where tracked institutions are concentrating their investments.

### Brokerage Integration

A later phase will allow users to connect their brokerage accounts and create their own investment strategies inspired by hedge fund portfolios and institutional market signals.

## Project Structure

```text
.
├── apps/
│   ├── web/                       # Next.js dashboard
│   │   ├── app/                   # App Router pages
│   │   ├── components/            # Dashboard and shadcn/ui components
│   │   ├── hooks/                 # React Query and tRPC hooks
│   │   ├── lib/                   # Client utilities
│   │   └── providers/             # React providers
│   └── server/                    # Bun + Hono API server
│       ├── scripts/               # Queue and data seeding scripts
│       └── src/
│           ├── controllers/       # SEC data controllers
│           ├── providers/sec/     # SEC filing fetch and persistence logic
│           ├── queue/             # BullMQ queues and workers
│           └── trpc/              # tRPC router and procedures
├── packages/
│   └── shared/                    # Shared data layer and utilities
│       └── src/
│           ├── db/                # Drizzle schema and PostgreSQL client
│           ├── redis/             # Redis client
│           ├── types/             # Shared TypeScript types
│           ├── utils/             # Shared helpers
│           └── validations/       # Shared validation schemas
├── demo/                          # README screenshots
├── package.json                   # Bun workspace scripts
└── tsconfig.json                  # Shared TypeScript configuration
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/)
- PostgreSQL
- Redis

### Installation

Install dependencies from the repository root:

```bash
bun install
```

Create a local environment file:

```bash
cp .env.example .env
```

Configure the required environment variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/openfinance
REDIS_URL=redis://localhost:6379

PORT=3001
CLIENT_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001

BULLMQ_USER=admin
BULLMQ_PASS=change-me
SEC_FETCH_CRON=0 */6 * * *
SEC_USER_AGENT=OpenFinance contact@example.com
SEC_COOKIE=
```

### Database Setup

Push the Drizzle schema to PostgreSQL:

```bash
bun db:push
```

Open Drizzle Studio when you need to inspect the database:

```bash
bun db:studio
```

### Development

Start the web dashboard and API server together:

```bash
bun dev
```

The local services are available at:

- Web dashboard: `http://localhost:3000`
- API server: `http://localhost:3001`
- Health check: `http://localhost:3001/health`
- Queue dashboard: `http://localhost:3001/admin/bull-mq/dashboard`

Start or stop the recurring SEC ingestion schedule:

```bash
bun --cwd apps/server queue:start
bun --cwd apps/server queue:stop
```

### Useful Commands

```bash
bun dev:web          # Start only the Next.js app
bun dev:server       # Start only the Hono API server
bun build            # Build shared packages and applications
bun build:web        # Build the Next.js app
bun build:server     # Build the Hono server
bun build:packages   # Build the shared package
bun db:generate      # Generate Drizzle migrations
bun db:migrate       # Run Drizzle migrations
```

## Workspace Packages

- `@openfinance/web`: Next.js dashboard.
- `@openfinance/server`: Hono API, tRPC router, SEC ingestion, and BullMQ workers.
- `@openfinance/shared`: Drizzle database layer, Redis client, validation schemas, shared types, and helpers.

The web app imports the server's tRPC router type through `@openfinance/server/trpc`, keeping the client API contract type-safe without duplicating schemas.

## License

MIT
