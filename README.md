# Coffee_Station_Backend_Nick1

## Setup

1. `npm ci`
2. `cp .env.example .env` and `cp .env.test.example .env.test` (point `DATABASE_URL` at your Postgres)
3. `npm run db:generate`
4. `npm test`
5. `npm run db:migrate` and `npx prisma db seed` (dev database), then `npm run dev`
