#!/bin/sh
# Copy all generated files into /root/qiniu
rm -rf /root/qiniu
mkdir -p /root/qiniu/
cp -rf /root/dist /root/qiniu/space
# Upload all files to qiniu
/root/scripts/qshell account h07mPP3LHfjO8BHJfCyIRsiichflVYIHtyNkXNoM 6keig4uqFJFLjs80aLAPfjb3rnaMaiPOgRNJ9uik
/root/scripts/qshell qupload /root/scripts/upload.config
# Copy all static files into /root/dist/static
rm -f /root/dist/static
mkdir -p /root/dist/static
cp -rf /root/static/* /root/dist/static/
# Start server
cd /root/server
npm i
node /root/server/app.js
