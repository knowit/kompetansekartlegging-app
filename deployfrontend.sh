#!/bin/bash
cd frontend && npm run build
cd ../frontend-cdk && cdk deploy