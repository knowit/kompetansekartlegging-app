#!/bin/bash
if [[ "$1" == "install-dependencies" ]]
then
    echo "Installing cdk dependencies..."
    npm install -s

    echo "Installing cdk/backend/function/AdminQueries dependencies..."
    cd backend/function/AdminQueries && npm install -s
    cd ../../..

    echo "Installing python dependencies..."
    requirement_files=$(find . -name 'requirements.txt')
    for requirement_file in $requirement_files;
    do
        if [[ $requirement_file != *'node_modules'* && $requirement_file != *'cdk.out'* ]]; then
            pip install -q -r $requirement_file
        fi
    done
fi

echo "Running python tests..."
pytest
if [ $? != 0 ]
then
    exit $?
fi

dynamo_container_name="dynamodb-local-container"
cognito_container_name="cognito-local-container"

echo "Pulling amazon/dynamodb-local docker image..."
docker pull amazon/dynamodb-local:latest

echo "Pulling jagregory/cognito-local docker image..."
docker pull jagregory/cognito-local:latest

echo "Starting amazon/dynamodb-local-container..."
docker run --name $dynamo_container_name -p 8000:8000 amazon/dynamodb-local &
echo "Waiting until dynamodb-local-container is running..."
until [ "`docker inspect -f {{.State.Running}} $dynamo_container_name`"=="true" ]; do
    sleep 0.1;
done;
echo "dynamodb-local-container is running"

echo "Starting jagregory/cognito-local-container..."
docker run --name $cognito_container_name -p 9229:9229 jagregory/cognito-local &
echo "Waiting until cognito-local-container is running..."
until [ "`docker inspect -f {{.State.Running}} $cognito_container_name`"=="true" ]; do
    sleep 0.1;
done;
echo "cognito-local-container is running"

npx jest --runInBand --verbose
exitCode=$?
docker stop $dynamo_container_name >/dev/null
docker rm $dynamo_container_name >/dev/null
docker stop $cognito_container_name >/dev/null
docker rm $cognito_container_name >/dev/null

exit $exitCode