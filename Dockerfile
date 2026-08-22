FROM node:22-alpine AS build
WORKDIR /app

RUN apk add --no-cache git

COPY package.json ./
RUN npm install

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAADcuzyq12TUmiIkX
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
