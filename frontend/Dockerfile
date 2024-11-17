# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --prefer-offline --no-audit

COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL"
RUN yarn build

# Stage 2: Production runtime
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/.next ./.next

ENV NODE_ENV production

EXPOSE 3000

CMD ["yarn", "start"]
