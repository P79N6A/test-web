FROM node:stretch

EXPOSE 80

RUN mkdir -p /root
WORKDIR /root
ADD ./package.json /root/
RUN npm cache clean --force
RUN npm install

ADD . /root
RUN npm run build:pro
RUN rm -rf node_modules

CMD ["sh", "/root/scripts/start.sh"]
