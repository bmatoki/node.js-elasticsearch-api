FROM node:8.12.0-alpine
# Create a working directory 
WORKDIR /usr/src/app
# Install deps
RUN npm i -g pm2@3.0.4
RUN npm install -g nodemon@1.11.0

COPY ./package* ./
RUN npm install && \
    npm cache clean --force
COPY . .
# Expose ports (for orchestrators and dynamic reverse proxies)
EXPOSE 8080
EXPOSE 5858
# Start the app
CMD ["pm2-runtime","ecosystem.config.js"]
