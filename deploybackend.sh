#!/bin/bash

if [ "$#" -gt "0" ]
then
    if [[ "$1" == "full" ]]
    then
        cd cdk && npm run deploy && npm run codegen
    else
        echo "$1 is not a valid argument"
    fi
else
        cd cdk && npm run deploy
fi