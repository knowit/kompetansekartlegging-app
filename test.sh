#!/bin/bash
echo "Installing python dependencies..."
requirement_files=$(find . -name 'requirements.txt')
for requirement_file in $requirement_files;
do
    if [[ $requirement_file != *'node_modules'* && $requirement_file != *'cdk.out'* ]]; then
        pip install -q -r $requirement_file
    fi
done

echo "Running python tests..."
pytest

echo "Installing ./cdk dependencies..."
cd cdk && npm install -s
echo "Installing ./cdk/backend/function/AdminQueries dependencies..."
cd backend/function/AdminQueries && npm install -s

echo "Running ./cdk tests..."
cd ../../../ && npm run test