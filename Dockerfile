FROM node:stretch

EXPOSE 80

RUN mkdir -p /root
WORKDIR /root
ADD ./package.json /root/
RUN npm --registry https://registry.npm.taobao.org install

ADD . /root
RUN npm run build:pro
RUN rm -rf node_modules

CMD ["sh", "/root/scripts/start.sh"]
