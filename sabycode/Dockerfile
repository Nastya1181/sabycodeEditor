FROM node:16

# Кешируем node_modules
WORKDIR /client
COPY package.json /client
RUN npm install

# Основное
COPY . /client
EXPOSE 3000

CMD ["npm", "start"]