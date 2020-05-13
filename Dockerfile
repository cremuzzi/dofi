FROM node:14.2.0-alpine3.11

LABEL maintainer="Carlos Remuzzi carlosremuzzi@gmail.com"
LABEL org.label-schema.description="Dofi is not fido"
LABEL org.label-schema.name="dofi"
LABEL org.label-schema.schema-version="1.0"
LABEL org.label-schema.vendor="Remuzzi"

ENV PORT=9000

WORKDIR /home/node/app

COPY package.json .

RUN apk add --no-cache \
        tini \
    && npm i \
    && chown -R node:node /home/node/

COPY --chown=node:node ./src ./src

USER node

EXPOSE 9000

ENTRYPOINT ["/sbin/tini","--"]

CMD ["node","src/server.js"]
