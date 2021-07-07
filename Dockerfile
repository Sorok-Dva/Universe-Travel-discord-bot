ARG APT_FLAGS="-y -qq --no-install-recommends --no-install-suggests"

FROM node:15-buster-slim as packages

WORKDIR /build

ARG APT_FLAGS
ARG BUILD_PACKAGES="\
  g++ \
  make \
  python3 \
"

RUN apt-get update ${APT_FLAGS} \
  && apt-get install ${APT_FLAGS} ${BUILD_PACKAGES} \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm i --silent --only=production
RUN cp -a node_modules production_modules
RUN npm i --silent --only=dev

# Build stage

FROM packages as build

ENV NODE_ENV development

WORKDIR /build

COPY . .

RUN npm run build

# Final Image

FROM base

ENV NODE_ENV production

WORKDIR /app

COPY package.json .
COPY --from=build /build/dist dist
COPY --from=build /build/assets assets
COPY --from=packages /build/production_modules node_modules

CMD node dist
