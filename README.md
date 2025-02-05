# mitotustaulukko

Example project using:
- postgres
- typescript
- nodejs
- react
- vite
- trpc (typesafe api endpoints)
- zapatos (db schema --> typescript types + crud helpers)
- dbmate (db migrations)
- also, testing server-sent events (SSE) for real-time server --> client messages


## First time setup

Start postgres docker image:
```
docker compose -f docker-compose.yml up --remove-orphans
```

Initialize 'mitotustaulukko' db:
```bash
psql -U postgres -d postgres -h localhost -p 5432
# password is in the docker-compose.yml

# create db
create database mitotustaulukko;

# connect to mitotustaulukko
\c mitotustaulukko;

# run schema.sql
\i db/schema.sql

# quit
\q
```

Install packages: `npm i`

Build: `npm run build`

## Running locally

Start dev server: `npm run dev`

Open browser at `http://localhost:5173/`


## Db migrations
1. Create new migration: `npx dbmate new migration_name`
2. Write migration sql to generated file at db/migrations/...
3. Run migration: `npx dbmate up`
4. Generate ts types and crud helpers from db schema (using zapatos): `npm run zap`

