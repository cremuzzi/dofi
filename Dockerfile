FROM golang:1.14.3-alpine3.11 AS builder

LABEL maintainer="Carlos Remuzzi carlosremuzzi@gmail.com"
LABEL org.label-schema.description="D0F1 15 n07 f1d0"
LABEL org.label-schema.name="D0F1"
LABEL org.label-schema.schema-version="1.0"
LABEL org.label-schema.vendor="Remuzzi"

WORKDIR /go/src/github.com/cremuzzi/dofi

COPY ./go.mod ./go.sum ./

RUN apk add --no-cache \
        git \
    && go mod download

COPY cmd/dofi cmd/dofi
RUN CGO_ENABLED=0 \
    GOARCH=amd64 \
    GOOS=linux \
    go build \
        -a -ldflags '-s -w -extldflags "-static"' \
        -o /go/bin/dofi github.com/cremuzzi/dofi/cmd/dofi

FROM scratch

LABEL maintainer="Carlos Remuzzi carlosremuzzi@gmail.com"
LABEL org.label-schema.description="D0F1 15 n07 f1d0"
LABEL org.label-schema.name="D0F1"
LABEL org.label-schema.schema-version="1.0"
LABEL org.label-schema.vendor="Remuzzi"

ENV CONFIG_PATH=/config.yaml

COPY --from=builder /go/bin/dofi /usr/bin/dofi

EXPOSE 9000

CMD ["dofi"]
