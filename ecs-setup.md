# AWS ECS Setup Guide

## 🚀 Prerequisites

### 1. Create ECR Repository
```bash
aws ecr create-repository --repository-name cicd-workshop-demo --region us-east-1
```

### 2. Create ECS Cluster
```bash
aws ecs create-cluster --cluster-name cicd-workshop-cluster --capacity-providers FARGATE
```

### 3. Create Task Definition
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### 4. Create ECS Service
```bash
aws ecs create-service \
  --cluster cicd-workshop-cluster \
  --service-name cicd-workshop-service \
  --task-definition cicd-workshop-demo \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345],securityGroups=[sg-12345],assignPublicIp=ENABLED}"
```

## 🔐 Required GitHub Secrets

Add these secrets to your GitHub repository:

- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key  
- `AWS_REGION` - AWS region (e.g., us-east-1)
- `ECS_CLUSTER_NAME` - cicd-workshop-cluster
- `ECS_SERVICE_NAME` - cicd-workshop-service

## 🎯 What Happens on Deploy

1. **Build** Docker image
2. **Push** to Amazon ECR
3. **Update** ECS service with new image
4. **ECS** automatically deploys new containers
5. **Load balancer** routes traffic to healthy containers

## 💡 Benefits

- **Serverless** - No VM management
- **Auto-scaling** - Scales based on demand
- **High availability** - Multi-AZ deployment
- **Managed** - AWS handles infrastructure