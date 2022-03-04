
if [ $1 = "full" ]; then
    cd cdk && npm run deploy && npm run codegen
else
    cd cdk && npm run deploy
fi