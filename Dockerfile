
FROM node:20.17-alpine
#ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "./"]
RUN npm install
COPY . .
RUN npm run build
CMD [ "npm", "run", "start:prod" ]
