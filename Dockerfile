ARG APT_FLAGS="-y -qq --no-install-recommends --no-install-suggests"

FROM node:15-buster-slim as packages

WORKDIR /build

ARG APT_FLAGS
ARG BUILD_PACKAGES="\
  wget \
  curl \
  ca-certificates \
  g++ \
  gnupg2 \
  make \
  python3 \
  ffmpeg \
"

RUN apt-get update ${APT_FLAGS} \
  && apt-get install ${APT_FLAGS} ${BUILD_PACKAGES} \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN ["/bin/bash", "-c", "wget -qO- https://storage.yandexcloud.net/yandexcloud-yc/install.sh | \
	bash -s -- -a && echo 'source /root/yandex-cloud/completion.zsh.inc' >>  ~/.zshrc && source ~/.bashrc"]

COPY package*.json ./

RUN npm i --silent --only=production
RUN cp -a node_modules production_modules
RUN npm i --silent --only=dev

# Build stage

FROM packages as build

ENV NODE_ENV development

WORKDIR /build

ARG APT_FLAGS
ARG DEV_PACKAGES="\
  postgresql-client-12 \
"
RUN wget --no-check-certificate --quiet https://www.postgresql.org/media/keys/ACCC4CF8.asc
RUN apt-key add ACCC4CF8.asc
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ buster-pgdg main" > /etc/apt/sources.list.d/pgdg.list
RUN apt-get update ${APT_FLAGS} \
  && apt-get install ${APT_FLAGS} ${DEV_PACKAGES} \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY . .

RUN npm run build

# Final Image

FROM base

ENV NODE_ENV production

WORKDIR /app

COPY package.json .
COPY db/ db
COPY --from=build /build/dist dist
COPY --from=build /build/assets assets
COPY --from=packages /build/production_modules node_modules

CMD node dist
SHELL ["/bin/bash", "-c"]
