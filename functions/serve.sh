#!/bin/bash -xeu

removeRuntimeConfig(){
    rm .runtimeconfig.json;
}
trap removeRuntimeConfig exit

firebase functions:config:get > .runtimeconfig.json
echo created .runtimeconfig.json from functions config

echo serving functions locally
firebase serve --only functions

