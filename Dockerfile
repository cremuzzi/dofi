FROM golang:1.14.3-alpine3.11 AS dev

LABEL maintainer="Carlos Remuzzi carlosremuzzi@gmail.com"
LABEL org.label-schema.description="D0F1 i5 n0t f1d0"
LABEL org.label-schema.name="D0F1"
LABEL org.label-schema.schema-version="1.0"
LABEL org.label-schema.vendor="Remuzzi"

WORKDIR /go/src/dofi

COPY ./src ./

RUN apk add --no-cache --virtual .build-deps \
        git \
    && go get -d -v ./... \
    && go build -ldflags='-s -w -extldflags=-static' -o /go/bin/

FROM busybox:musl

ENV BIND_ADDRESS=:9000 \
    CONFIG_FILE=/etc/dofi/config.yaml \
    BASE_URL=https://localhost:9000

COPY --from=builder /go/bin/dofi /usr/bin/dofi

EXPOSE 9000

CMD ["dofi"]
