FROM node:22-alpine

WORKDIR /app
ADD package.json package.json
ADD package-lock.json package-lock.json

RUN npm ci

COPY src/* ./src/

CMD ["node", "src/main.js"]