FROM node:24-alpine AS build

ARG API_BASE_PATH
ARG VITE_API_MOCKING
ARG VITE_MOCK_JWT_SECRET

ENV API_BASE_PATH=${API_BASE_PATH}
ENV VITE_API_MOCKING=${VITE_API_MOCKING}
ENV VITE_MOCK_JWT_SECRET=${VITE_MOCK_JWT_SECRET}

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --frozen-lockfile --filter web...

COPY apps/web apps/web

RUN pnpm --filter web build


FROM nginx:1.27-alpine AS runtime

COPY apps/web/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
