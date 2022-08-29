import * as lambda from "@aws-sdk/client-lambda";

export default async (functionName: string) => {
    const lambdaClient = new lambda.LambdaClient({region: "eu-central-1"});

    console.log("Creating tables if they don't exists");
    const params = {
        FunctionName: functionName,
    };
    const invokeCommand = new lambda.InvokeCommand(params);
    const results = await lambdaClient.send(invokeCommand);

    if (results.StatusCode === 200) {
        console.log("Successfully created tables if they didn't exist")
    }
}