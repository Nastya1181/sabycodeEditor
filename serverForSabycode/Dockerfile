FROM node:16

# Кешируем node_modules
WORKDIR /server
COPY package.json /server
RUN npm install

# Основное
COPY . /server
EXPOSE 5000
VOLUME [ "/server/files" ]

CMD ["npm", "start"]