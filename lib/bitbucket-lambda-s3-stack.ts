import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import path = require('path');


export class BitbucketLambdaS3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // to get the role arn from the cdk.json file 
        // // Retrieve the role ARN from the context
        // const lambdaRoleArn = this.node.tryGetContext('lambdaRoleArn');
        // // Define the Lambda execution role
        // const lambdaRole = iam.Role.fromRoleArn(this, 'LambdaExecutionRole', lambdaRoleArn);

    const bucketName = this.node.tryGetContext('bucketName');

    // Define the Lambda execution role
    const lambdaRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ]
    });

    // Grant the Lambda function permissions to read from Secrets Manager and write to S3
    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'secretsmanager:GetSecretValue',
        's3:PutObject',
        's3:PutObjectAcl'
      ],
      resources: ['*']
    }));

    

    // Define the Lambda function
    const lambdaFunction = new lambda.Function(this, 'BitbucketLambdaFunction', {
      functionName:'BitbucketLambdaFunction',
      runtime: lambda.Runtime.PYTHON_3_10,
      handler: 'lambda_function.lambda_handler',
      //code: lambda.Code.fromAsset('lambda'),
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      //code: lambda.Code.fromAsset(props.lambdaPath),
      role: lambdaRole,
      environment: {
        BUCKET_NAME: bucketName
      },
      timeout:cdk.Duration.minutes(10),
      memorySize:512,
    });


    // Define the API Gateway
    const api = new apigateway.LambdaRestApi(this, 'BitbucketApi', {
      handler: lambdaFunction,
      proxy: false,
      restApiName:"BitbucketApi"
    });

    // Define the POST method for the API
    api.root.addMethod('POST');
  }
}
