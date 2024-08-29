FROM node:18

WORKDIR /app/users

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]