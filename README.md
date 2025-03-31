## Basic Tasks REST API Server for basic CRUD operation with integration to AWS

- This project utilizes Node.JS and ExpressJS to setup a REST API server and currently in AWS through Lambda and API Gateway
- Currenmtly deployed in https://2bf5mlx50k.execute-api.ap-southeast-1.amazonaws.com/dev/tasks

### How to run locally

- Run `npm install`
- Run `npm run dev` and open `localhost:3001/tasks`

### How to deploy

- Move files into a zip file (Do not include .env files)
- Go to the AWS Lambda directory for the project and on the `Code Source` section, click the dropdown on the right and select `Upload from .zip file`
- Select and upload the newly created .zip file
- Once the .zip file is uploaded, it will automatically be deployed in AWS through API Gateway
- Access https://2bf5mlx50k.execute-api.ap-southeast-1.amazonaws.com/dev/tasks to verify changes
