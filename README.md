# OpenFinance Monorepo

A complete, type-safe finance management platform built with Bun, featuring strict end-to-end type safety across frontend and backend.

## 📦 Architecture

This is a Bun monorepo using workspaces with the following structure:

### Apps
- **web**: Next.js 15 frontend application with React 19
- **server**: Hono backend API server with tRPC

### Packages
- **db**: PostgreSQL database setup with Drizzle ORM, migrations, and shared schemas
- **types**: Shared TypeScript types with proper inference from database schemas
- **schemas**: Shared Zod validation schemas for end-to-end type safety
- **utils**: Shared utility functions

## 🛠️ Tech Stack

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- TailwindCSS with Shadcn UI
- TanStack React Query
- tRPC Client
- Recharts
- Lucide Icons

### Backend
- Hono
- tRPC
- TypeScript
- Bun Runtime
- Drizzle ORM

### Database
- PostgreSQL
- Drizzle ORM with migration support
- pg driver

### Monorepo
- Bun Workspaces
- Shared packages for types, schemas, and database
- Workspace aliases: `@openfinance/*`

## 🚀 Getting Started

### Prerequisites
- Bun (latest version)
- PostgreSQL (running locally or remote connection)

### Installation

1. Install dependencies:
```bash
bun install
```

2. Create `.env.local` file:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your database URL:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/openfinance
```

### Development

Start both frontend and backend in development mode:

```bash
bun dev
```

This runs:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

Or run individually:
```bash
bun dev:web    # Frontend only
bun dev:server # Backend only
```

### Database

Set up the database:

```bash
bun db:push    # Push schema to database
bun db:migrate # Run migrations
bun db:studio  # Open Drizzle Studio
```

### Building

Build all packages and apps:
```bash
bun build
```

Or build specific targets:
```bash
bun build:web
bun build:server
bun build:packages
```

## 🏗️ Project Structure

```
.
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── src/
│   │   │   └── app/        # App router pages
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   └── server/              # Hono backend
│       ├── src/
│       │   └── index.ts    # Server entry point
│       └── package.json
├── packages/
│   ├── db/                  # Drizzle ORM setup
│   │   ├── src/
│   │   │   ├── index.ts    # Database instance
│   │   │   ├── schema.ts   # Table definitions
│   │   │   └── trpc.ts     # tRPC router
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   ├── types/               # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   └── package.json
│   ├── schemas/             # Zod validation schemas
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── schemas.ts
│   │   └── package.json
│   └── utils/               # Shared utilities
│       ├── src/
│       │   ├── index.ts
│       │   └── helpers.ts
│       └── package.json
├── package.json             # Root workspace config
├── tsconfig.json            # Shared TypeScript config
├── .env.example
├── .gitignore
└── README.md
```

## 📝 Type Safety

This monorepo enforces strict end-to-end type safety:

- **Database Types**: Automatically inferred from Drizzle schemas
- **Validation Schemas**: Zod schemas for runtime type checking
- **Shared Types**: Reusable across frontend and backend
- **tRPC**: Type-safe API contracts between client and server
- **TypeScript**: Strict mode enabled globally

Example:
```typescript
import { type User } from "@openfinance/types";
import { createUserSchema } from "@openfinance/schemas";
import { db } from "@openfinance/db";

// Full type safety from database to API to frontend
const user = await db.query.users.findFirst();
const validated = createUserSchema.parse(user);
```

## 🔗 Workspace Aliases

All packages are aliased under `@openfinance/`:

```typescript
import { db } from "@openfinance/db";
import { type User } from "@openfinance/types";
import { createUserSchema } from "@openfinance/schemas";
import { formatCurrency } from "@openfinance/utils";
```

## 📦 Adding Dependencies

Add dependencies to the root:
```bash
bun add package-name
```

Add dependencies to a specific workspace:
```bash
bun add -w @openfinance/web package-name
bun add -w @openfinance/server package-name
```

## 🔗 Inter-package Dependencies

Packages reference each other using workspace protocol:

```json
{
  "dependencies": {
    "@openfinance/db": "workspace:*",
    "@openfinance/types": "workspace:*"
  }
}
```

## 📚 Learn More

- [Bun Documentation](https://bun.sh)
- [Next.js Documentation](https://nextjs.org)
- [Drizzle ORM](https://orm.drizzle.team)
- [tRPC](https://trpc.io)
- [Hono](https://hono.dev)
- [TailwindCSS](https://tailwindcss.com)

## 📄 License

MIT
