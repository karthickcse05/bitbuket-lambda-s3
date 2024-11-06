# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## Here's how you can do it:

Create a directory for your Lambda function code:

mkdir lambda
cd lambda

## Create a requirements.txt file for your Lambda function:

requests
boto3

## Install the dependencies locally:

pip install -r requirements.txt -t .

### Create your Lambda function code in lambda_function.py:

### Update your CDK stack to include the Lambda function, S3 bucket, and API Gateway: Open lib/bitbucket-lambda-s3-stack.ts and modify it to include the Lambda function, S3 bucket, and API Gateway:

## Deploy your CDK stack:

### Synthesize the CloudFormation template:
cdk synth

### Deploy the stack:

cdk deploy

This will create an AWS Lambda function that includes the requests library and other dependencies, and it will be triggered by an API Gateway endpoint. The Lambda function will download a ZIP file from a specified URL, save it to a temporary file, and upload it to an S3 bucket.
