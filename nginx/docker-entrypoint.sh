#!/bin/sh

# Replace placeholders in the built index.html with runtime environment variables
envsubst '${VITE_API_BASE_URL}' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.tmp && \
mv /usr/share/nginx/html/index.tmp /usr/share/nginx/html/index.html

exec "$@"
