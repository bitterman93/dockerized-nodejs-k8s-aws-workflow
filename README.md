# Demo Devops NodeJs

This app is a Node.js Express server that listens for incoming HTTP POST requests on the "/DevOps" endpoint. The app requires a JWT (JSON Web Token) to be present in the request headers in order to authorize access to the endpoint.

The app also checks for a specific API key in the request headers and returns an error if it is missing or incorrect. If the API key is present and correct, the app extracts the message, recipient, sender, and message time-to-live from the request body. If all of these parameters are present, the app returns a success message indicating that the message will be sent.

The app also has error handling functionality, which returns an error if the HTTP request method is not allowed, if the JWT is not authorized, or if the endpoint is not valid.

Finally, the app listens on the specified port (either the environment variable PORT or port 3000 by default), and sets up a process to gracefully handle SIGTERM signals, which allows for proper cleanup of the Node.js server when it is being shut down.

## JWT

```bash
This application uses as secret key:  'assessmentSK';
The JWT is: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vyvTq2o9gHyfpfrON9keW92PDtvaCSSRMgdXOvGnP9k';
ApiKey = '2f5ae96c-b558-4c7b-a590-a501ae1c3f6c';
```

## Local testing

### Installation

Clone this repo.

```bash
git clone https://github.com/bitterman93/dockerized-nodejs-k8s-aws-workflow.git
```

Install dependencies.

```bash
npm install
```
Run the app.

```bash
npm run start
```

Test the app.

```bash
curl -X POST -H "X-Parse-REST-API-Key: 2f5ae96c-b558-4c7b-a590-a501ae1c3f6c" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vyvTq2o9gHyfpfrON9keW92PDtvaCSSRMgdXOvGnP9k" -H "Content-Type: application/json" -d "{\"message\": \"This is a test\", \"to\": \"Juan Perez\", \"from\": \"Rita Asturia\", \"timeToLifeSec\": 45}" http://localhost:3000/DevOps
```

**Running tests locally.**

Unit tests.
```bash
npm run test
```

Static code analysis test
```bash
npm run lint
```

## Test the application online

The application is already deployed in EKS using github actions as CI/CD tool, this is the endpoint:

```bash
ac4c1a6b9741e49f6808f19a793e34cf-1841327574.us-east-1.elb.amazonaws.com/devops/
```

Test the endpoint using the following command:

```bash
curl -X POST -H "X-Parse-REST-API-Key: 2f5ae96c-b558-4c7b-a590-a501ae1c3f6c" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vyvTq2o9gHyfpfrON9keW92PDtvaCSSRMgdXOvGnP9k" -H "Content-Type: application/json" -d "{\"message\": \"This is a test\", \"to\": \"Juan Perez\", \"from\": \"Rita Asturia\", \"timeToLifeSec\": 45}" ac4c1a6b9741e49f6808f19a793e34cf-1841327574.us-east-1.elb.amazonaws.com/DevOps
```


## Created resources

In the following image, one can see the two pods running, along with the LoadBalancer service, deployment and replicaset. The replicaset displays both the desired and current size of the pods.
<img src="./inform/resourcescreated.png" alt="Alt text" title="Optional title">

## CI/CD Process for Dockerized Node.js Kubernetes AWS Workflow

This project uses GitHub Actions for automating Continuous Integration (CI) and Continuous Deployment (CD) processes. There are two workflows that handle different stages of the pipeline: one for building and testing the application, and another for deploying it to an Amazon EKS cluster.

**CI Workflow (ci-build-test.yml)**

This workflow is triggered on pull requests targeting the main branch. Its primary goal is to ensure that all code changes are validated before merging. The workflow performs the following steps:

**1. Checkout code:** The source code of the project is checked out from the repository.

**2. Set up Node.js environment:** Node.js is set up using the specified version (18.15.0) to run the project.

**3. Install dependencies:** Project dependencies are installed using npm ci for a clean installation.

**4. Run unit tests:** The test suite is executed using npm run test to ensure the functionality of the application.

**5. Run static code analysis:** Linting is performed using npm run lint to maintain code quality and identify potential issues.

**CD Workflow (deploy-to-production.yml)**

This workflow is triggered on push events to the main branch, and it is responsible for deploying the application to production. The deployment process includes:

**1. Checkout code:** The source code of the project is checked out from the repository.

**2. Build Docker image:** The Docker image of the application is built using the latest commit hash **(github.sha)** as the tag to ensure that each image is uniquely identifiable.

**3. Login to DockerHub:** The workflow uses GitHub secrets (**DOCKER_HUB_USERNAME** and **DOCKER_HUB_ACCESS_TOKEN**) to securely authenticate with DockerHub.

**4. Push Docker image:** The Docker image is tagged with the commit SHA and pushed to DockerHub for later use in the Kubernetes deployment.

**5. Configure AWS credentials:** AWS credentials (**AWS_ACCESS_KEY_ID**, **AWS_SECRET_ACCESS_KEY**) are configured via GitHub secrets to allow the workflow to interact with the EKS cluster.

**6. Deploy to Amazon EKS:** The Kubernetes deployment and service definitions are applied to the EKS cluster. The **envsubst** command is used to replace placeholders in the Kubernetes YAML files with environment variables, such as the Docker image name and the commit hash. The Kubernetes configuration is provided via a base64-encoded **KUBECONFIG_FILE**, stored securely in GitHub secrets.

## Key Concepts

**GitHub Secrets:** Sensitive information like DockerHub credentials, AWS credentials, and the KUBECONFIG_FILE are securely stored as secrets in GitHub. These secrets are used to authenticate and configure deployments without exposing credentials in the repository.

**GitHub Variables:** Variables such as IMAGE_NAME and AWS_REGION are used to dynamically set values across the workflows, enabling flexibility when managing different environments or Docker image versions.

**Commit SHA (github.sha):** The unique commit SHA is utilized to tag the Docker image. This ensures that each deployment is tied to a specific commit, allowing for easy traceability and rollback if needed.


## Kubenetes configuration

The Kubernetes configuration consists of a Deployment and a Service defined in separate YAML files.

### Deployment

The deployment.yml file defines the deployment of the application in the EKS cluster. It specifies:

Replicas: Two replicas of the pod are created to ensure high availability.
Pod Selector and Labels: The deployment is configured with a selector and labels to match the pods (app: ${IMAGE_NAME}-app), ensuring that the service can correctly route traffic to the pods.
Container Configuration: The container runs the Docker image built from the latest commit in DockerHub, listening on port 3000. Resource limits and requests are also defined to control memory and CPU usage.

### Service

The service.yml file defines a Kubernetes service that exposes the application to external traffic via an AWS LoadBalancer. It includes:

LoadBalancer Type: The service is of type LoadBalancer, which automatically provisions an external load balancer in AWS to handle incoming traffic.
Port Configuration: The service listens on port 80 and forwards requests to port 3000 on the application pods.
Pod Selector: The service uses a selector to match the pods based on the app: ${IMAGE_NAME}-app label, ensuring correct traffic routing.

This setup enables an automated, secure, and scalable deployment process for the Node.js application, leveraging Docker, Kubernetes, and AWS EKS to ensure that the application runs efficiently in production.

## License

Copyright © 2024 Brian Robles. All rights reserved.