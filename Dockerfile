FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN --mount=type=secret,id=openai_api_key \
    sh -c "export OPENAI_API_KEY=$(cat /run/secrets/openai_api_key) && npm run build"

EXPOSE 3000

CMD ["npm", "start"]
