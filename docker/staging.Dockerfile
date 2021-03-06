FROM registry.cn-beijing.aliyuncs.com/9am/apis:staging AS apis

FROM node:slim AS web

EXPOSE 80

RUN mkdir -p /root
WORKDIR /root
ADD ./package.json /root/
RUN npm --registry https://registry.npm.taobao.org install

ADD . /root
COPY --from=apis /root/errorCode.js /root/src
RUN npm run build:staging
RUN rm -rf node_modules

FROM node:slim
COPY --from=web /root /root

CMD ["sh", "-c", "/root/scripts/start.sh staging"]
