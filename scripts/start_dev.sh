#!/bin/sh
# Copy all generated files into /root/qiniu
rm -rf /root/qiniu
mkdir -p /root/qiniu/
cp -rf /root/dist /root/qiniu/dev
# Copy all static files into /root/dist/static
rm -rf /root/dev/static
mkdir -p /root/dev/static
cp -rf /root/src/static/* /root/dev/static/
# Upload all files to qiniu
chmod +x /root/scripts/qshell
/root/scripts/qshell account h07mPP3LHfjO8BHJfCyIRsiichflVYIHtyNkXNoM 6keig4uqFJFLjs80aLAPfjb3rnaMaiPOgRNJ9uik
/root/scripts/qshell qupload /root/scripts/upload.config
# Start server
cd /root/server
npm i
node /root/server/app.js
