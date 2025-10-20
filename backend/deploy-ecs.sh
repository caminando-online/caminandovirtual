#!/bin/bash

# Docker + ECS Deployment Script for Caminando Online Backend
# Prerequisites: Docker, AWS CLI, Git

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
APP_NAME="caminando-online-backend"
REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REPO_NAME="${APP_NAME}"
CLUSTER_NAME="${APP_NAME}-cluster"
SERVICE_NAME="${APP_NAME}-service"
TASK_FAMILY="${APP_NAME}-task"

echo -e "${BLUE}🚀 Deploying Caminando Online Backend to AWS ECS${NC}"

# Check prerequisites
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Run 'aws configure' first.${NC}"
    exit 1
fi

# Create ECR repository if it doesn't exist
echo -e "${GREEN}📦 Creating ECR repository...${NC}"
aws ecr describe-repositories --repository-names "${REPO_NAME}" --region "${REGION}" 2>/dev/null || \
aws ecr create-repository --repository-name "${REPO_NAME}" --region "${REGION}"

# Get ECR login token
echo -e "${GREEN}🔐 Logging into ECR...${NC}"
aws ecr get-login-password --region "${REGION}" | docker login --username AWS --password-stdin "${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

# Build Docker image
echo -e "${GREEN}🏗️  Building Docker image...${NC}"
docker build -t "${APP_NAME}" .

# Tag image for ECR
IMAGE_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}:latest"
docker tag "${APP_NAME}:latest" "${IMAGE_URI}"

# Push image to ECR
echo -e "${GREEN}📤 Pushing image to ECR...${NC}"
docker push "${IMAGE_URI}"

# Create ECS cluster if it doesn't exist
echo -e "${GREEN}🌐 Creating ECS cluster...${NC}"
aws ecs describe-clusters --clusters "${CLUSTER_NAME}" --region "${REGION}" | jq -e ".clusters[0].status == \"ACTIVE\"" 2>/dev/null || \
aws ecs create-cluster --cluster-name "${CLUSTER_NAME}" --region "${REGION}"

# Create task execution role if it doesn't exist
echo -e "${GREEN}🔑 Setting up IAM roles...${NC}"
EXECUTION_ROLE_ARN=$(aws iam get-role --role-name ecsTaskExecutionRole --query 'Role.Arn' --output text 2>/dev/null || echo "")
if [ -z "$EXECUTION_ROLE_ARN" ]; then
    aws iam create-role --role-name ecsTaskExecutionRole \
        --assume-role-policy-document '{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "ecs-tasks.amazonaws.com"
                    },
                    "Action": "sts:AssumeRole"
                }
            ]
        }'
    aws iam attach-role-policy --role-name ecsTaskExecutionRole \
        --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
    EXECUTION_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/ecsTaskExecutionRole"
fi

# Register task definition
echo -e "${GREEN}📋 Registering task definition...${NC}"
cat > task-definition.json << EOF
{
    "family": "${TASK_FAMILY}",
    "taskRoleArn": "${EXECUTION_ROLE_ARN}",
    "executionRoleArn": "${EXECUTION_ROLE_ARN}",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "256",
    "memory": "512",
    "containerDefinitions": [
        {
            "name": "${APP_NAME}",
            "image": "${IMAGE_URI}",
            "essential": true,
            "portMappings": [
                {
                    "containerPort": 8080,
                    "hostPort": 8080,
                    "protocol": "tcp"
                }
            ],
            "environment": [
                {"name": "NODE_ENV", "value": "production"},
                {"name": "PORT", "value": "8080"}
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/${APP_NAME}",
                    "awslogs-region": "${REGION}",
                    "awslogs-stream-prefix": "ecs"
                }
            },
            "healthCheck": {
                "command": ["CMD-SHELL", "curl -f http://localhost:8080/health || exit 1"],
                "interval": 30,
                "timeout": 5,
                "retries": 3,
                "startPeriod": 60
            }
        }
    ]
}
EOF

aws ecs register-task-definition --cli-input-json file://task-definition.json --region "${REGION}"

# Create CloudWatch log group
echo -e "${GREEN}📊 Creating CloudWatch log group...${NC}"
aws logs create-log-group --log-group-name "/ecs/${APP_NAME}" --region "${REGION}" 2>/dev/null || true

# Create Application Load Balancer
echo -e "${GREEN}⚖️  Setting up Application Load Balancer...${NC}"

# Create VPC and subnets (simplified - in production you'd use existing VPC)
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text)
SUBNETS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=${VPC_ID}" --query "Subnets[0:2].SubnetId" --output text | tr '\n' ',' | sed 's/,$//')

# Create security group for ALB
ALB_SG=$(aws ec2 create-security-group \
    --group-name "${APP_NAME}-alb-sg" \
    --description "Security group for ${APP_NAME} ALB" \
    --vpc-id "${VPC_ID}" \
    --query "GroupId" --output text)

aws ec2 authorize-security-group-ingress \
    --group-id "${ALB_SG}" \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

# Create ALB
ALB_ARN=$(aws elbv2 create-load-balancer \
    --name "${APP_NAME}-alb" \
    --subnets ${SUBNETS} \
    --security-groups "${ALB_SG}" \
    --scheme internet-facing \
    --type application \
    --query "LoadBalancers[0].LoadBalancerArn" --output text)

# Create target group
TARGET_GROUP_ARN=$(aws elbv2 create-target-group \
    --name "${APP_NAME}-tg" \
    --protocol HTTP \
    --port 8080 \
    --vpc-id "${VPC_ID}" \
    --target-type ip \
    --health-check-path "/health" \
    --query "TargetGroups[0].TargetGroupArn" --output text)

# Create ALB listener
aws elbv2 create-listener \
    --load-balancer-arn "${ALB_ARN}" \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn="${TARGET_GROUP_ARN}"

# Create ECS service
echo -e "${GREEN}🚀 Creating ECS service...${NC}"

# Create security group for ECS tasks
TASK_SG=$(aws ec2 create-security-group \
    --group-name "${APP_NAME}-task-sg" \
    --description "Security group for ${APP_NAME} ECS tasks" \
    --vpc-id "${VPC_ID}" \
    --query "GroupId" --output text)

aws ec2 authorize-security-group-ingress \
    --group-id "${TASK_SG}" \
    --protocol tcp \
    --port 8080 \
    --source-security-group "${ALB_SG}"

SERVICE_ARN=$(aws ecs create-service \
    --cluster "${CLUSTER_NAME}" \
    --service-name "${SERVICE_NAME}" \
    --task-definition "${TASK_FAMILY}" \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[${SUBNETS}],securityGroups=[${TASK_SG}],assignPublicIp=ENABLED}" \
    --load-balancers "targetGroupArn=${TARGET_GROUP_ARN},containerName=${APP_NAME},containerPort=8080" \
    --query "service.serviceArn" --output text)

# Wait for service to be stable
echo -e "${GREEN}⏳ Waiting for service to be stable...${NC}"
aws ecs wait services-stable --cluster "${CLUSTER_NAME}" --services "${SERVICE_NAME}"

# Get ALB DNS name
ALB_DNS=$(aws elbv2 describe-load-balancers --load-balancer-arns "${ALB_ARN}" --query "LoadBalancers[0].DNSName" --output text)

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Your API is available at: http://${ALB_DNS}${NC}"
echo -e "${GREEN}💚 Health check: http://${ALB_DNS}/health${NC}"
echo ""
echo -e "${BLUE}📋 Useful commands:${NC}"
echo "  aws ecs update-service --cluster ${CLUSTER_NAME} --service ${SERVICE_NAME} --desired-count 2  # Scale to 2 instances"
echo "  aws ecs describe-services --cluster ${CLUSTER_NAME} --services ${SERVICE_NAME}  # Check service status"
echo "  aws logs tail /ecs/${APP_NAME} --follow  # View logs"
echo ""
echo -e "${YELLOW}⚠️  Remember to:${NC}"
echo "  1. Update environment variables in the task definition"
echo "  2. Configure a custom domain and SSL certificate"
echo "  3. Set up monitoring and alerts"
echo "  4. Configure auto-scaling policies"

# Cleanup
rm -f task-definition.json