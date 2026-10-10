npm run build && \
docker buildx build --platform linux/amd64,linux/arm64 --progress=plain -t ghcr.io/teenthofabud/jitsi-videoconference-plugin-app:X .