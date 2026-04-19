FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY backend/package.json ./backend/package.json
RUN npm install

COPY . .

WORKDIR /app/backend
EXPOSE 5000

CMD ["npm", "run", "start"]
