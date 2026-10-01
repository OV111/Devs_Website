# Backend image (alternative to Render's native Node runtime / Railway Nixpacks).
FROM node:22-alpine

# isolated-vm (the code-runner sandbox) is a native addon and compiles on install.
RUN apk add --no-cache python3 make g++

WORKDIR /app
ENV NODE_ENV=production HUSKY=0

COPY package*.json ./
# `prepare: husky` installs git hooks; husky is a devDependency, so with
# --omit=dev it doesn't exist and the install would fail. Hooks are meaningless
# in an image, so drop the script here only.
RUN npm pkg delete scripts.prepare && npm ci --omit=dev

COPY . .

# Run as the unprivileged user that ships with the node image, not root.
USER node

EXPOSE 5000
# --no-node-snapshot is required by isolated-vm on Node 20+.
CMD ["node", "--no-node-snapshot", "backend/server.js"]
