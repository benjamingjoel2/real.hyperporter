# syntax=docker/dockerfile:1

# ---- build ----------------------------------------------------------------
# Node 22 to match .nvmrc and the engines range in package.json, so the image
# builds on the same major the CI workflow uses.
FROM node:22-alpine AS build
WORKDIR /app

# Dependencies first, so an edit to source doesn't invalidate the npm layer.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# The site is fully static, so canonicals, OG URLs, the sitemap and
# robots.txt are all baked in at build time from SITE_URL. It has to be
# correct HERE, not at runtime — serving a build made with the wrong origin
# would emit wrong canonical tags.
# No default: this repository is a fork, and inheriting the upstream domain
# here would bake canonicals pointing at the other site into every page. The
# post-build SEO check rejects that, so a build without SITE_URL fails loudly.
ARG SITE_URL
ENV SITE_URL=$SITE_URL
ENV SITE_INDEXABLE=true
RUN npm run build

# ---- runtime --------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80 443
