# Etapa de build
FROM golang:1.24-alpine AS builder


RUN apk add --no-cache git

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o app ./cmd

FROM alpine:latest

RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY --from=builder /app/app .
COPY .env .env

EXPOSE 8080

CMD ["./app"]
