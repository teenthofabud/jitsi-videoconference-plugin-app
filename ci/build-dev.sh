npm test && \
npm run build:dev && \
docker buildx build --platform linux/amd64,linux/arm64 --progress=plain -t ghcr.io/teenthofabud/jitsi-videoconference-plugin-app:X-dev .