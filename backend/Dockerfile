FROM oven/bun:1.2.13

WORKDIR /app

COPY . ./backend

WORKDIR /app/backend

RUN bun install --frozen-lockfile

WORKDIR /app

EXPOSE 3000

CMD ["bun", "run", "backend/index.ts"]