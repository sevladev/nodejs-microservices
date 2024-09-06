FROM node:18

WORKDIR /app/places

COPY package*.json ./
RUN npm install

COPY . .

COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

EXPOSE 3002

ENTRYPOINT ["./entrypoint.sh"]