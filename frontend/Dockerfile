# Multi-stage: build the static site with Node, serve it with nginx -- the shipped image carries
# no Node runtime or source, just the compiled dist/ output and nginx.
#
# Uses pnpm (pnpm-lock.yaml is the lockfile start.sh and the project's own dev workflow actually
# use). Note: a package-lock.json also exists in this directory from npm having been run here at
# some point -- that's a pre-existing inconsistency in the repo, not something this Dockerfile
# tries to resolve; it's ignored here in favour of the pnpm lockfile that matches how the project
# is actually run.
FROM node:20-alpine AS build
WORKDIR /app

RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost/ >/dev/null || exit 1
