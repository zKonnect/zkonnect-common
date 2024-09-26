FROM node:20.12.2 AS build

WORKDIR /app

COPY package.json ./

COPY package-lock.json ./

COPY prisma ./prisma

RUN npm install

RUN npm run postinstall

COPY . .

RUN npm run build

FROM node:20.12.2-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD HOSTNAME="0.0.0.0" node server.js