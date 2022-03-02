# kompetansekartlegging-app

This is an internal project for Knowit. The project aims
to create a tool to gauge the employees' skills and motivations
through a web form, and to make the analyses based on the form
available for the individual employees and managers.

## Dependencies

This project requires [npm](https://www.npmjs.com/get-npm).


## Deploying CDK backend

To deploy the CDK backend you need to:
1. Clone the GitHub repo.
2. Run `$ cd kompetansekartlegging-app/cdk`
3. Run `$ npm install` in base folder (kompetansekartlegging-app/cdk). Then, in the backend folder, run `npm install` in the src folders for each function, and run `npm install` in the presignup trigger.
4. Run `cdk bootstrap` in base folder (can skip if your AWS account has already done cdk bootstrap in other project)
5. Run `npm run deploy` (This command first does `cdk deploy` followed by executing the hooks/hooks.ts script)
6. Run `npm run codegen`

## Running the project

To run the project locally:

1. Clone the GitHub repo.
2. Run `$ cd kompetansekartlegging-app` (or whatever you've chosen to
   name the project in the cloning process).
3. Run `$ npm install`
6. Run `npm start`.



## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
