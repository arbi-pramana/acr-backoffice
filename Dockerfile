# Stage 1: Build the Vue.js app
FROM node:18-alpine AS build-stage

RUN apk add --no-cache git

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build the app using the production environment by default
ARG VITE_MODE=production
RUN npm run build -- --mode $VITE_MODE

# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Allow runtime environment variables to replace at runtime
COPY ./nginx/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
