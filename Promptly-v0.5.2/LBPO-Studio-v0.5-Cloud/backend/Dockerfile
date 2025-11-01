FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev || npm install
COPY . .
ENV PORT=10000 NODE_ENV=production
EXPOSE 10000
CMD ["npm","start"]
