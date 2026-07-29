FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate
WORKDIR /app

FROM base AS build
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.json ./
COPY apps/backend apps/backend
COPY packages packages
RUN pnpm install --frozen-lockfile
RUN cd apps/backend && pnpm prisma generate && pnpm build
RUN pnpm deploy --filter backend --prod /app/deploy

FROM base AS production
ENV NODE_ENV=production
COPY --from=build /app/deploy /app
COPY --from=build /app/apps/backend/dist /app/dist
EXPOSE 4000
CMD ["node", "dist/index.js"]
