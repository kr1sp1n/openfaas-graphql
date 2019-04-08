FROM node:lts-alpine AS release
WORKDIR /app
ENV PORT=""
COPY package.json yarn.lock ./
RUN yarn install --production=true
COPY src ./src
COPY config/default.js ./config/
CMD ["node", "."]

FROM release AS dev
RUN yarn install --production=false
CMD ["yarn", "dev"]
