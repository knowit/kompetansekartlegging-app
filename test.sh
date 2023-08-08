#!/bin/bash
echo "Running ./cdk tests..."
cd cdk && ./test.sh install-dependencies && cd ..