# Postman API Testing

In connection with rewriting from DynamoDB to Aurora, and thus the REST API instead of GraphQL, a Postman Collection has been created to test the endpoints. Follow the instructions below to set up on your own machine:

This guide covers the following steps:

1. Setup environment variables in Postman
2. Enable identify providers in AWS
3. Import Postman Collection
4. Authorization in Postman

## Setup environment variables - In Postman

1. Set up your own environment in the Environments tab in Postman
2. Add the following variables, `env-app-client-id`, `env-sanbox-name`, and `env-gateway-id`

The `env-app-client-id` can be found in the AWS Management Console under:  
`Cognito -> User pools -> [name of user pool you use for the application] -> App integration`

At the bottom you will see the app client list where the `Client ID` will be listed.

For the sandbox name, that is the one created when setting up the project locally. This should have been stored as an env variable in `cdk/cdk.context.json`

The `env-gateway-id` can be found under API Gateway in the AWS Management Console. It is the `id` of the ExpressLambda API.

_NB! Make sure the correct environment is selected in Postman._

## Enable Identity Providers - In AWS

To use this postman collection you need to enable Cognito user pool as an identity provider. To enable this go to through the following path in the AWS Management Console:  
`Cognito -> User pools -> [the user pool for this project] -> App integration`.  
On this page you will see a section called App clients and analytics.

1. Click on the app client for this project and go to the section called Hosted UI.
2. Click edit on this and scroll down til you see Identity providers. Here you add Cognito user pool from the list.
3. Save the changes and you should be ready to move forward!

## Import Postman Collection
In this repository, under `postman/collections/`, take the most recent json-file, download it and import in Postman.

## Authorization - In Postman
In order to use Postman with the API, you need to be authorized, and re-authorization is required every few hours as well.
To authorize yourselves, click the top-level folder of the collection (Called _Express Lambda_ as of 19th of June 2023), and navigate to the `Authorization` tab.
Scroll to the bottom and click `Get New Access Token`, before you log in with your account or a test-user.
Once you're logged in, make sure to proceed in postman and click "Use Token" in the popup. You're now ready to go!
