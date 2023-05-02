#!/bin/bash
echo "Installing python dependencies..."
requirement_files=$(find . -name 'requirements.txt')
for requirement_file in $requirement_files;
do
    if [[ $requirement_file != *'node_modules'* ]]; then
        pip install -q -r $requirement_file
    fi
done

echo "Running python tests..."
pytest