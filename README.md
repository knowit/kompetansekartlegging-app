# kompetansekartlegging-app

This is an internal project for Knowit. The project aims
to create a tool to gauge the employees' skills and motivations
through a web form, and to make the analyses based on the form
available for the individual employees and managers.

## Dependencies

This project requires [npm](https://www.npmjs.com/get-npm).
All custom scripts are written in bash script.


## Running the project

To run the project locally:

1. Clone the GitHub repo.
2. Run `$ cd kompetansekartlegging-app` (or whatever you've chosen to
   name the project in the cloning process).
3. Run `$ ./install.sh`
4. Run `cd cdk`
6. Create a cdk.context.json file

   1. Add ENV to it. If you are deploying to a sandbox account, you can give it any value you want. These have to be unique, so you might get a conflict if it already exists on AWS. IF YOU ARE DEPLOYING TO PROD OR DEVELOPMENT the ENV value should be `prod` or `dev`. \
   2. IF DEPLOYING TO PROD OR DEVELOPMENT: Add GOOGLE_ID, GOOGLE_SECRET and AZURE to it, where GOOGLE_ID is the GCP App Id, GOOGLE_SECRET is the GCP App secret key, and AZURE is the Azure AD metadata url
7. Run `export AWS_PROFILE={aws cli profilename}` followed by `npm run deploy` and `npm run codegen` (Alternatively, go to root directory and run `./deploybackend.sh full`)
8. Change directory to frontend and run `npm start`


## Deploying CDK backend

To deploy the CDK backend you need to:
1. Clone the GitHub repo.
2. Run `$ cd kompetansekartlegging-app/cdk`
3. Run `$ npm install` in base folder (kompetansekartlegging-app/cdk). 
   Then, in the backend folder, run `npm install` in the src folders for each function, and run `npm install` in the presignup trigger.
4. Run `cdk bootstrap` in base folder (can skip if your AWS account has already done cdk bootstrap in other project)
5. Run `npm run deploy` (This command first does `cdk deploy` followed by executing the hooks/hooks.ts script)
6. Run `npm run codegen`

### After Setup:
* Run `./deploybackend.sh` to deploy changes to the backend
* Run `npm start` in frontend folder to run frontend locally

### Production deployment instructions can be found [here](https://github.com/knowit/Dataplattform-issues/wiki/Kompetansekartlegging:-Deployment-Guide-(CDK))

## Running cypress tests
1. Run `cd frontend`
2. Run `npm start` (if it is not running)
3. Open new terminal window and run `cd frontend`. Then run `npx cypress run`, tests will run in the terminal. 

## GitHub Actions
Every time you create a pull request, cypress tests will run automatically. 
NB! It takes ca 25 min to run them in GHA, while local running takes only 4-5 min. 



## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

## Special packages used:
* Appsync Transformer for CDK: https://github.com/kcwinner/cdk-appsync-transformer
* Codegen inspiration: https://github.com/kcwinner/advocacy/tree/master/cdk-amplify-appsync-helpers

# API docs

Documentation for the external API can be found at this projects Github Pages (`kompetansekartlegging-app/docs`) or at this URL: https://apidocs.kompetanse.knowit.no

