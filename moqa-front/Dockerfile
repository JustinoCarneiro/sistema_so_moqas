# Estágio 1: Build com Node
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Estágio 2: Servir com Nginx
FROM nginx:stable-alpine
# Copia o build para o diretório do Nginx (ajuste 'moqa-front' para o nome no seu angular.json)
COPY --from=build /app/dist/moqa-front/browser /usr/share/nginx/html
# Copia configuração customizada do Nginx para suportar SPA/Proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80