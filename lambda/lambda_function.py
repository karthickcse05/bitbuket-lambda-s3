import requests
import boto3
import os
import json

def lambda_handler(event, context):
    print(event)
    body = json.loads(event['body'])
    repo_owner = 'kabiranwar'
    repo_slug = 'newbitbucketproj'
    api_token = ''
    commit_id = ''

    # S3 details
    s3_bucket_name = ''
    s3_key = 'path/in/s3/repo2.zip'

    # Temporary paths
    temp_zip_path = '/tmp/repo.zip'

    # Step 1 :Extract the commit ID from the push event
    try:
        # Bitbucket sends an array of changes, we need to iterate through them
        changes = body['push']['changes']
        for change in changes:
            # Each change contains an array of commits
            commits = change['commits']
            for commit in commits:
                commit_id = commit['hash']
                print(f"Commit ID: {commit_id}")            
    except KeyError as e:
        print(f"KeyError: {e}")
        print(f'Failed to get commit id: {e}')
        
    
    bitbucket_url= f'https://bitbucket.org/{repo_owner}/{repo_slug}/get/{commit_id}.zip'
    print(temp_zip_path)
    print(bitbucket_url)

    # Step 2: get the repository using requests
    
    # headers = {
    #     'Authorization': f'Bearer {api_token}'
    # }
    try:
        response = requests.get(bitbucket_url)
        print(response.status_code)
        # Step 3: Create a zip file from the cloned repository
        if response.status_code == 200:
            with open(temp_zip_path, 'wb') as f:
                f.write(response.content)
            print(f'Repository downloaded successfully to {temp_zip_path}')
        else:
            print(f'Failed to download repository: {response.status_code} {response.text}')
            exit(1)
    except Exception as e:
        print(f'Failed to clone the repo: {e}')
        exit(1)   

    # Step 4: Upload the zip file to S3
    s3_client = boto3.client('s3')
    try:
        s3_client.upload_file(temp_zip_path, s3_bucket_name, s3_key)
        print(f'File uploaded successfully to s3://{s3_bucket_name}/{s3_key}')
    except Exception as e:
        print(f'Failed to upload file to S3: {e}')
        exit(1)

    
    os.remove(temp_zip_path)
    print(f'Temporary files removed')
    return {
            'statusCode': 200,
            'body': json.dumps('Code pushed to S3 successfully!')
        }