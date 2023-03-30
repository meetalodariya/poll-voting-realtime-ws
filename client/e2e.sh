#!/bin/bash

directory="./node_modules/.bin/cypress"

if [ ! -f $directory ]; then
    npm install
fi

while getopts ":o" option; do
    case $option in
    o)
        npm run test:e2e:open
        exit 0
        ;;
    esac
done

npm run test:e2e:run
