#!/bin/sh

# Setup
npm install
npm link

# test
echo 'test'

# Put credentials in the right Location
printf token > token.json


exit 0
