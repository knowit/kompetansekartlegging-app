# kompetansekartlegging-app

This is an internal project for Knowit. The project aims
to create a tool to gauge the employees' skills and motivations
through a web form, and to make the analyses based on the form
available for the individual employees and managers.

## Dependencies

This project requires [npm](https://www.npmjs.com/get-npm). It also requires that [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_install) are installed.
All custom scripts are written in bash script.


## Using AWS CLI SSO profiles
To use an AWS CLI sso profile, you need to run the sync_sso.py script before running our npm commands for deploying the backend. This script requires you to have boto3 installed on the python environment you use.
`python sync_sso.py awscliprofilename` is the full command you need to run. This creates temporary credentials for the SSO profile, allowing npm run deploy to use those to perform calls to AWS.

## Running the project

To run the project locally:

1. Clone the GitHub repo.
2. Run `$ cd kompetansekartlegging-app` (or whatever you've chosen to
   name the project in the cloning process)
3. Run `$ ./install.sh`
4. Run `cd cdk`
5. Configure AWS CLI credentials:
   * If you are using AWS SSO profiles you need to run `python sync_sso.py aws-cli-profile`
   * If not, run `aws configure` followed by either `export AWS_PROFILE={aws cli profilename}` on Linux/macOS or `set AWS_PROFILE={aws cli profilename}` on Windows, where `{aws cli profilename}=default` if you have not configured additional profiles
6. Run `cdk bootstrap`
7. Create a cdk.context.json file with an `ENV` key:
   * <b>Deploy to sandbox?</b> Give `ENV` any value you want, but it has to be unique, so you might get a conflict if it already exists on AWS
   * <b>Deploy to dev or prod?</b> The `ENV` value must be `dev` or `prod`. You also need to add an `AZURE` key (Azure AD metadata url)
   ```
   {
      "ENV": "exampleenv"
   }
   ```
8. Run `npm run deploy` followed by `npm run codegen` (Alternatively, go to root directory and run `./deploybackend.sh full`)
9. Run `cd ../frontend` followed by `npm start`


### After Setup:
* Run `./deploybackend.sh` to deploy changes to the backend
* Run `npm start` in frontend folder to run frontend locally
* For testing purposes, you can add data to your sandbox by running custom scripts such as `scripts/create_test_data.py`

### Production deployment instructions can be found [here](https://github.com/knowit/Dataplattform-issues/wiki/Kompetansekartlegging:-Deployment-Guide-(CDK))

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

## CI/CD
### Deployment
GitHub Actions is configured to deploy the app to the AWS dev environment on every PR merge. Additionally, you can trigger deployment through the dispatchable workflow "`Deploy to AWS`", specifying which environment to deploy to, and whether to deploy the entire app or the backend only.

# API docs

Documentation for the external API can be found at this projects Github Pages (`kompetansekartlegging-app/docs`) or at this URL: https://apidocs.kompetanse.knowit.no

