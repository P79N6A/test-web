FROM registry.cn-beijing.aliyuncs.com/9am/apis:global AS apis

FROM node:slim

EXPOSE 80

RUN mkdir -p /root
WORKDIR /root
ADD ./package.json /root/
RUN npm install

ADD . /root
RUN npm run build:global
RUN rm -rf node_modules

FROM node:slim
COPY --from=0 /root /root

CMD ["sh", "-c", "/root/scripts/start.sh global"]
