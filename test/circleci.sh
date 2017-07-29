#!/bin/sh

# Setup
npm install
npm link

# test
echo 'test'

# Put credentials in the right Location
mkdir ~/.google-apps-script
printf token > ~/.google-apps-script/token.json
cat  ~/.google-apps-script/token.json

exit 0
