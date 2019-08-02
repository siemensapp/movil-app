
FROM node:10-alpine

ENV NODE_ROOT /usr/movil-app/
RUN mkdir -p $NODE_ROOT
WORKDIR $NODE_ROOT

COPY . .

RUN npm install -g @angular/cli
RUN npm install

# The default port from ng serve (4200)
# and 49153 for Webpack Hot Module Reload
EXPOSE 4300 