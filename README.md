# SkyDock Monorepo

SkyDock is a Turborepo-based TypeScript monorepo with:

- a Vite + React web client
- an Express API server
- shared internal packages for db, ui, validation, types, and configs

## Tech Stack

- Node.js `>=24`
- Yarn `4` workspaces
- Turborepo
- TypeScript
- Prisma + PostgreSQL
- Vite + React + Tailwind CSS

## Project Structure

```text
.
├── apps
│   ├── server          # Express API
│   └── web             # Vite + React frontend
├── packages
│   ├── configs         # Shared eslint/tailwind/ts/prettier configs
│   ├── db              # Prisma schema, migrations, db client package
│   ├── docker-dev      # Local Postgres + MinIO docker-compose
│   ├── types           # Shared TypeScript types/enums
│   ├── ui              # Shared UI components/icons/styles
│   └── validation      # Shared validation package
├── turbo.json
└── package.json
```

## Environment Setup

1. Copy env template:

```sh
cp .env.example .env
```

2. Optionally create mode-specific overrides:

- `.env.dev`
- `.env.prod`

Environment variables are centralized at the repository root and consumed by apps/packages from there.

## Install

```sh
yarn install
```

## Local Infrastructure (Postgres + MinIO)

Start local services:

```sh
yarn workspace @skydock/docker-dev docker:up
```

Stop local services:

```sh
yarn docker:down
```

## Development

Run all dev tasks through Turborepo:

```sh
yarn dev
```

Key workspace scripts:

- `apps/web`: `yarn workspace web dev`
- `apps/server`: `yarn workspace server dev`
- `packages/db` generate client: `yarn workspace @skydock/db db:generate`
- `packages/db` migrate: `yarn db:migrate`
- `packages/db` studio: `yarn db:studio`
- `packages/db` seed: `yarn workspace @skydock/db db:seed`

## Build, Lint, Format

Build all workspaces:

```sh
yarn build
```

Lint all workspaces:

```sh
yarn lint
```

Format code:

```sh
yarn format
```

Check formatting:

```sh
yarn format:check
```

## Notes

- `turbo.json` tracks `.env`, `.env.dev`, and `.env.prod` as global dependencies.
- Global env inputs for task hashing include `DATABASE_URL`, `VITE_BACKEND_URL`, and `NODE_ENV`.
