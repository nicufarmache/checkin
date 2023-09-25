FROM node:18-alpine AS BUILD_IMAGE

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

# remove development dependencies
RUN npm prune --production

FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/app/ ./

EXPOSE 3453

CMD [ "node", "index.js" ]