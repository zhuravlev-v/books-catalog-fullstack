FROM node:24-alpine AS build

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json

RUN pnpm install --frozen-lockfile --filter api...

COPY apps/api apps/api

RUN pnpm --filter api build


FROM node:24-alpine AS runtime

ARG API_PORT=3001

RUN corepack enable

WORKDIR /app

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json

RUN pnpm install --prod --frozen-lockfile --filter api...

COPY --from=build /app/apps/api/dist apps/api/dist

EXPOSE ${API_PORT}

CMD ["pnpm", "--filter", "api", "start"]
