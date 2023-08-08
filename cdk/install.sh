#!/bin/bash
npm install
cd backend/presignup && npm install
cd ../function/AdminQueries && npm install
cd ../createUserformBatch && npm install
cd ../externalAPI && npm install

# Install python packages
cd ../..
requirement_files=$(find . -name 'requirements.txt')
for requirement_file in $requirement_files;
do
    if [[ $requirement_file != *'node_modules'* && $requirement_file != *'cdk.out'* ]]; then
        pip install -q -r $requirement_file
    fi
done