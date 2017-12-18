FROM node:4.4.4 as builder

MAINTAINER Raj <rajendran.s@optisolbusiness.com>

# create app directory in container
RUN echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN apt-get update
RUN mkdir -p /app && npm i -g yarn bower gulp node-gyp

RUN apt-get -y install dpkg-dev python-software-properties build-essential --force-yes

# set /app directory as default working directory
WORKDIR /app

# only copy package.json initially so that `RUN yarn` layer is recreated only
# if there are changes in package.json
ADD package.json bower.json yarn.lock /app/

# --pure-lockfile: Don’t generate a yarn.lock lockfile
RUN npm install
RUN bower install --allow-root

COPY . /app/

RUN gulp build

FROM nginx:1.11.12-alpine

RUN rm /etc/nginx/conf.d/default.conf
ADD nginx/conf.d/ /etc/nginx/conf.d/

COPY --from=builder /app/dist/ /home/cft-web

EXPOSE 80
