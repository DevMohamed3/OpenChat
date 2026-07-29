FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate
WORKDIR /app

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/backend/package.json apps/backend/
RUN pnpm install --frozen-lockfile --filter backend --prod

FROM base AS build
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.json ./
COPY apps/backend apps/backend
COPY packages packages
RUN pnpm install --frozen-lockfile
RUN cd apps/backend && pnpm prisma generate && pnpm build

FROM base AS production
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/apps/backend/dist /app/apps/backend/dist
COPY --from=build /app/apps/backend/prisma /app/apps/backend/prisma
COPY --from=build /app/apps/backend/package.json /app/apps/backend/package.json

EXPOSE 4000
CMD ["node", "apps/backend/dist/index.js"]
