FROM node:20-alpine

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app
COPY ./web ./
RUN pnpm install
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
