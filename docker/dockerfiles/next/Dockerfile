FROM node:20

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/. .

EXPOSE 7000

CMD ["npm", "run", "dev"]