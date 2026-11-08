FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

FROM golang:1.25-alpine AS httpd
WORKDIR /src
COPY docker/httpd.go ./
RUN go mod init httpd && CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/httpd .

FROM debian:bookworm-slim AS caps
RUN apt-get update \
    && apt-get install -y --no-install-recommends libcap2-bin \
    && rm -rf /var/lib/apt/lists/*
COPY --from=httpd /out/httpd /httpd
RUN setcap cap_net_bind_service=+ep /httpd

FROM debian:bookworm-slim
COPY --from=caps /httpd /httpd
COPY --from=build --chown=65532:65532 /app/build /srv

USER 65532:65532
ENV PORT=80
EXPOSE 80
ENTRYPOINT ["/httpd"]
