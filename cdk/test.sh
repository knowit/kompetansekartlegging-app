#!/bin/bash
container_name="dynamodb-local-container"

echo "Pulling amazon/dynamodb-local docker image..."
docker pull amazon/dynamodb-local
echo "Starting amazon/dynamodb-local-container..."
docker run --name $container_name -p 8000:8000 amazon/dynamodb-local &
echo "Waiting until dynamodb-local-container is running..."
until [ "`docker inspect -f {{.State.Running}} $container_name`"=="true" ]; do
    sleep 0.1;
done;
echo "dynamodb-local-container is running"
jest --verbose
exitCode=$?
docker stop $container_name >/dev/null
docker rm $container_name >/dev/null

exit $exitCode