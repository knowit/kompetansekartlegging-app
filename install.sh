#!/bin/bash
echo "Installing backend packages..."
cd cdk && ./install.sh
echo "Instaling frontend packages..."
cd ../frontend && npm install
echo "Instaling frontend cdk packages..."
cd ../frontend-cdk && npm install
echo "Finished installing packages"